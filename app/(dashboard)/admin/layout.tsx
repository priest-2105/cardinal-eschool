import AdminDashboardHeader from "@/components/dashboard/admin/header";
import AdminDashboardSideBar from "@/components/dashboard/admin/sidebar";
import ProtectedDashboardLayout from "@/components/dashboard/protectedDashboardLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-[100vw] overflow-hidden bg-gray-50 flex">
      <AdminDashboardSideBar />
      <div className="flex-1 transition-all ease-in-out overflow-hidden duration-300">
        <AdminDashboardHeader />
        <main className="pt-[104px] sm:px-4 z-90 sm:pb-8 max-sm:px-1 w-[100vw] overflow-x-hidden">
          <ProtectedDashboardLayout allowedRole="admin">
            {children}
          </ProtectedDashboardLayout>
        </main>
      </div>
    </div>
  )
}

