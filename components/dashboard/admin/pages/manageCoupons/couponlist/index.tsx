"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import { fetchCoupons } from "@/lib/api/admin/coupon/fetchCoupons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Tag, Pencil, Trash2 } from "lucide-react";

export interface Coupon {
  coupon_codec: string;
  coupon_code: string;
  percentage: string;
  status: string;
  usage_info: string;
}

export default function CouponsList() {
  const router = useRouter();
  const token: string | null = useSelector((state: RootState) => state.auth?.token);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllCoupons = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await fetchCoupons(token);
        setCoupons(response.data.coupons);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCoupons();
  }, [token]);

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.coupon_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || statusFilter === coupon.status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button onClick={() => router.push("/admin/coupon/createcoupon")} className="flex items-center gap-2">
          <Plus size={16} /> Create Coupon
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading coupons...</div>
      ) : filteredCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => (
            <Card key={coupon.coupon_codec} className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{coupon.coupon_code}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Tag className="h-3.5 w-3.5 mr-1" />
                      {coupon.percentage}% Off
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    {coupon.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">Usage: {coupon.usage_info}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <h3 className="font-medium text-lg mb-2">No coupons found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters, or create a new coupon.</p>
        </div>
      )}
    </div>
  );
}

