"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { CreateCoupon } from "@/lib/api/admin/coupon/createcoupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/dashboard/admin/ui/alert";

export default function CreateCouponPage() {
  const router = useRouter();
  const token: string | null = useSelector((state: RootState) => state.auth?.token ?? null);

  const [discountPercentage, setDiscountPercentage] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "danger" | "warning">("default");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAlertMessage(null);

    if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
      setError("Please enter a valid discount percentage (1-100).");
      setAlertMessage("Please enter a valid discount percentage (1-100).");
      setAlertVariant("danger");
      return;
    }

    setIsSubmitting(true);

    try {
      if (token) {
        // const response = await CreateCoupon(token, { discount_percentage: discountPercentage });
        // console.log("CreateCoupon API Response:", response);
        setAlertMessage("Coupon created successfully!");
        setAlertVariant("default");
        router.push("/admin/coupons");
      } else {
        setError("Token is missing. Please log in again.");
        setAlertMessage("Token is missing. Please log in again.");
        setAlertVariant("danger");
      }
    } catch (err) {
      console.error("Error creating coupon:", err);
      setError("Failed to create coupon. Please try again.");
      setAlertMessage("Failed to create coupon. Please try again.");
      setAlertVariant("danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl ">
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage(null)}>
          <AlertTitle>{alertVariant === "default" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create Coupon</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Coupon</CardTitle>
            <CardDescription>Enter the discount percentage for the coupon.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount Percentage</Label>
              <Input
                id="discountPercentage"
                type="number"
                min="1"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                placeholder="Enter a percentage (e.g., 10)"
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Coupon"}
          </Button>
        </div>
      </form>
    </div>
  );
}

