"use client";

import StudentDashboardHeader from "@/components/dashboard/student/header";
import StudentDashboardSideBar from "@/components/dashboard/student/sidebar";
import { useState, useEffect } from "react";
import ProtectedDashboardLayout from "@/components/dashboard/protectedDashboardLayout";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   if (authState?.user?.role === "student" && !authState?.user.has_subscription) {
  //     router.push("/planpick");
  //   }
  // }, [authState?.user, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="min-h-screen w-[100vw] overflow-hidden bg-gray-50 flex">
          <StudentDashboardSideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className={`flex-1 transition-all ease-in-out overflow-hidden duration-300`}>
            <StudentDashboardHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <main className="pt-[104px] sm:px-4 z-90 sm:pb-8 max-sm:px-1  w-[100vw] overflow-x-hidden">
              <ProtectedDashboardLayout allowedRole="student">
                {children}
              </ProtectedDashboardLayout>
            </main>
          </div>
        </div>
    </>
  );
}

