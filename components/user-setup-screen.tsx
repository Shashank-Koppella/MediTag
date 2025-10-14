"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserSetupScreenProps {
  onComplete: (userData: any) => void
}

export default function UserSetupScreen({ onComplete }: UserSetupScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    sex: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelationship: "",
  })

  const handleInputChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="p-6 min-h-screen bg-[#f7f7f7]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h1>
        <p className="text-gray-600">Please fill in your details to get started</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-lg font-medium text-gray-700 mb-2 block">
            Full Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="h-12 text-lg"
            placeholder="Enter your full name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="text-lg font-medium text-gray-700 mb-2 block">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              className="h-12 text-lg"
              placeholder="Age"
            />
          </div>
          <div>
            <Label htmlFor="sex" className="text-lg font-medium text-gray-700 mb-2 block">
              Sex
            </Label>
            <Select onValueChange={(v) => handleInputChange("sex", v)}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-lg font-medium text-gray-700 mb-2 block">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="h-12 text-lg"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-lg font-medium text-gray-700 mb-2 block">
            Address
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="h-12 text-lg"
            placeholder="Enter your address"
          />
        </div>

        <div className="border-t pt-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="emergencyName" className="text-lg font-medium text-gray-700 mb-2 block">
                Contact Name
              </Label>
              <Input
                id="emergencyName"
                value={formData.emergencyName}
                onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                className="h-12 text-lg"
                placeholder="Emergency contact name"
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone" className="text-lg font-medium text-gray-700 mb-2 block">
                Contact Phone
              </Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                className="h-12 text-lg"
                placeholder="Emergency contact phone"
              />
            </div>
            <div>
              <Label htmlFor="relationship" className="text-lg font-medium text-gray-700 mb-2 block">
                Relationship
              </Label>
              <Input
                id="relationship"
                value={formData.emergencyRelationship}
                onChange={(e) => handleInputChange("emergencyRelationship", e.target.value)}
                className="h-12 text-lg"
                placeholder="e.g., Son, Daughter, Spouse"
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onComplete(formData)}
        className="w-full h-14 text-lg font-semibold bg-[#264233] hover:bg-[#1f362a] text-white rounded-xl mt-8"
      >
        Save & Continue
      </Button>
    </div>
  )
}
