"use client"

import { useMemo, useState } from "react"
import { Pill, Plus, Settings, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface HomeScreenProps {
  user: any
  medicines: any[]
  onMedicineClick: (medicine: any) => void
  onAddMedicine: (prefill?: any) => void // changed: allow optional prefill
  onProfileClick: () => void
  onMedicineTaken: (medicineId: number) => void
  onKeepTrack: () => void
  onHistory: () => void
  onEmergency: () => void
  onImportMedicine: (data: any) => void
}

type FilterKey = "all" | "taken" | "missed"

export default function HomeScreen({
  user,
  medicines,
  onMedicineClick,
  onAddMedicine,
  onProfileClick,
  onImportMedicine,
}: HomeScreenProps) {
  // Normalize sample data with simple statuses to render badges
  const normalized = medicines.map((m, i) => ({
    ...m,
    status: m.taken ? "taken" : i % 3 === 2 ? "missed" : "pending",
    img: "/medicine-bottle.png",
  }))

  const [filter, setFilter] = useState<FilterKey>("all")
  const [scanning, setScanning] = useState(false)
  const [scanningImport, setScanningImport] = useState(false)
  const { toast } = useToast()

  // Decode NDEF Text record payload (strip status byte + language code)
  const decodeTextRecord = (data: DataView) => {
    const status = data.getUint8(0)
    const langLen = status & 0x3f
    const utf16 = (status & 0x80) !== 0
    const enc = utf16 ? "utf-16" : "utf-8"
    return new TextDecoder(enc).decode(
      data.buffer.slice(data.byteOffset + 1 + langLen, data.byteOffset + data.byteLength)
    )
  }

  const parseNdefJson = (event: any) => {
    const records = event?.message?.records || []
    let jsonStr: string | null = null
    for (const rec of records) {
      if (rec.recordType === "mime" && rec.mediaType === "application/json") {
        jsonStr = new TextDecoder().decode(rec.data)
        break
      }
      if (!jsonStr && rec.recordType === "text") {
        jsonStr = decodeTextRecord(rec.data)
      }
    }
    if (!jsonStr) return null
    try {
      const obj = JSON.parse(jsonStr)
      return obj?.data || obj
    } catch {
      return null
    }
  }

  // One-shot scan with cleanup and timeout
  const scanOnce = async () => {
    const ndef = new (window as any).NDEFReader()
    const controller = new AbortController()
    const signal = controller.signal
    const result = await new Promise<any>((resolve, reject) => {
      const onReading = (event: any) => {
        cleanup()
        resolve(event)
      }
      const onReadingError = () => {
        cleanup()
        reject(new Error("Tag is not NDEF-formatted or could not be read."))
      }
      const cleanup = () => {
        ndef.removeEventListener("reading", onReading as any)
        ndef.removeEventListener("readingerror", onReadingError as any)
        clearTimeout(timer)
        controller.abort()
      }
      ndef.addEventListener("reading", onReading as any, { once: true })
      ndef.addEventListener("readingerror", onReadingError as any, { once: true })
      const timer = setTimeout(() => {
        cleanup()
        reject(new DOMException("Scan timed out.", "AbortError"))
      }, 15000)
      ndef.scan({ signal }).catch((err: any) => {
        clearTimeout(timer)
        ndef.removeEventListener("reading", onReading as any)
        ndef.removeEventListener("readingerror", onReadingError as any)
        reject(err)
      })
    })
    return result
  }

  const ensureNfcAvailable = () => {
    if (typeof window === "undefined") return false
    if (!window.isSecureContext) {
      toast({
        variant: "destructive",
        title: "NFC requires HTTPS",
        description: "Open the site over HTTPS (or use localhost) in a supported browser.",
      })
      return false
    }
    if (!("NDEFReader" in window)) {
      toast({
        variant: "destructive",
        title: "NFC not supported",
        description: "Use Chrome/Edge on Android with NFC enabled.",
      })
      return false
    }
    return true
  }

  const showNfcError = (err: any) => {
    const name = err?.name || ""
    const msg = err?.message || ""
    if (name === "NotAllowedError" || /NotAllowedError|SecurityError/.test(msg)) {
      toast({
        variant: "destructive",
        title: "NFC permission denied or disabled",
        description: "Enable NFC and try again in Chrome/Edge on Android.",
      })
    } else if (name === "NotSupportedError") {
      toast({
        variant: "destructive",
        title: "NFC not supported",
        description: "This device doesn’t support NFC.",
      })
    } else if (name === "AbortError" || /timed out/i.test(msg)) {
      toast({
        variant: "destructive",
        title: "Scan timed out or canceled",
        description: "Hold the phone near the tag and try again.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "NFC scan failed",
        description: "Could not read the tag.",
      })
    }
  }

  const handleAddMedicineClick = async () => {
    if (!ensureNfcAvailable()) return
    setScanning(true)
    toast({ title: "Hold near the NFC tag", description: "Scanning..." })
    try {
      const event = await scanOnce()
      const prefill = parseNdefJson(event)
      toast({ title: "Tag detected" })
      onAddMedicine(prefill || undefined)
    } catch (err: any) {
      showNfcError(err)
    } finally {
      setScanning(false)
    }
  }

  const handleScanExistingClick = async () => {
    if (!ensureNfcAvailable()) return
    setScanningImport(true)
    toast({ title: "Hold near the NFC tag", description: "Scanning..." })
    try {
      const event = await scanOnce()
      const payload = parseNdefJson(event)
      if (!payload?.name || !payload?.dose) {
        toast({
          variant: "destructive",
          title: "Invalid tag",
          description: "No valid medicine info found.",
        })
        return
      }
      toast({ title: "Medicine found", description: payload.name })
      onImportMedicine(payload)
    } catch (err: any) {
      showNfcError(err)
    } finally {
      setScanningImport(false)
    }
  }

  const filtered = useMemo(() => {
    if (filter === "all") return normalized
    if (filter === "taken") return normalized.filter((m) => m.status === "taken")
    return normalized.filter((m) => m.status === "missed")
  }, [filter, normalized])

  const counts = useMemo(
    () => ({
      all: normalized.length,
      taken: normalized.filter((m) => m.status === "taken").length,
      missed: normalized.filter((m) => m.status === "missed").length,
    }),
    [normalized],
  )

  // --- dynamic week + selection ---
  const toDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const today = toDateOnly(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(today)

  const startOfWeekMonday = (() => {
    const d = new Date(today)
    const mondayOffset = (d.getDay() + 6) % 7 // 0 = Monday
    d.setDate(d.getDate() - mondayOffset)
    return d
  })()

  const dayLabels = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const
  const displayedDays = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(startOfWeekMonday)
    d.setDate(startOfWeekMonday.getDate() + i)
    return d
  })

  const isSameDay = (a: Date, b: Date) => a.getTime() === b.getTime()
  // --- end dynamic week ---

  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-28">
      {/* Header (left: greeting, right: avatar) */}
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-[20px] font-semibold text-gray-900 truncate">
              {"Hello, " + (user?.name ? user.name : "User") + "!"}
            </h1>
            <p className="text-gray-500 text-sm">Welcome!</p>
          </div>
          <img src="/circle-avatar.png" alt="Profile" className="w-11 h-11 rounded-full object-cover" />
        </div>

        {/* Week tracker (dynamic, Mon → next Mon) */}
        <div className="flex justify-between mt-6">
          {displayedDays.map((d, index) => {
            const isFuture = d.getTime() > today.getTime()
            const isSelected = isSameDay(d, selectedDate)
            const isToday = isSameDay(d, today)

            return (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2 font-medium">
                  {dayLabels[d.getDay()]}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isFuture) setSelectedDate(d)
                  }}
                  disabled={isFuture}
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    isSelected
                      ? "bg-[#264233] text-white"
                      : isToday
                        ? "bg-orange-500 text-white"
                        : "text-gray-700 bg-white border border-gray-200",
                    isFuture ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-300",
                  ].join(" ")}
                  title={isFuture ? "Future date" : "Select date"}
                  aria-pressed={isSelected}
                >
                  {d.getDate()}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today’s Medication heading */}
      <div className="px-6 mt-2">
        <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Medication</h2>
      </div>

      {/* Segmented tabs */}
      <div className="px-6 mt-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-2 flex items-center space-x-2">
          {[
            { key: "all", label: `All ${counts.all}` },
            { key: "taken", label: `Taken ${counts.taken}` },
            { key: "missed", label: `Missed ${counts.missed}` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key as FilterKey)}
              className={`flex-1 text-sm font-medium px-3 py-2 rounded-xl transition ${
                filter === t.key ? "bg-[#264233] text-white" : "text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medication cards (no 'Take' buttons) */}
      {filtered.length === 0 ? (
        <div className="px-6 mt-12">
          <div className="text-center text-gray-400 select-none pointer-events-none">
            No medication added
          </div>
        </div>
      ) : (
        <div className="px-6 mt-4 space-y-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-gray-200 p-3 cursor-pointer"
              onClick={() => onMedicineClick(m)}
            >
              <div className="flex">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-3 flex items-center justify-center">
                  <img
                    src={m.img || "/placeholder.svg"}
                    alt={`${m.name} image`}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{m.name}</div>
                      <div className="text-gray-500 text-sm">
                        {m.frequency} {m.frequency > 1 ? "times" : "time"} • {m.dose}
                      </div>
                      <div className="text-gray-500 text-sm">{m.times?.[0] ? `${m.times[0]} | Daily` : "Daily"}</div>
                    </div>
                    {m.status === "missed" && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full ml-2 shrink-0">Missed</span>
                    )}
                    {m.status === "taken" && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full ml-2 shrink-0">Taken</span>
                    )}
                  </div>
                  {/* No Take button below time per request */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom tab bar: My Meds, Add +, Scan, Setting */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col items-center text-gray-700"
          >
            <Pill className="w-6 h-6" />
            <span className="text-xs mt-1">My Meds</span>
          </button>

          <button
            onClick={handleAddMedicineClick}
            className="flex flex-col items-center text-white bg-[#264233] rounded-2xl w-14 h-12 justify-center"
            disabled={scanning}
            aria-busy={scanning}
          >
            <Plus className="w-6 h-6 text-white" />
            <span className="sr-only">Add Meds</span>
          </button>

          <button
            onClick={handleScanExistingClick}
            className="flex flex-col items-center text-white bg-[#264233] rounded-2xl w-14 h-12 justify-center"
            disabled={scanningImport}
            aria-busy={scanningImport}
          >
            <Search className="w-6 h-6 text-white" />
            <span className="sr-only">Scan Medicine</span>
          </button>

          <button onClick={onProfileClick} className="flex flex-col items-center text-gray-700">
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Setting</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
