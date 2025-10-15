"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AddMedicineScreenProps {
  onAdd: (medicine: any) => void
  onCancel: () => void
  initialData?: Partial<{
    name: string
    dose: string
    shape: string
    color: string
    frequency: number
    programDuration: number
    times: string[]
  }>
}

export default function AddMedicineScreen({ onAdd, onCancel, initialData }: AddMedicineScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    dose: "",
    shape: "pill",
    color: "#E8F5E8",
    frequency: 1,
    programDuration: 4,
  })
  const [writing, setWriting] = useState(false)
  const { toast } = useToast()

  // Prefill the form when initialData is provided (e.g., from a scanned tag)
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        frequency: Number(initialData.frequency ?? prev.frequency),
        programDuration: Number(initialData.programDuration ?? prev.programDuration),
      }))
    }
  }, [initialData])

  const shapes = [
    { id: "pill", icon: "💊", name: "Pill" },
    { id: "capsule", icon: "💊", name: "Capsule" },
    { id: "syrup", icon: "🥤", name: "Syrup" },
    { id: "injection", icon: "💉", name: "Injection" },
    { id: "tablet", icon: "💊", name: "Tablet" },
  ]
  const colors = ["#E8F5E8", "#FFE8E8", "#E8F4FF", "#FFF3E0", "#F3E5F5"]

  const setField = (k: string, v: any) => setFormData((p) => ({ ...p, [k]: v }))

  const submit = async () => {
    if (!formData.name || !formData.dose) return

    // Require NFC to be available for saving
    const canUseNfc =
      typeof window !== "undefined" && window.isSecureContext && "NDEFReader" in window

    if (!canUseNfc) {
      toast({
        variant: "destructive",
        title: "NFC not available",
        description: "Use HTTPS (or localhost) and a supported browser with NFC enabled.",
      })
      return
    }

    setWriting(true)
    toast({ title: "Ready to write", description: "Hold near a writable NFC tag..." })
    try {
      const ndef = new (window as any).NDEFReader()
      const payload = {
        v: 1,
        type: "meditag/medicine",
        data: {
          name: formData.name,
          dose: formData.dose,
          shape: formData.shape,
          color: formData.color,
          frequency: formData.frequency,           // Times per day
          programDuration: formData.programDuration, // Program duration in weeks
          times: [],                                // optional per-time list
        },
      }
      const json = JSON.stringify(payload)

      await ndef.write({
        records: [
          { recordType: "mime", mediaType: "application/json", data: json },
          { recordType: "text", data: json }, // fallback for broader readers
        ],
      })

      toast({ title: "Tag written", description: `${formData.name} saved to tag.` })
      onAdd(formData) // only add after a successful write
    } catch (err: any) {
      const name = err?.name || ""
      const msg = err?.message || ""
      if (name === "NotAllowedError" || /NotAllowedError|SecurityError/.test(msg)) {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "Enable NFC and try again in a supported browser.",
        })
      } else if (name === "NotSupportedError") {
        toast({ variant: "destructive", title: "Unsupported tag", description: "Tag cannot be written." })
      } else if (name === "AbortError" || /timed out/i.test(msg)) {
        toast({ variant: "destructive", title: "Write canceled or timed out", description: "Hold near the tag and retry." })
      } else {
        toast({ variant: "destructive", title: "Write failed", description: "Could not write to NFC tag." })
      }
    } finally {
      setWriting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="px-6 pt-10 pb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="px-6">
        <h1 className="text-xl font-semibold mb-6">Add New Medicine</h1>

        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
              className="h-12 text-lg"
              placeholder="Medicine name"
            />
          </div>

          <div>
            <Label className="mb-2 block">Dose</Label>
            <Input
              value={formData.dose}
              onChange={(e) => setField("dose", e.target.value)}
              className="h-12 text-lg"
              placeholder="e.g., 300 mg"
            />
          </div>

          <div>
            <Label className="mb-3 block">Shape</Label>
            <div className="grid grid-cols-5 gap-3">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setField("shape", s.id)}
                  className={`p-4 rounded-xl border-2 flex items-center justify-center transition-colors ${formData.shape === s.id ? "border-[#264233] bg-[#E8F5E8]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span className="text-2xl">{s.icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Color</Label>
            <div className="flex space-x-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setField("color", c)}
                  className={`w-12 h-12 rounded-xl border-2 ${formData.color === c ? "border-[#264233] scale-110" : "border-gray-200"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Times per day</Label>
            <Input
              type="number"
              min="1"
              max="6"
              value={formData.frequency}
              onChange={(e) => setField("frequency", Number(e.target.value))}
              className="h-12 text-lg"
            />
          </div>

          <div>
            <Label className="mb-2 block">Program Duration (weeks)</Label>
            <Input
              type="number"
              min="1"
              value={formData.programDuration}
              onChange={(e) => setField("programDuration", Number(e.target.value))}
              className="h-12 text-lg"
            />
          </div>
        </div>

        <Button
          onClick={submit}
          className="w-full h-12 mt-8 mb-10 bg-[#264233] hover:bg-[#1f362a] text-white rounded-xl font-semibold"
          disabled={writing}
          aria-busy={writing}
        >
          Add Schedule
        </Button>
      </div>
    </div>
  )
}
