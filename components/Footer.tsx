"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Clock, ShieldCheck, Heart, Sparkles, Smartphone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer completely on Login and Cashier POS to keep them clean & focused
  if (pathname === "/login" || pathname === "/cashier") {
    return null;
  }

  // On Admin & Operations Pages: Show only a minimalist 1-line legal attribution
  const isAdminPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/kitchen") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/offers-admin") ||
    pathname.startsWith("/menu-admin") ||
    pathname.startsWith("/users");

  if (isAdminPage) {
    return (
      <footer
        style={{
          width: "100%",
          padding: "16px 20px",
          backgroundColor: "#502314",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
          fontSize: "12px",
          color: "#E2D7CC",
          direction: "rtl",
        }}
      >
        <span>© {new Date().getFullYear()} كابتن برجر (Captain Burger) • </span>
        <span style={{ color: "#FFAE00", fontWeight: 800 }}>
          تم تطوير النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية
        </span>
      </footer>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // PUBLIC STOREFRONT FOOTER (Burger King BBQ Brown Theme)
  // ══════════════════════════════════════════════════════════════
  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#502314",
        borderTop: "3px solid #D62300",
        color: "#FFF5EA",
        paddingTop: "48px",
        paddingBottom: "90px", // space for bottom nav bar
        marginTop: "40px",
        fontFamily: "var(--font-cairo), system-ui, -apple-system, sans-serif",
        direction: "rtl",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "36px",
          boxSizing: "border-box",
        }}
      >
        {/* Column 1: Brand Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/logo.png"
              alt="كابتن برجر"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "2px solid #FFAE00",
                background: "#F5EBDC",
              }}
            />
            <div>
              <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#FFAE00", margin: 0 }}>
                كابتن برجر
              </h3>
              <p style={{ fontSize: "11px", color: "#E2D7CC", margin: 0, fontWeight: 800 }}>
                CAPTAIN BRGR • طعم البرجر الأصلي
              </p>
            </div>
          </div>
          <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#D1C2B4", margin: 0, fontWeight: 600 }}>
            أشهى ساندوتشات البرجر اللحم البقري الصافي المشوي على الجريل والمحشي بالجبنة الذائبة، مع ساندوتشات الدجاج الكريسبي المقرمشة ولودد فرايز بأعلى جودة وطعم لا يُنسى.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <Link
              href="/download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                backgroundColor: "#D62300",
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 900,
                padding: "8px 16px",
                borderRadius: "100px",
                boxShadow: "0 4px 12px rgba(214, 35, 0, 0.4)",
              }}
            >
              <Smartphone size={14} />
              <span>تحميل تطبيق الأندرويد الرسمي</span>
            </Link>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 900, color: "#FFAE00", marginBottom: "8px" }}>
            روابط سريعة
          </h4>
          <Link href="/#menu-section" style={{ color: "#E2D7CC", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            قائمة الطعام وساندوتشات البرجر
          </Link>
          <Link href="/#offers-section" style={{ color: "#E2D7CC", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            عروض الكابتن والكومبو التوفيرية
          </Link>
          <Link href="/track" style={{ color: "#E2D7CC", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            تتبع حالة أوردر الدليفري
          </Link>
          <Link href="/login" style={{ color: "#E2D7CC", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            دخول الكاشير والإدارة
          </Link>
        </div>

        {/* Column 3: Contact & Delivery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 900, color: "#FFAE00", marginBottom: "4px" }}>
            أرقام الدليفري والخط الساخن
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#E2D7CC", fontSize: "13.5px" }}>
            <Phone size={16} color="#D62300" />
            <a href="tel:01206002168" style={{ color: "#FFF5EA", textDecoration: "none", fontWeight: 800, direction: "ltr" }}>
              0120 600 2168
            </a>
            <span style={{ color: "#A89485" }}>(واتساب / طلبات)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#E2D7CC", fontSize: "13.5px" }}>
            <Phone size={16} color="#FFAE00" />
            <a href="tel:01117776349" style={{ color: "#FFF5EA", textDecoration: "none", fontWeight: 800, direction: "ltr" }}>
              0111 777 6349
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#E2D7CC", fontSize: "13.5px" }}>
            <Phone size={16} color="#FFAE00" />
            <a href="tel:01018804888" style={{ color: "#FFF5EA", textDecoration: "none", fontWeight: 800, direction: "ltr" }}>
              0101 880 4888
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#D1C2B4", fontSize: "12.5px", marginTop: "4px" }}>
            <Clock size={15} color="#FFAE00" />
            <span>يومياً من الساعة 12:00 ظهراً حتى 3:00 فجراً</span>
          </div>
        </div>

        {/* Column 4: Branches & Coverage */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 900, color: "#FFAE00", marginBottom: "4px" }}>
            عناوين الفروع والتغطية
          </h4>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#D1C2B4", fontSize: "12.5px", lineHeight: 1.5 }}>
            <MapPin size={18} color="#D62300" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong>فرع الشيخ زايد:</strong> الحي العاشر — يخدم كافة أحياء الشيخ زايد وبيفرلي هيلز والثورة الخضراء.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#D1C2B4", fontSize: "12.5px", lineHeight: 1.5 }}>
            <MapPin size={18} color="#FFAE00" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong>فرع 6 أكتوبر:</strong> غرب سوميد — وصلة دهشور — يخدم الأحياء السكنية والحي المتميز وحدائق أكتوبر.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Legal Attribution Bar */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "36px auto 0",
          padding: "20px 24px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "14px",
          fontSize: "12px",
          color: "#BCAEA2",
        }}
      >
        <span>
          © {new Date().getFullYear()} مطعم كابتن برجر (Captain Burger). جميع الحقوق محفوظة.
        </span>
        <div>
          <a
            href="https://wa.me/201018671000"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFAE00",
              textDecoration: "none",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>تم تطوير النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية 🐋</span>
            <span style={{ direction: "ltr", fontFamily: "monospace" }}>01018671000</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
