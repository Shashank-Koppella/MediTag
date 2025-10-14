"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Phone, User, Heart } from "lucide-react"

interface EmergencyContactScreenProps {
  user: any
  onBack: () => void
  onSave: (contactData: any) => void
}

export default function EmergencyContactScreen({ user, onBack, onSave }: EmergencyContactScreenProps) {
  const [formData, setFormData] = useState({
    emergencyName: user?.emergencyName || "",
    emergencyPhone: user?.emergencyPhone || "",
    emergencyRelationship: user?.emergencyRelationship || "",
  })

  const handleInputChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="px-6 pt-10 pb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold">Emergency Contact</h1>
      </div>

      <div className="px-6 pb-16">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Emergency Contact Details</h2>
          <p className="text-gray-600 text-sm">This person will be notified in case of emergencies or missed meds.</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="emergencyName" className="text-lg font-medium text-gray-700 mb-2 block">
              Contact Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="emergencyName"
                value={formData.emergencyName}
                onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                className="h-12 text-lg pl-12"
                placeholder="Enter contact name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="emergencyPhone" className="text-lg font-medium text-gray-700 mb-2 block">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                className="h-12 text-lg pl-12"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="emergencyRelationship" className="text-lg font-medium text-gray-700 mb-2 block">
              Relationship
            </Label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="emergencyRelationship"
                value={formData.emergencyRelationship}
                onChange={(e) => handleInputChange("emergencyRelationship", e.target.value)}
                className="h-12 text-lg pl-12"
                placeholder="e.g., Son, Daughter, Spouse"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={() => onSave(formData)}
          className="w-full h-14 text-lg font-semibold bg-[#264233] hover:bg-[#1f362a] text-white rounded-xl mt-10"
        >
          Save Emergency Contact
        </Button>
      </div>
    </div>
  )
}
