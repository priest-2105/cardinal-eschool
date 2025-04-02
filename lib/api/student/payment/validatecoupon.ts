import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface ValidateCouponResponse {
    status: string;
    message: string;
    data: {
        coupon: {
            code: string;
            discount_percentage: string;
            original_amount: number;
            discount_amount: number;
            final_amount: number;
        };
    };
}

export async function validateCoupon(token: string, couponCode: string, amount: number): Promise<ValidateCouponResponse> {
    const response = await fetchWithAuth(`${apiUrl}/student/payment/validate-coupon`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            coupon_code: couponCode,
            amount: amount,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to validate coupon: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
