interface WeeklyProgressProps {
  medicines: any[]
}

export default function WeeklyProgress({ medicines }: WeeklyProgressProps) {
  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]
  const today = 2 // Monday for demo

  const getDayStatus = (dayIndex: number) => {
    if (dayIndex < today) {
      // Past days - assume completed
      return "completed"
    } else if (dayIndex === today) {
      // Today - check if all medicines are taken
      const allTaken = medicines.every((med) => med.taken)
      return allTaken ? "completed" : "pending"
    } else {
      // Future days
      return "future"
    }
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const status = getDayStatus(index)
          return (
            <div key={day} className="text-center">
              <div className="text-xs text-gray-500 mb-2">{day}</div>
              <div
                className={`w-8 h-8 rounded-lg mx-auto transition-colors ${
                  status === "completed" ? "bg-[#2E7D32]" : status === "pending" ? "bg-red-500" : "bg-gray-200"
                }`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
