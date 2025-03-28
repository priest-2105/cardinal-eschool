// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Download } from "lucide-react"

// export default function TransactionDetailsPage() {
//   return (
//     <div className="container mx-auto p-4">
//       <div className="mb-6 flex items-center">
//         <Button variant="ghost" size="icon" className="mr-2">
//           <ArrowLeft className="h-6 w-6" />
//         </Button>
//         <h1 className="text-2xl font-bold">Transaction Details</h1>
//       </div>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Payment Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Transaction ID</p>
//               <p className="font-medium">#TRX-123456</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Date</p>
//               <p className="font-medium">May 15, 2023</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Amount</p>
//               <p className="font-medium">$120.00</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Status</p>
//               <p className="font-medium text-green-600">Successful</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Payment Method</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="font-medium">Credit Card</p>
//           <p className="text-sm text-gray-500">Visa ending in 4242</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Transaction Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <p className="text-sm text-gray-500">Subtotal</p>
//               <p className="font-medium">$100.00</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-sm text-gray-500">Tax</p>
//               <p className="font-medium">$20.00</p>
//             </div>
//             <div className="flex justify-between border-t pt-2">
//               <p className="text-sm font-bold">Total</p>
//               <p className="font-bold">$120.00</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="mt-6 flex justify-center">
//         <Button variant="outline" className="flex items-center">
//           <Download className="mr-2 h-4 w-4" />
//           Download Receipt
//         </Button>
//       </div>
//     </div>
//   )
// }



"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getTransactionDetails } from "@/lib/api/student/payment/transactiondetails";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert";
import { Button } from "@/components/ui/button";

export default function TransactionDetails() {
  const params = useParams();
  const transactionRef = params.id as string;
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authState = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])


  useEffect(() => {
    const fetchDetails = async () => {
      if (!authState?.token) return;

      try {
        const response = await getTransactionDetails(authState.token, transactionRef);
        setTransactionDetails(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [transactionRef, authState?.token]);

  if (loading) {
    return <div className="text-center py-12">Loading transaction details...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`transition-all ease-in-out duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <div className="flex flex-col w-full mx-auto px-4">
    <div className="border-b">
          <Button variant="ghost">Back</Button>
      </div>
    <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid gap-4">
            <div className="flex justify-between border-b py-2">
              <span className="font-semibold">Transaction Reference:</span>
              <span>{transactionRef}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-semibold">Status:</span>
              <span className={`${
                transactionDetails?.status === "success" 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {transactionDetails?.status}
              </span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-semibold">Message:</span>
              <span>{transactionDetails?.message}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
