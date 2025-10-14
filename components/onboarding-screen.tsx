"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface OnboardingScreenProps {
  step: number
  onNext: () => void
  onSkip: () => void
}

export default function OnboardingScreen({ step, onNext, onSkip }: OnboardingScreenProps) {
  const slides = [
    {
      img: "/images/onb-doctor.png",
      title: "Your health, on schedule",
      subtitle: "Take control of your well-being with effortless medication reminders.",
    },
    {
      img: "/images/onb-phone-card.png",
      title: "Advanced reminders, Easy use",
      subtitle: "Stay on track with ease and peace of mind, ensuring you never miss a dose.",
    },
    {
      img: "/images/onb-network.png",
      title: "For yourself, family and friends",
      subtitle: "Manage medication for everyone you care about with seamless profile switching.",
    },
  ]

  const current = slides[step - 1]

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      {/* Top row: back + skip (no status bar) */}
      <div className="flex items-center justify-between px-4 pt-4">
        {step > 1 ? (
          <button
            onClick={() => history.back()}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-200/60"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <span className="w-9" />
        )}
        <button onClick={onSkip} className="text-sm text-gray-600 px-2 py-2 rounded-lg hover:bg-gray-200/60">
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center px-8">
        <img src={current.img || "/placeholder.svg"} alt="" className="max-h-80 object-contain drop-shadow-md" />
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center space-x-2 mb-4">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-2 w-2 rounded-full ${i === step ? "bg-[#264233]" : "bg-gray-300"}`} aria-hidden />
        ))}
      </div>

      {/* Copy + CTA */}
      <div className="px-6 pb-8 text-center">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-2">{current.title}</h2>
        <p className="text-gray-600 text-sm mb-6">{current.subtitle}</p>

        <Button
          onClick={onNext}
          className="w-full h-12 rounded-xl bg-[#264233] hover:bg-[#1f362a] text-white text-base font-semibold"
        >
          {step === 3 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  )
}
