"use client"

import { useEffect, useState } from "react"
import SplashScreen from "@/components/splash-screen"
import OnboardingScreen from "@/components/onboarding-screen"
import UserSetupScreen from "@/components/user-setup-screen"
import HomeScreen from "@/components/home-screen"
import MedicineDetailsScreen from "@/components/medicine-details-screen"
import AddMedicineScreen from "@/components/add-medicine-screen"
import ProfileScreen from "@/components/profile-screen"
import KeepTrackScreen from "@/components/keep-track-screen"
import HistoryScreen from "@/components/history-screen"
import EmergencyContactScreen from "@/components/emergency-contact-screen"

export default function MediTagApp() {
  const [currentScreen, setCurrentScreen] = useState<
    // include splash first
    | "splash"
    | "onboarding"
    | "user-setup"
    | "home"
    | "keep-track"
    | "history"
    | "emergency"
    | "medicine-details"
    | "add-medicine"
    | "profile"
  >("splash")
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [medicines, setMedicines] = useState<any[]>([
    {
      id: 1,
      name: "Atorvastatin",
      dose: "20 mg",
      shape: "pill",
      color: "#E8F5E8",
      frequency: 1,
      times: ["9 am"],
      programDuration: "12 weeks",
      totalQuantity: 84,
      remainingQuantity: 72,
      taken: false,
    },
    {
      id: 2,
      name: "Gabapentin",
      dose: "300 mg",
      shape: "capsule",
      color: "#FFA726",
      frequency: 3,
      times: ["9 am", "3 pm", "9 pm"],
      programDuration: "8 weeks",
      totalQuantity: 168,
      remainingQuantity: 126,
      taken: true,
    },
    {
      id: 3,
      name: "Lexapro",
      dose: "10 mg",
      shape: "pill",
      color: "#E3F2FD",
      frequency: 1,
      times: ["9 am"],
      programDuration: "16 weeks",
      totalQuantity: 112,
      remainingQuantity: 98,
      taken: false,
    },
    {
      id: 4,
      name: "Ibuprofen",
      dose: "400 mg",
      shape: "pill",
      color: "#FFF3E0",
      frequency: 2,
      times: ["12 pm", "8 pm"],
      programDuration: "2 weeks",
      totalQuantity: 28,
      remainingQuantity: 14,
      taken: false,
    },
  ])

  const [medicineHistory] = useState<any[]>([
    { id: 5, name: "Aspirin", dose: "100 mg", completedDate: "2024-01-15", duration: "4 weeks" },
    { id: 6, name: "Vitamin D", dose: "1000 IU", completedDate: "2024-01-10", duration: "8 weeks" },
    { id: 7, name: "Metformin", dose: "500 mg", completedDate: "2023-12-20", duration: "12 weeks" },
  ])

  // Splash -> Onboarding in 3 seconds
  useEffect(() => {
    if (currentScreen === "splash") {
      const t = setTimeout(() => setCurrentScreen("onboarding"), 3000)
      return () => clearTimeout(t)
    }
  }, [currentScreen])

  const handleScreenChange = (screen: typeof currentScreen, data?: any) => {
    setCurrentScreen(screen)
    if (data) {
      if (screen === "medicine-details") setSelectedMedicine(data)
      if (screen === "home" && data.user) setUser(data.user)
    }
  }

  const handleOnboardingNext = () => {
    if (onboardingStep < 3) setOnboardingStep(onboardingStep + 1)
    else setCurrentScreen("user-setup")
  }

  const handleAddMedicine = (newMedicine: any) => {
    const medicine = {
      ...newMedicine,
      id: medicines.length + 1,
      taken: false,
      totalQuantity: newMedicine.programDuration * newMedicine.frequency * 7,
      remainingQuantity: newMedicine.programDuration * newMedicine.frequency * 7,
    }
    setMedicines((m) => [...m, medicine])
    setCurrentScreen("home")
  }

  const handleMedicineTaken = (medicineId: number) => {
    setMedicines((m) => m.map((med) => (med.id === medicineId ? { ...med, taken: !med.taken } : med)))
  }

  const handleRenew = () => {
    // For now, go to add-medicine flow
    setCurrentScreen("add-medicine")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen />
      case "onboarding":
        return (
          <OnboardingScreen
            step={onboardingStep}
            onNext={handleOnboardingNext}
            onSkip={() => setCurrentScreen("user-setup")}
          />
        )
      case "user-setup":
        return <UserSetupScreen onComplete={(userData) => handleScreenChange("home", { user: userData })} />
      case "home":
        return (
          <HomeScreen
            user={user}
            medicines={medicines}
            onMedicineClick={(medicine) => handleScreenChange("medicine-details", medicine)}
            onAddMedicine={() => handleScreenChange("add-medicine")}
            onProfileClick={() => handleScreenChange("profile")}
            onMedicineTaken={handleMedicineTaken}
            onKeepTrack={() => handleScreenChange("keep-track")}
            onHistory={() => handleScreenChange("history")}
            onEmergency={() => handleScreenChange("emergency")}
          />
        )
      case "keep-track":
        return (
          <KeepTrackScreen
            medicines={medicines}
            onBack={() => handleScreenChange("home")}
            onMedicineTaken={handleMedicineTaken}
          />
        )
      case "history":
        return (
          <HistoryScreen
            history={medicineHistory}
            onBack={() => handleScreenChange("home")}
            onRenew={() => handleRenew()}
          />
        )
      case "emergency":
        return (
          <EmergencyContactScreen
            user={user}
            onBack={() => handleScreenChange("home")}
            onSave={(contactData) => {
              setUser({ ...user, ...contactData })
              handleScreenChange("home")
            }}
          />
        )
      case "medicine-details":
        return <MedicineDetailsScreen medicine={selectedMedicine} onBack={() => handleScreenChange("home")} />
      case "add-medicine":
        return <AddMedicineScreen onAdd={handleAddMedicine} onCancel={() => handleScreenChange("home")} />
      case "profile":
        return (
          <ProfileScreen
            user={user}
            onBack={() => handleScreenChange("home")}
            onLogout={() => handleScreenChange("splash")}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-sm mx-auto min-h-screen relative overflow-hidden bg-[#f7f7f7]">{renderScreen()}</div>
    </div>
  )
}
