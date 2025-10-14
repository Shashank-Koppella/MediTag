"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MedicineDetailsScreen({ medicine, onBack }: { medicine: any; onBack: () => void }) {
  if (!medicine) return null

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
        <h1 className="text-xl font-semibold">Medicine Details</h1>
      </div>

      <div className="p-6">
        <div className="text-center mb-8">
          <div
            className="w-32 h-32 rounded-3xl mx-auto mb-4 flex items-center justify-center text-6xl"
            style={{ backgroundColor: medicine.color }}
          >
            {getShapeIcon(medicine.shape)}
          </div>

          <h2 className="text-2xl font-bold text-[#264233] mb-1">{medicine.name}</h2>
          <p className="text-xl font-semibold text-[#264233]">{medicine.dose}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dose</h3>
            <p className="text-gray-600">
              {medicine.frequency} times • {medicine.times.join(", ")}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Program</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Total {medicine.programDuration}</span>
              <span className="text-gray-600">{medicine.programDuration} left</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Total {medicine.totalQuantity} capsules</span>
              <span className="text-gray-600">{medicine.remainingQuantity} capsules left</span>
            </div>
          </div>
        </div>

        <Button className="w-full h-12 text-lg font-semibold bg-[#264233] hover:bg-[#1f362a] text-white rounded-xl mt-8">
          Change Schedule
        </Button>
      </div>
    </div>
  )
}
