import StudentDashboardHeader from "@/components/dashboard/student/header";
import StudentDashboardSideBar from "@/components/dashboard/student/sidebar";
import ProtectedDashboardLayout from "@/components/dashboard/protectedDashboardLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 relative">
      <StudentDashboardSideBar />
      <div className="flex-1 transition-all ease-in-out overflow-hidden duration-300 relative z-[1]">
        <StudentDashboardHeader />
        <main className="pt-[104px] sm:px-4 sm:pb-8 max-sm:px-1 w-[100vw] overflow-x-hidden">
          <ProtectedDashboardLayout allowedRole="student">
            {children}
          </ProtectedDashboardLayout>
        </main>
      </div>
    </div>
  );
}

