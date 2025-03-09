"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Tag, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import CouponDeleteDialog from "../couponDeleteDialog/index"
import { SAMPLE_COUPONS } from "../samplecoupon/index"


export interface Coupon {
    id: string
    code: string
    name: string
    description?: string
    discountType: "percentage" | "fixed"
    discountValue: number
    startDate: Date | string
    endDate: Date | string
    maxUses: number
    usageCount: number
    minOrderValue?: number
    individualUse: boolean
    excludeSaleItems: boolean
    productRestrictions: "none" | "specific_products" | "specific_categories"
    specificProducts?: string
    specificCategories?: string
    createdAt: string
    updatedAt: string
  }
  
  

export default function CouponsList() {
  const router = useRouter()
  const [coupons, setCoupons] = useState<Coupon[]>(SAMPLE_COUPONS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)

  const filteredCoupons = coupons.filter((coupon) => {
    // Search filter
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const now = new Date()
    let couponStatus = "active"
    if (now < new Date(coupon.startDate)) {
      couponStatus = "upcoming"
    } else if (now > new Date(coupon.endDate)) {
      couponStatus = "expired"
    } else if (coupon.usageCount >= coupon.maxUses) {
      couponStatus = "depleted"
    }

    const matchesStatus = statusFilter === "all" || statusFilter === couponStatus

    // Type filter
    const matchesType = typeFilter === "all" || typeFilter === coupon.discountType

    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewCoupon = (id: string) => {
    router.push(`/admin/coupons/${id}`)
  }

  const handleEditCoupon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/admin/coupons/${id}/edit`)
  }

  const handleDeleteCoupon = (coupon: Coupon, e: React.MouseEvent) => {
    e.stopPropagation()
    setCouponToDelete(coupon)
  }

  const confirmDelete = () => {
    if (couponToDelete) {
      const updatedCoupons = coupons.filter((coupon) => coupon.id !== couponToDelete.id)
      setCoupons(updatedCoupons)
      setCouponToDelete(null)
    }
  }

  const getCouponStatusBadge = (coupon: Coupon) => {
    const now = new Date()

    if (now < new Date(coupon.startDate)) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          Upcoming
        </Badge>
      )
    } else if (now > new Date(coupon.endDate)) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          Expired
        </Badge>
      )
    } else if (coupon.usageCount >= coupon.maxUses) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
          Depleted
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          Active
        </Badge>
      )
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button onClick={() => router.push("/admin/coupons/create")} className="flex items-center gap-2">
          <Plus size={16} /> Create Coupon
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by coupon code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="depleted">Depleted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => (
          <Card
            key={coupon.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => handleViewCoupon(coupon.id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">{coupon.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {coupon.code}
                  </p>
                </div>
                <div>{getCouponStatusBadge(coupon)}</div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Discount</span>
                  <span className="font-medium">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `$${coupon.discountValue.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Expires</span>
                  <span className="font-medium">{format(new Date(coupon.endDate), "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Usage</span>
                  <span className="font-medium">
                    {coupon.usageCount} / {coupon.maxUses}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="ghost" size="icon" onClick={(e) => handleEditCoupon(coupon.id, e)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={(e) => handleDeleteCoupon(coupon, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCoupons.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <h3 className="font-medium text-lg mb-2">No coupons found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters, or create a new coupon.</p>
        </div>
      )}

      <CouponDeleteDialog
        isOpen={couponToDelete !== null}
        coupon={couponToDelete}
        onClose={() => setCouponToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

