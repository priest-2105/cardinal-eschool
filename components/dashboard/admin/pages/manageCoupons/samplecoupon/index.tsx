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
  
  
export const SAMPLE_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "SUMMER25",
    name: "Summer Sale 25% Off",
    description: "Get 25% off your entire purchase during our summer sale event.",
    discountType: "percentage",
    discountValue: 25,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    maxUses: 1000,
    usageCount: 450,
    individualUse: true,
    excludeSaleItems: true,
    productRestrictions: "none",
    createdAt: "2023-05-15",
    updatedAt: "2025-05-15",
  },
  {
    id: "2",
    code: "WELCOME10",
    name: "New Customer $10 Off",
    description: "Welcome to our store! Enjoy $10 off your first purchase.",
    discountType: "fixed",
    discountValue: 10,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    maxUses: 500,
    usageCount: 320,
    minOrderValue: 50,
    individualUse: true,
    excludeSaleItems: false,
    productRestrictions: "none",
    createdAt: "2025-01-01",
    updatedAt: "2025-09-01",
  },
  {
    id: "3",
    code: "FLASH15",
    name: "Flash Sale 15% Off",
    description: "Limited time offer: 15% off selected items.",
    discountType: "percentage",
    discountValue: 15,
    startDate: "2025-07-15",
    endDate: "2025-07-20",
    maxUses: 300,
    usageCount: 300,
    individualUse: false,
    excludeSaleItems: false,
    productRestrictions: "specific_categories",
    specificCategories: "electronics, accessories",
    createdAt: "2024-07-10",
    updatedAt: "2025-07-10",
  },
  {
    id: "4",
    code: "HOLIDAY50",
    name: "Holiday Season 50% Off",
    description: "Celebrate the holidays with 50% off all seasonal items.",
    discountType: "percentage",
    discountValue: 50,
    startDate: "2025-11-20",
    endDate: "2025-12-31",
    maxUses: 2000,
    usageCount: 0,
    individualUse: true,
    excludeSaleItems: true,
    productRestrictions: "specific_categories",
    specificCategories: "seasonal, gifts, holiday",
    createdAt: "2024-10-05",
    updatedAt: "2025-10-05",
  },
  {
    id: "5",
    code: "FREESHIP",
    name: "Free Shipping",
    description: "Free shipping on all orders over $75.",
    discountType: "fixed",
    discountValue: 0,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    maxUses: 10000,
    usageCount: 1250,
    minOrderValue: 75,
    individualUse: false,
    excludeSaleItems: false,
    productRestrictions: "none",
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "6",
    code: "BUNDLE20",
    name: "Bundle Discount 20%",
    description: "Save 20% when you purchase a bundle of products.",
    discountType: "percentage",
    discountValue: 20,
    startDate: "2024-05-01",
    endDate: "2025-09-30",
    maxUses: 800,
    usageCount: 215,
    individualUse: true,
    excludeSaleItems: true,
    productRestrictions: "specific_products",
    specificProducts: "101, 102, 103, 104",
    createdAt: "2024-04-15",
    updatedAt: "2024-09-15",
  },
]

