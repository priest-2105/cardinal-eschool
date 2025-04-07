import StudentDashboardHeader from "@/components/dashboard/student/header";
import StudentDashboardSideBar from "@/components/dashboard/student/sidebar";
import ProtectedDashboardLayout from "@/components/dashboard/protectedDashboardLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-[100vw] overflow-hidden bg-gray-50 flex">
      <StudentDashboardSideBar />
      <div className="flex-1 transition-all ease-in-out overflow-hidden duration-300">
        <StudentDashboardHeader />
        <main className="pt-[104px] sm:px-4 z-90 sm:pb-8 max-sm:px-1 w-[100vw] overflow-x-hidden">
          <ProtectedDashboardLayout allowedRole="student">
            {children}
          </ProtectedDashboardLayout>
        </main>
      </div>
    </div>
  );
}

