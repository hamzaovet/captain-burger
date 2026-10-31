import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { StaffProvider } from "@/context/StaffContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SoundAlertToggle from "@/components/SoundAlertToggle";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "كابتن برجر | Captain Burger - أشهى برجر لحم ودجاج كرسبي في زايد وأكتوبر",
  description: "مطعم كابتن برجر (Captain BRGR) - برجر لحم بلدي 100% طازج مشوي عالفحم، دجاج كرسبي فائق القرمشة، لودد فرايز وميلك شيك وصوصات خاصة في الشيخ زايد و6 أكتوبر. خدمة توصيل وتيك أواي وصالة.",
  icons: {
    icon: "/logo.png",
    apple: "/app-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cairo.variable}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#F5EBDC] text-[#502314] antialiased selection:bg-[#D62300] selection:text-white"
        style={{ fontFamily: "var(--font-cairo), 'Segoe UI', Tahoma, sans-serif" }}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <StaffProvider>
            <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <Navbar />
                <main>{children}</main>
              </div>
              <Footer />
            </div>
            <SoundAlertToggle />
          </StaffProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
