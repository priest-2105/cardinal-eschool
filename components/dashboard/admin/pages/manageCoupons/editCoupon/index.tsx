"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DatePicker } from "@/components/ui/date-picker"
import { SAMPLE_COUPONS, type Coupon } from "../samplecoupon"

export default function EditCouponPage({ id }: { id: string }) {
  const router = useRouter()

  const [formData, setFormData] = useState<Coupon | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    console.log("Coupon ID:", id)
    const coupon = SAMPLE_COUPONS.find((c) => c.id === id)
    console.log("Found Coupon:", coupon)
    if (coupon) {
      setFormData({
        ...coupon,
        startDate: new Date(coupon.startDate),
        endDate: new Date(coupon.endDate),
      })
    }
  }, [id])

  const handleChange = (field: string, value: unknown) => {
    if (!formData) return

    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    if (!formData) return false

    const newErrors: { [key: string]: string } = {}

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required"
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = "Only uppercase letters, numbers, underscores and hyphens are allowed"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Coupon name is required"
    }

    if (!formData.discountValue) {
      newErrors.discountValue = "Discount value is required"
    } else {
      const value = Number.parseFloat(formData.discountValue.toString())
      if (isNaN(value) || value <= 0) {
        newErrors.discountValue = "Discount must be a positive number"
      } else if (formData.discountType === "percentage" && value > 100) {
        newErrors.discountValue = "Percentage discount cannot exceed 100%"
      }
    }

    if (formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date"
    }

    if (!formData.maxUses) {
      newErrors.maxUses = "Maximum uses is required"
    } else if (Number.parseInt(formData.maxUses.toString()) <= 0) {
      newErrors.maxUses = "Maximum uses must be a positive number"
    }

    if (formData.minOrderValue && Number.parseFloat(formData.minOrderValue.toString()) < 0) {
      newErrors.minOrderValue = "Minimum order value cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // In a real app, you would send this data to your backend
      console.log("Form data to submit:", formData)

      alert(`Coupon ${formData?.code} has been updated successfully.`)

      router.push(`/admin/coupons`)
    } else {
      alert("Please correct the errors in the form.")
    }
  }

  if (!formData) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Coupon Not Found</h1>
        </div>
        <p>The coupon you&apos;re trying to edit doesn&apos;t exist or has been deleted.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Coupon</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update the basic details of your coupon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Coupon Code
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 ml-1 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80">
                          The coupon code that customers will enter at checkout. Only uppercase letters, numbers,
                          underscores and hyphens are allowed.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                  placeholder="e.g., SUMMER25"
                  className={errors.code ? "border-destructive" : ""}
                />
                {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Coupon Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., Summer Sale 25% Off"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter a description for this coupon"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discount Settings</CardTitle>
            <CardDescription>Configure the discount type and value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <RadioGroup
                value={formData.discountType}
                onValueChange={(value) => handleChange("discountType", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Percentage discount</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed">Fixed amount discount</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Discount Value
                {formData.discountType === "percentage" && <span className="text-muted-foreground ml-1">(in %)</span>}
                {formData.discountType === "fixed" && <span className="text-muted-foreground ml-1">(in $)</span>}
              </Label>
              <Input
                id="discountValue"
                type="number"
                step={formData.discountType === "fixed" ? "0.01" : "1"}
                min="0"
                max={formData.discountType === "percentage" ? "100" : undefined}
                value={formData.discountValue}
                onChange={(e) => handleChange("discountValue", Number.parseFloat(e.target.value))}
                placeholder={formData.discountType === "percentage" ? "e.g., 25" : "e.g., 10.00"}
                className={errors.discountValue ? "border-destructive" : ""}
              />
              {errors.discountValue && <p className="text-sm text-destructive">{errors.discountValue}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Restrictions</CardTitle>
            <CardDescription>Set restrictions on how and when the coupon can be used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker date={formData.startDate} setDate={(date) => handleChange("startDate", date)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker date={formData.endDate} setDate={(date) => handleChange("endDate", date)} />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUses">Maximum Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => handleChange("maxUses", Number.parseInt(e.target.value))}
                  placeholder="e.g., 100"
                  className={errors.maxUses ? "border-destructive" : ""}
                />
                {errors.maxUses && <p className="text-sm text-destructive">{errors.maxUses}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Minimum Order Value (Optional)</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minOrderValue || ""}
                  onChange={(e) =>
                    handleChange("minOrderValue", e.target.value ? Number.parseFloat(e.target.value) : "")
                  }
                  placeholder="e.g., 50.00"
                  className={errors.minOrderValue ? "border-destructive" : ""}
                />
                {errors.minOrderValue && <p className="text-sm text-destructive">{errors.minOrderValue}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="individualUse"
                  checked={formData.individualUse}
                  onCheckedChange={(checked) => handleChange("individualUse", !!checked)}
                />
                <Label htmlFor="individualUse" className="text-sm font-normal">
                  Individual use only (cannot be used in conjunction with other coupons)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excludeSaleItems"
                  checked={formData.excludeSaleItems}
                  onCheckedChange={(checked) => handleChange("excludeSaleItems", !!checked)}
                />
                <Label htmlFor="excludeSaleItems" className="text-sm font-normal">
                  Exclude sale items
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Restrictions</Label>
              <RadioGroup
                value={formData.productRestrictions}
                onValueChange={(value) => handleChange("productRestrictions", value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="text-sm font-normal">
                    No restrictions (apply to all products)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific_products" id="specific_products" />
                  <Label htmlFor="specific_products" className="text-sm font-normal">
                    Specific products only
                  </Label>
                </div>
                {formData.productRestrictions === "specific_products" && (
                  <Textarea
                    placeholder="Enter product IDs, separated by commas"
                    value={formData.specificProducts || ""}
                    onChange={(e) => handleChange("specificProducts", e.target.value)}
                    className="ml-6 mt-2"
                  />
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific_categories" id="specific_categories" />
                  <Label htmlFor="specific_categories" className="text-sm font-normal">
                    Specific categories only
                  </Label>
                </div>
                {formData.productRestrictions === "specific_categories" && (
                  <Textarea
                    placeholder="Enter category IDs, separated by commas"
                    value={formData.specificCategories || ""}
                    onChange={(e) => handleChange("specificCategories", e.target.value)}
                    className="ml-6 mt-2"
                  />
                )}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  )
}

