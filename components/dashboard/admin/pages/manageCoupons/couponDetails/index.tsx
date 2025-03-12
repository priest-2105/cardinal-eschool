"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Tag, Edit, Trash2, Users, ShoppingBag, DollarSign, Clock } from "lucide-react"
import { format } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SAMPLE_COUPONS, type Coupon } from "../samplecoupon"

export default function CouponDetailsPage({ id }: { id: string }) {
  const router = useRouter()
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [usageByDate, setUsageByDate] = useState<{ date: string; count: number }[]>([])

  useEffect(() => {
    if (id) {
      const foundCoupon = SAMPLE_COUPONS.find((c) => c.id === id)
      if (foundCoupon) {
        setCoupon(foundCoupon)

        // Generate sample usage data for demonstration
        const startDate = new Date(foundCoupon.startDate)
        const endDate = new Date(foundCoupon.endDate)
        const days = Math.min(7, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))

        const usageData = []
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate)
          date.setDate(date.getDate() + i)
          usageData.push({
            date: format(date, "MMM d"),
            count: Math.floor(Math.random() * (foundCoupon.usageCount / days) * 2),
          })
        }
        setUsageByDate(usageData)
      }
    }
  }, [id])

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real application, you would delete the coupon via API
    alert(`Coupon ${coupon?.code} has been deleted successfully.`)
    router.push("/admin/coupons")
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

  if (!coupon) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Coupon Not Found</h1>
        </div>
        <Alert>
          <AlertDescription>The coupon you&apos;re looking for doesn&apos;t exist or has been deleted.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{coupon.name}</h1>
            <div className="flex items-center mt-1">
              <Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span className="text-muted-foreground">{coupon.code}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => router.push(`/admin/editcoupon/${coupon.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="danger" className="flex items-center gap-1" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Status</h3>
              {getCouponStatusBadge(coupon)}
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Discount</span>
                <p className="font-medium">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% off`
                    : `$${coupon.discountValue.toFixed(2)} off`}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Valid Period</span>
                <p className="font-medium">
                  {format(new Date(coupon.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(coupon.endDate), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Usage Limit</span>
                <p className="font-medium">{coupon.maxUses} uses</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Current Usage</span>
                <div className="flex items-center gap-2">
                  <Progress value={(coupon.usageCount / coupon.maxUses) * 100} className="h-2" />
                  <span className="text-sm">
                    {coupon.usageCount} / {coupon.maxUses}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
                <Users className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Uses</span>
                <span className="text-xl font-bold">{coupon.usageCount}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
                <ShoppingBag className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Orders</span>
                <span className="text-xl font-bold">{coupon.usageCount}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
                <DollarSign className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="text-xl font-bold">${(coupon.usageCount * 75).toFixed(2)}</span>
              </div>
            </div>

            <h4 className="font-medium mb-4">Usage Over Time</h4>
            <div className="h-[200px] flex items-end gap-2">
              {usageByDate.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-primary/70 w-full rounded-t-sm"
                    style={{ height: `${(item.count / Math.max(...usageByDate.map((d) => d.count))) * 150}px` }}
                  ></div>
                  <span className="text-xs mt-2">{item.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coupon Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coupon.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-muted-foreground">{coupon.description}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium mb-1">Individual Use Only</h4>
              <p>{coupon.individualUse ? "Yes" : "No"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Exclude Sale Items</h4>
              <p>{coupon.excludeSaleItems ? "Yes" : "No"}</p>
            </div>

            {/* {coupon.minOrderValue > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Minimum Order Value</h4>
                <p>${coupon.minOrderValue.toFixed(2)}</p>
              </div>
            )} */}

            <div>
              <h4 className="text-sm font-medium mb-1">Product Restrictions</h4>
              <p>
                {coupon.productRestrictions === "none"
                  ? "No restrictions (applies to all products)"
                  : coupon.productRestrictions === "specific_products"
                    ? "Specific products only"
                    : "Specific categories only"}
              </p>

              {coupon.productRestrictions === "specific_products" && coupon.specificProducts && (
                <div className="mt-2">
                  <h5 className="text-xs font-medium mb-1">Products:</h5>
                  <p className="text-sm">{coupon.specificProducts}</p>
                </div>
              )}

              {coupon.productRestrictions === "specific_categories" && coupon.specificCategories && (
                <div className="mt-2">
                  <h5 className="text-xs font-medium mb-1">Categories:</h5>
                  <p className="text-sm">{coupon.specificCategories}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Date Created</h4>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <p>{format(new Date(coupon.createdAt), "MMMM d, yyyy")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{(10000 + index).toString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(new Date().setDate(new Date().getDate() - index)), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(99.99 - index * 10).toFixed(2)}</p>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the <strong>{coupon.code}</strong> coupon? This action cannot be undone
              and any customers currently using this coupon will no longer be able to apply it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

