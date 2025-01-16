"use client"

const CheckoutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#1BC2C2] text-white py-2 px-4 rounded-lg w-full mt-4"
    >
      Checkout
    </button>
  )
}

export default CheckoutButton
