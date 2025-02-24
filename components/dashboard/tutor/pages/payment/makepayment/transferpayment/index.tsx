"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle2, Upload, Copy, X } from "lucide-react"
import cardinalConfig from "@/config"

const TutorTransferPayment = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col lg:flex-row bg-white justify-between rounded-lg p-4 sm:p-6 space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Left Section - Payment Form */}
      <div className="flex-1 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Final Step&apos; Make the Payment.</h2>
        <p className="text-sm sm:text-base text-[#626262] font-semibold mb-6">
          To finalize your subscription&apos; kindly complete your payment using bank transfer.
        </p>

        <div className="space-y-6">
          {/* Receipt Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Receipt File</label>
            <div className="relative">
              <input type="file" onChange={handleFileChange} className="hidden" id="receipt" accept="image/*,.pdf" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label
                  htmlFor="receipt"
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto text-center"
                >
                  Choose File
                </label>
                <span className="text-gray-500 text-sm truncate w-full sm:w-auto">
                  {selectedFile ? selectedFile.name : "No File Chosen"}
                </span>
                {selectedFile && (
                  <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
            <button className="w-full bg-[#1BC2C2] text-white rounded-lg py-2 flex items-center justify-center gap-2">
              <Upload size={20} />
              Upload Receipt
            </button>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Make payment to:</h3>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{cardinalConfig.payment.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(cardinalConfig.payment.accountNumber)}
                    className="text-[#1BC2C2] hover:text-teal-700"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bank Name</span>
                <span className="font-semibold">{cardinalConfig.payment.bankName}</span>
              </div>
              <div className="flex justify-between items-center max-sm:block">
                <span className="text-gray-600">Account Name</span>
                <span className="font-semibold">{cardinalConfig.payment.accountName}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Button */}
          <button className="w-full bg-[#1BC2C2] hover:bg-teal-600 text-white rounded-lg py-3 font-semibold">
            Click here after transfer
          </button>

          {/* Discount Code */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="C00-20-OFF"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#1BC2C2] focus:border-[#1BC2C2]"
            />
            <button className="px-6 py-2 text-[#1BC2C2] font-semibold hover:bg-teal-50 rounded-lg w-full sm:w-auto">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - Payment Details */}
      <div className="space-y-4 bg-gray-100 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm">
        {/* Video Section */}
        <div className="relative group">
          <img
            src="/assets/img/dashboard/tutor/tutordashboardmakepayment/Rectangle1548.png"
            alt="Payment Instruction"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-6 sm:border-t-8 border-b-6 sm:border-b-8 border-l-10 sm:border-l-12 border-transparent border-l-black ml-1" />
            </div>
          </div>
        </div>

        {/* Plan Details */}
        <div className="bg-transparent w-full px-4 sm:px-10 flex items-center p-4">
          <div className="bg-[#E6FFFC] -mt-16 sm:-mt-28 z-10 w-full px-4 max-sm:block max-sm:text-center sm:px-10 flex items-center p-4 rounded-lg shadow-md">
            <img
              src="/assets/img/dashboard/tutor/tutordashboardmakepayment/Rectangle 1550.png"
              alt="Payment Instruction"
              className="w-24 sm:w-32 h-auto rounded-lg shadow-md"
            />
            <div className="px-3">
              <h3 className="text-base sm:text-lg font-semibold">Basic Plan</h3>
              <p className="text-xl sm:text-2xl font-bold text-teal-600">$60/month</p>
            </div>
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle2 className="text-[#11C700]" />
              <h3 className="text-base sm:text-lg ms-2 font-bold">Payment & Invoice</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              We&apos;ll worry about all the transactions and payment. You can sit back and relax while you get ready to take
              your classes. Check Your E-mail for your payment receipt.
            </p>
          </div>

          <div className="p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle2 className="text-[#11C700]" />
              <h3 className="text-base sm:text-lg ms-2 font-bold">Updates & Benefits</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              You&apos;ll be provided with updates from time to time and have access to perks and benefits in basic plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorTransferPayment

