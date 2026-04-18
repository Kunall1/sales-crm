import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SalesCRM — Sales Pipeline Dashboard",
  description: "Modern sales CRM dashboard with pipeline management, analytics, and follow-up tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
