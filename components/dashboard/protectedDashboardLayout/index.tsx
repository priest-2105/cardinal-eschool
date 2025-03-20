"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/lib/store";

interface ProtectedLayoutProps {
  allowedRole: string;
  children: React.ReactNode;
}

export default function ProtectedDashboardLayout({
  allowedRole,
  children,
}: ProtectedLayoutProps) {
  // Use optional chaining to safely access the user property
  const user = useSelector((state: RootState) => state.auth?.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== allowedRole) {
      // Redirect if the user's role doesn't match the allowed role
      router.replace("/");
    }
  }, [user, allowedRole, router]);

  // Optionally, render a loading indicator while the user is being verified
  if (!user || user.role !== allowedRole) {
    return null; // or a spinner, etc.
  }

  return <>{children}</>;
}
