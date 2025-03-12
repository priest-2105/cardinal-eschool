"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
// import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Add or update this type definition
type Coupon = {
  id: string
  code: string
  name: string
  description?: string
  discountType: "percentage" | "fixed"
  discountValue: number
  startDate: Date
  endDate: Date
  maxUses: number
  minOrderValue?: number | string
  individualUse: boolean
  excludeSaleItems: boolean
  productRestrictions: "none" | "specific_products" | "specific_categories"
  specificProducts?: string
  specificCategories?: string
  usageCount: number
  status: "active" | "expired" | "scheduled"
}

type Errors = {
  code?: string
  name?: string
  discountValue?: string
  startDate?: string
  endDate?: string
  maxUses?: string
}

const EditCoupon = () => {
  const router = useRouter()
  const { id } = router.query
  const [formData, setFormData] = useState<Coupon | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (id) {
      fetchCoupon(id as string)
    }
  }, [id])

  const fetchCoupon = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/coupons/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Ensure startDate and endDate are Date objects
      const couponData: Coupon = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      }
      setFormData(couponData)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch coupon:", error)
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: unknown) => {
    if (!formData) return

    if (field === "startDate" || field === "endDate") {
      setFormData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          [field]: value instanceof Date ? value : prev[field],
        }
      })
    } else {
      setFormData((prev) => {
        if (!prev) return null
        return { ...prev, [field]: value }
      })
    }

    // if (errors[field]) {
    //   setErrors((prev) => {
    //     const newErrors = { ...prev }
    //     delete newErrors[field]
    //     return newErrors
    //   })
    // }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    // Validation
    const newErrors: Errors = {}
    if (!formData.code) newErrors.code = "Code is required"
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.discountValue) newErrors.discountValue = "Discount Value is required"
    if (!formData.startDate) newErrors.startDate = "Start Date is required"
    if (!formData.endDate) newErrors.endDate = "End Date is required"
    if (!formData.maxUses) newErrors.maxUses = "Max Uses is required"

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      router.push("/dashboard/admin/manageCoupons")
    } catch (error) {
      console.error("Failed to update coupon:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!formData) {
    return <div>Coupon not found</div>
  }

  return (
    <div>
      <h1>Edit Coupon</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="code">Code:</label>
          <input type="text" id="code" value={formData.code} onChange={(e) => handleChange("code", e.target.value)} />
          {errors.code && <div>{errors.code}</div>}
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
          {errors.name && <div>{errors.name}</div>}
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="discountType">Discount Type:</label>
          <select
            id="discountType"
            value={formData.discountType}
            onChange={(e) => handleChange("discountType", e.target.value as "percentage" | "fixed")}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>
        <div>
          <label htmlFor="discountValue">Discount Value:</label>
          <input
            type="number"
            id="discountValue"
            value={formData.discountValue}
            onChange={(e) => handleChange("discountValue", Number.parseFloat(e.target.value))}
          />
          {errors.discountValue && <div>{errors.discountValue}</div>}
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <DatePicker
            selected={formData.startDate instanceof Date ? formData.startDate : null}
            onChange={(date) => handleChange("startDate", date)}
          />
          {errors.startDate && <div>{errors.startDate}</div>}
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <DatePicker
            selected={formData.endDate instanceof Date ? formData.endDate : null}
            onChange={(date) => handleChange("endDate", date)}
          />
          {errors.endDate && <div>{errors.endDate}</div>}
        </div>
        <div>
          <label htmlFor="maxUses">Max Uses:</label>
          <input
            type="number"
            id="maxUses"
            value={formData.maxUses}
            onChange={(e) => handleChange("maxUses", Number.parseInt(e.target.value))}
          />
          {errors.maxUses && <div>{errors.maxUses}</div>}
        </div>
        <div>
          <label htmlFor="minOrderValue">Min Order Value:</label>
          <input
            type="number"
            id="minOrderValue"
            value={formData.minOrderValue || ""}
            onChange={(e) => handleChange("minOrderValue", Number.parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="individualUse">Individual Use:</label>
          <input
            type="checkbox"
            id="individualUse"
            checked={formData.individualUse}
            onChange={(e) => handleChange("individualUse", e.target.checked)}
          />
        </div>
        <div>
          <label htmlFor="excludeSaleItems">Exclude Sale Items:</label>
          <input
            type="checkbox"
            id="excludeSaleItems"
            checked={formData.excludeSaleItems}
            onChange={(e) => handleChange("excludeSaleItems", e.target.checked)}
          />
        </div>
        <div>
          <label htmlFor="productRestrictions">Product Restrictions:</label>
          <select
            id="productRestrictions"
            value={formData.productRestrictions}
            onChange={(e) =>
              handleChange(
                "productRestrictions",
                e.target.value as "none" | "specific_products" | "specific_categories",
              )
            }
          >
            <option value="none">None</option>
            <option value="specific_products">Specific Products</option>
            <option value="specific_categories">Specific Categories</option>
          </select>
        </div>
        {formData.productRestrictions === "specific_products" && (
          <div>
            <label htmlFor="specificProducts">Specific Products:</label>
            <input
              type="text"
              id="specificProducts"
              value={formData.specificProducts || ""}
              onChange={(e) => handleChange("specificProducts", e.target.value)}
            />
          </div>
        )}
        {formData.productRestrictions === "specific_categories" && (
          <div>
            <label htmlFor="specificCategories">Specific Categories:</label>
            <input
              type="text"
              id="specificCategories"
              value={formData.specificCategories || ""}
              onChange={(e) => handleChange("specificCategories", e.target.value)}
            />
          </div>
        )}

        <button type="submit">Update Coupon</button>
      </form>
    </div>
  )
}

export default EditCoupon

