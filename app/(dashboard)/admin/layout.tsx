"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import AdminDashboardHeader from "@/components/dashboard/admin/header";
import AdminDashboardSideBar from "@/components/dashboard/admin/sidebar";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <html lang="en">
      <head>
        <title>Cardinal E School || Admin</title>
        <link rel="shortcut icon" href="/assets/img/favicon-logo.png" type="image/x-icon" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <div className="min-h-screen w-[100vw] overflow-hidden bg-gray-50 flex">
          <AdminDashboardSideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className={`flex-1 transition-all ease-in-out overflow-hidden duration-300`}>
            <AdminDashboardHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <main className="pt-[104px] sm:px-4 z-90 sm:pb-8 max-sm:px-1  w-[100vw] overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

