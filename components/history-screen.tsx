"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"

interface HistoryScreenProps {
  history: any[]
  onBack: () => void
  onRenew: (medicineId: string | number) => void
}

export default function HistoryScreen({ history, onBack, onRenew }: HistoryScreenProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="px-6 pt-10 pb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold">Medicine History</h1>
      </div>

      <div className="px-6 space-y-4 pb-16">
        {history.map((medicine) => (
          <div key={medicine.id} className="p-4 rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{medicine.name}</h3>
                  <p className="text-gray-600 text-sm">{medicine.dose}</p>
                  <p className="text-gray-500 text-xs">Completed {medicine.duration}</p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(medicine.completedDate).toLocaleDateString()}
                </div>
                <Button
                  size="sm"
                  className="rounded-full px-4 py-1 text-xs font-semibold bg-[#264233] hover:bg-[#1f362a] text-white"
                  onClick={() => onRenew(medicine.id)}
                >
                  Renew
                </Button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-green-600 text-sm font-medium">✓ Treatment completed successfully</p>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-500">Your completed medications will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
