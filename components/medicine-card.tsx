"use client"

import { Button } from "@/components/ui/button"
import { Clock, CheckCircle } from "lucide-react"

interface MedicineCardProps {
  medicine: any
  onClick: () => void
  onToggleTaken: () => void
}

export default function MedicineCard({ medicine, onClick, onToggleTaken }: MedicineCardProps) {
  const getShapeIcon = (shape: string) => {
    switch (shape) {
      case "pill":
        return "💊"
      case "capsule":
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
    <div
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
        medicine.taken ? "bg-[#E8F5E8] border-[#2E7D32]" : "bg-white border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
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
            <p className="text-gray-600 text-sm">
              {medicine.frequency} time{medicine.frequency > 1 ? "s" : ""} today
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
            onClick={(e) => {
              e.stopPropagation()
              onToggleTaken()
            }}
            className={`w-8 h-8 rounded-full ${
              medicine.taken ? "text-[#2E7D32] hover:bg-[#2E7D32]/10" : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <CheckCircle className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
