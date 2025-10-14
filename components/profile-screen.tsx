"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Phone, MapPin, UserCheck, Stethoscope, Tag } from "lucide-react"

export default function ProfileScreen({
  user,
  onBack,
  onLogout,
}: { user: any; onBack: () => void; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="px-6 pt-10 pb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold">Profile & Settings</h1>
      </div>

      <div className="p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#264233] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-600">{user?.age} years old</p>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">{user?.phone}</p>
              <p className="text-sm text-gray-500">Phone Number</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">{user?.address}</p>
              <p className="text-sm text-gray-500">Address</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>

          <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border">
            <UserCheck className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-gray-900">{user?.emergencyName}</p>
              <p className="text-sm text-gray-500">
                {user?.emergencyRelationship} • {user?.emergencyPhone}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button className="w-full h-12 bg-[#264233] hover:bg-[#1f362a] text-white rounded-xl font-semibold flex items-center justify-center space-x-2">
            <Stethoscope className="w-5 h-5" />
            <span>Online Doctor Consultation</span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold flex items-center justify-center space-x-2 bg-white"
          >
            <Tag className="w-5 h-5" />
            <span>View & Manage MediTags</span>
          </Button>

          <Button variant="destructive" onClick={onLogout} className="w-full h-12 rounded-xl mt-2">
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
