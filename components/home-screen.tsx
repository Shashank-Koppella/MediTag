"use client"

import { useMemo, useState } from "react"
import { Pill, Plus, Settings, Search } from "lucide-react"

interface HomeScreenProps {
  user: any
  medicines: any[]
  onMedicineClick: (medicine: any) => void
  onAddMedicine: () => void
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

  const handleAddMedicineClick = async () => {
    if (typeof window === "undefined") return
    if (!("NDEFReader" in window)) {
      alert("NFC scanning is not supported on this device or browser.")
      return
    }
    setScanning(true)
    try {
      const ndef = new (window as any).NDEFReader()
      const controller = new AbortController()
      const done = new Promise<void>((resolve, reject) => {
        ndef.onreading = () => {
          controller.abort()
          resolve()
        }
        ndef.onerror = (e: any) => {
          controller.abort()
          reject(e)
        }
      })
      await ndef.scan({ signal: controller.signal })
      await done
      onAddMedicine()
    } catch (err: any) {
      const msg = err?.message || ""
      if (/NotAllowedError|SecurityError/i.test(msg)) {
        alert("NFC permission denied or unavailable. Ensure NFC is enabled and use a supported browser.")
      } else {
        alert("NFC scanning failed or was canceled.")
      }
    } finally {
      setScanning(false)
    }
  }

  const handleScanExistingClick = async () => {
    if (typeof window === "undefined") return
    if (!("NDEFReader" in window)) {
      alert("NFC scanning is not supported on this device or browser.")
      return
    }
    setScanningImport(true)
    try {
      const ndef = new (window as any).NDEFReader()
      const controller = new AbortController()
      const done = new Promise<any>((resolve, reject) => {
        ndef.onreading = (event: any) => {
          try {
            const rec = event.message?.records?.[0]
            if (!rec) throw new Error("No records found on tag.")
            let text = ""
            if (rec.recordType === "mime" && rec.mediaType === "application/json") {
              // rec.data is a DataView
              text = new TextDecoder().decode(rec.data)
            } else if (rec.recordType === "text") {
              text = new TextDecoder().decode(rec.data)
            } else {
              throw new Error("Unsupported record format.")
            }
            const parsed = JSON.parse(text)
            resolve(parsed?.data || parsed)
          } catch (e) {
            reject(e)
          } finally {
            controller.abort()
          }
        }
        ndef.onerror = (e: any) => {
          controller.abort()
          reject(e)
        }
      })
      await ndef.scan({ signal: controller.signal })
      const payload = await done
      if (!payload?.name || !payload?.dose) {
        alert("Tag does not contain valid medicine information.")
        return
      }
      onImportMedicine(payload)
    } catch (err: any) {
      const msg = err?.message || ""
      if (/NotAllowedError|SecurityError/i.test(msg)) {
        alert("NFC permission denied or unavailable. Ensure NFC is enabled and use a supported browser.")
      } else {
        alert("NFC scanning failed or was canceled.")
      }
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
