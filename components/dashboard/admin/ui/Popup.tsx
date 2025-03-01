"use client"

import { useEffect } from "react"

interface PopupProps {
  message: string
  onClose: () => void
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-0 z-50 right-0 m-4 flex items-center justify-centerbg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p>{message}</p>
        <button onClick={onClose} className="mt-4 bg-[#1BC2C2] text-white py-2 px-4 rounded-lg">
          Close
        </button>
      </div>
    </div>
  )
}

export default Popup
