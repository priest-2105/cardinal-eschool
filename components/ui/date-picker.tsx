"use client"

import * as React from "react" 

interface DatePickerProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  error?: boolean
}

export function DatePicker({ selected, onChange, placeholder, className, error }: DatePickerProps) {
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="MM/dd/yyyy"
      placeholderText={placeholder}
      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent ${
        error ? "border-red-500" : "border-gray-200"
      } ${className}`}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="flex items-center justify-between px-2 py-2">
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} type="button" className="p-1">
            {"<"}
          </button>
          <div className="flex space-x-2">
            <select
              value={date.getFullYear()}
              onChange={({ target: { value } }) => changeYear(Number.parseInt(value))}
              className="text-sm rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={months[date.getMonth()]}
              onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
              className="text-sm rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} type="button" className="p-1">
            {">"}
          </button>
        </div>
      )}
    />
  )
}

