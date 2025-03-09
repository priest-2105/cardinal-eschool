"use client"

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
  
  

interface CouponDeleteDialogProps {
  isOpen: boolean
  coupon: Coupon | null
  onClose: () => void
  onConfirm: () => void
}

export default function CouponDeleteDialog({ isOpen, coupon, onClose, onConfirm }: CouponDeleteDialogProps) {
  if (!coupon) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the <strong>{coupon.code}</strong> coupon? This action cannot be undone and
            any customers currently using this coupon will no longer be able to apply it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[#da3f39eb3] text-destructive-foreground hover:bg-[#da3e39c13]"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

