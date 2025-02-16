"use client"

import { CheckCircle2 } from "lucide-react"

const StudentCardPayment = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-white justify-between rounded-lg p-4 sm:p-6 space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Left Section - Payment Form */}
      <div className="flex-1 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Final Step, Make the Payment.</h2>
        <p className="text-sm sm:text-base text-[#626262] font-semibold mb-6">
          To finalize your subscription, kindly complete your payment using a valid credit card.
        </p>

        <form className="space-y-4">
          {/* Card Number Input */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              placeholder="9870 8880 8880 7880"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-[#1BC2C2] focus:border-[#1BC2C2]"
            />
          </div>

          {/* Expiry and CVC */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                Expiry
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="16/27"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-[#1BC2C2] focus:border-[#1BC2C2]"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                placeholder="XXX"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-[#1BC2C2] focus:border-[#1BC2C2]"
              />
            </div>
          </div>

          {/* Discount Code Input */}
          <div>
            <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700">
              Discount Code
            </label>
            <input
              id="discountCode"
              type="text"
              placeholder="C00-20-OFF"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-[#1BC2C2] focus:border-[#1BC2C2]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1BC2C2] hover:bg-teal-600 text-white rounded-lg py-3 mt-4 font-semibold"
          >
            Pay Now
          </button>
        </form>
      </div>

      {/* Right Section - Payment Details */}
      <div className="space-y-4 bg-gray-100 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm">
        {/* YouTube Video Section */}
        <div className="relative group">
          <img
            src="/assets/img/dashboard/student/studentdashboardmakepayment/Rectangle1548.png"
            alt="Payment Instruction"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 sm:w-16 sm:h-16 text-white"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.887 3.2a1 1 0 0 1 1.13-.09l7 4a1 1 0 0 1 0 1.78l-7 4A1 1 0 0 1 4 11.999V4a1 1 0 0 1 .887-.8z" />
            </svg>
          </div>
        </div>

        {/* Plan Details */}
        <div className="bg-transparent w-full px-4 sm:px-10 flex items-center p-4">
          <div className="bg-[#E6FFFC] -mt-16 sm:-mt-28 z-10 w-full px-4 sm:px-10 flex items-center p-4 rounded-lg shadow-md">
            <img
              src="/assets/img/dashboard/student/studentdashboardmakepayment/Rectangle 1550.png"
              alt="Payment Instruction"
              className="w-24 sm:w-32 h-auto rounded-lg shadow-md"
            />
            <div className="px-3">
              <h3 className="text-base sm:text-lg font-semibold">Basic Plan</h3>
              <p className="text-xl sm:text-2xl font-bold text-teal-600">$60/month</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle2 color="#11C700" />
            <h3 className="text-base sm:text-lg ms-2 font-bold">Payment & Invoice</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            We'll worry about all the transactions and payment. You can sit back and relax while you get ready to take
            your classes. Check Your E-mail for your payment receipt.
          </p>
        </div>

        <div className="p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle2 color="#11C700" />
            <h3 className="text-base sm:text-lg ms-2 font-bold">Updates & Benefits</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            You'll be provided with updates from time to time and have access to perks and benefits in basic plan.
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentCardPayment

