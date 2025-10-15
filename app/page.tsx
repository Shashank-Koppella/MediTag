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
  const [medicines, setMedicines] = useState<any[]>([]) // cleared dummy data

  const [medicineHistory] = useState<any[]>([]) // cleared dummy history

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

  const handleImportMedicine = (data: any) => {
    const base = {
      name: data.name,
      dose: data.dose,
      shape: data.shape || "pill",
      color: data.color || "#E8F5E8",
      frequency: Number(data.frequency) || 1,
      programDuration: Number(data.programDuration) || 1,
      times: Array.isArray(data.times) ? data.times : [],
    }
    const medicine = {
      ...base,
      id: medicines.length + 1,
      taken: false,
      totalQuantity: base.programDuration * base.frequency * 7,
      remainingQuantity: base.programDuration * base.frequency * 7,
    }
    setMedicines((m) => [...m, medicine])
    // Show details immediately
    setSelectedMedicine(medicine)
    setCurrentScreen("medicine-details")
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
            onImportMedicine={handleImportMedicine} // added
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
