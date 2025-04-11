"use client"

import type React from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface PhoneInputFieldProps {
  value: string
  onChange: (phone: string) => void
  country?: string
  label?: string
  id?: string
  readOnly?: boolean 
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  country = "us",
  label = "Phone Number",
  id = "phone",
  readOnly,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <PhoneInput
        country={country}
        value={value}
        onChange={onChange}
        inputProps={{
          id: id,
          name: id,
          readOnly: readOnly || false, // Pass the readOnly prop to the input
        }}
        containerClass=""
        inputClass="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent"
        buttonClass="border border-gray-300 rounded-l-md"
      />
    </div>
  )
}

export default PhoneInputField

