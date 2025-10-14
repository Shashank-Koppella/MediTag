"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"

interface KeepTrackScreenProps {
  medicines: any[]
  onBack: () => void
  onMedicineTaken: (medicineId: number) => void
}

export default function KeepTrackScreen({ medicines, onBack, onMedicineTaken }: KeepTrackScreenProps) {
  const getShapeIcon = (shape: string) => {
    switch (shape) {
      case "pill":
      case "capsule":
      case "tablet":
        return "💊"
      case "syrup":
        return "🥤"
      case "injection":
        return "💉"
      default:
        return "💊"
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="px-6 pt-10 pb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold">All Medicines</h1>
      </div>

      <div className="px-6 space-y-4 pb-16">
        {medicines.map((medicine) => (
          <div
            key={medicine.id}
            className={`p-4 rounded-2xl border-2 transition-all ${
              medicine.taken ? "bg-[#E8F5E8] border-[#264233]" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: medicine.color }}
                >
                  {getShapeIcon(medicine.shape)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{medicine.name}</h3>
                  <p className="text-gray-600 text-sm">{medicine.dose}</p>
                  <p className="text-gray-500 text-xs">
                    {medicine.frequency} time{medicine.frequency > 1 ? "s" : ""} today • {medicine.times.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!medicine.taken && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {medicine.times[0]}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMedicineTaken(medicine.id)}
                  className={`w-10 h-10 rounded-full ${
                    medicine.taken ? "text-[#264233] hover:bg-[#264233]/10" : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <CheckCircle className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {medicine.taken && (
              <div className="mt-3 pt-3 border-t border-[#264233]/20">
                <p className="text-[#264233] text-sm font-medium">✓ Taken today</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
