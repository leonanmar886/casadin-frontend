"use client";
import { AuthProvider } from "@/providers/AuthProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
} 