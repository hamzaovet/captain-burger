"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStaff } from "@/context/StaffContext";
import { playSound } from "@/lib/sounds";
import {
  Phone, MapPin, Headphones, Download, ShieldCheck,
  ShoppingBag, Menu, X, User, Globe, Flame, Smartphone, Sparkles
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isAuthenticated } = useStaff();

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkWidth = () => {
      setIsMobile(window.innerWidth < 880);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);

    function syncCart() {
      try {
        const raw = localStorage.getItem("captain_cart");
        if (raw) {
          const items = JSON.parse(raw);
          const totalQty = items.reduce((s: number, i: any) => s + (i.qty || 1), 0);
          const totalSum = items.reduce((s: number, i: any) => s + (i.unitPrice || 0) * (i.qty || 1), 0);
          setCartCount(totalQty);
          setCartTotal(totalSum);
        } else {
          setCartCount(0);
          setCartTotal(0);
        }
      } catch {
        setCartCount(0);
        setCartTotal(0);
      }
    }

    syncCart();
    window.addEventListener("captain_cart_update", syncCart);

    try {
      const savedLang = localStorage.getItem("captain_lang") as "ar" | "en";
      if (savedLang) setLang(savedLang);
    } catch {}

    return () => {
      window.removeEventListener("resize", checkWidth);
      window.removeEventListener("captain_cart_update", syncCart);
    };
  }, []);

  function toggleLanguage() {
    playSound("click");
    const nextLang = lang === "ar" ? "en" : "ar";
    setLang(nextLang);
    try {
      localStorage.setItem("captain_lang", nextLang);
      window.dispatchEvent(new Event("captain_lang_change"));
    } catch {}
  }

  function openCartModal() {
    playSound("pop");
    window.dispatchEvent(new CustomEvent("captain_open_cart"));
  }

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#F5EBDC",
        borderBottom: "2px solid #502314",
        boxShadow: "0 4px 18px rgba(80, 35, 20, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: "var(--font-cairo), system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── TOP UTILITY STRIP (Desktop only) ── */}
      {!isMobile && (
        <div
          style={{
            backgroundColor: "#502314",
            color: "#FFF5EA",
            fontSize: "12px",
            fontWeight: 800,
            padding: "6px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Branches / Location */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPin size={14} color="#FFAE00" />
            <span>فروع كابتن برجر: الشيخ زايد (الحي العاشر) • 6 أكتوبر (غرب سوميد / وصلة دهشور)</span>
          </div>

          {/* Hotlines and Service hours */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Headphones size={14} color="#FFAE00" />
              <span>خدمة العملاء: يومياً من 12 ظهراً حتى 3 صباحاً</span>
            </div>
            <a
              href="tel:01206002168"
              style={{
                color: "#FFAE00",
                textDecoration: "none",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                direction: "ltr",
              }}
            >
              <Phone size={13} />
              <span>0120 600 2168</span>
            </a>
          </div>
        </div>
      )}

      {/* ── MAIN NAVBAR BAR ── */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: isMobile ? "10px 16px" : "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* RIGHT (in RTL): Brand Logo & Name */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="/logo.png"
            alt="شعار كابتن برجر"
            style={{
              width: isMobile ? "44px" : "54px",
              height: isMobile ? "44px" : "54px",
              objectFit: "contain",
              borderRadius: "50%",
              border: "2px solid #502314",
              background: "#F5EBDC",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: 900,
                color: "#502314",
                lineHeight: 1.1,
                fontFamily: "var(--font-cairo), 'Impact', sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              كابتن برجر
            </span>
            <span
              style={{
                fontSize: isMobile ? "9.5px" : "11px",
                fontWeight: 800,
                color: "#D62300",
                letterSpacing: "1px",
              }}
            >
              CAPTAIN BRGR • طعم البرجر الأصلي
            </span>
          </div>
        </Link>

        {/* CENTER: Navigation Links (Desktop) */}
        {!isMobile && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
              fontSize: "14px",
              fontWeight: 800,
            }}
          >
            <Link
              href="/"
              style={{
                color: pathname === "/" ? "#D62300" : "#502314",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>الرئيسية</span>
            </Link>

            <Link
              href="/#menu-section"
              style={{
                color: "#502314",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>المنيو والأصناف</span>
            </Link>

            <Link
              href="/#offers-section"
              style={{
                color: "#D62300",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Flame size={15} color="#D62300" />
              <span>عروض الكابتن 🔥</span>
            </Link>

            <Link
              href="/download"
              style={{
                color: "#502314",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Smartphone size={15} color="#502314" />
              <span>التطبيق (APK)</span>
            </Link>

            <Link
              href="/track"
              style={{
                color: "#502314",
                textDecoration: "none",
              }}
            >
              <span>تتبع الطلب</span>
            </Link>
          </nav>
        )}

        {/* LEFT (in RTL): Actions (Call hotline, Cart, Language, Login) */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px" }}>
          {/* Call hotline button on Mobile */}
          {isMobile && (
            <a
              href="tel:01206002168"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#D62300",
                color: "#FFFFFF",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(214, 35, 0, 0.3)",
              }}
              title="اتصل بالدليفري"
            >
              <Phone size={16} />
            </a>
          )}

          {/* Cart Icon / Button */}
          <button
            onClick={openCartModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#D62300",
              color: "#FFFFFF",
              border: "none",
              padding: isMobile ? "8px 12px" : "8px 16px",
              borderRadius: "100px",
              fontWeight: 900,
              fontSize: isMobile ? "12px" : "13.5px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(214, 35, 0, 0.35)",
              transition: "transform 0.15s ease",
            }}
          >
            <div style={{ position: "relative" }}>
              <ShoppingBag size={isMobile ? 16 : 18} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-7px",
                    right: "-8px",
                    backgroundColor: "#FFAE00",
                    color: "#502314",
                    borderRadius: "50%",
                    fontSize: "10px",
                    fontWeight: 900,
                    width: "17px",
                    height: "17px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            {!isMobile && (
              <span>
                {cartTotal > 0 ? `${cartTotal} ج.م` : "السلة"}
              </span>
            )}
          </button>

          {/* Language Toggle Pill */}
          <button
            onClick={toggleLanguage}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #502314",
              borderRadius: "100px",
              padding: isMobile ? "6px 10px" : "7px 14px",
              color: "#502314",
              fontSize: isMobile ? "11.5px" : "12.5px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <Globe size={13} color="#D62300" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          {/* Admin / Staff Login (Desktop) */}
          {!isMobile && (
            <Link
              href={currentUser ? "/dashboard" : "/login"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#502314",
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: "100px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 800,
                boxShadow: "0 2px 8px rgba(80, 35, 20, 0.2)",
              }}
            >
              <User size={15} />
              <span>{currentUser ? currentUser.name.split(" ")[0] : "دخول الإدارة"}</span>
            </Link>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #502314",
                borderRadius: "10px",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#502314",
                cursor: "pointer",
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE COLLAPSIBLE DRAWER ── */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderTop: "1.5px solid #502314",
            padding: "16px 20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 10px 25px rgba(80, 35, 20, 0.15)",
          }}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: "#502314",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "14.5px",
              padding: "8px 0",
              borderBottom: "1px solid #F5EBDC",
            }}
          >
            🏠 الرئيسية
          </Link>

          <Link
            href="/#menu-section"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: "#502314",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "14.5px",
              padding: "8px 0",
              borderBottom: "1px solid #F5EBDC",
            }}
          >
            🍔 المنيو وقائمة البرجر
          </Link>

          <Link
            href="/#offers-section"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: "#D62300",
              textDecoration: "none",
              fontWeight: 900,
              fontSize: "14.5px",
              padding: "8px 0",
              borderBottom: "1px solid #F5EBDC",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Flame size={16} color="#D62300" />
            <span>عروض الكابتن والكومبو 🔥</span>
          </Link>

          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: "#502314",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "14.5px",
              padding: "8px 0",
              borderBottom: "1px solid #F5EBDC",
            }}
          >
            📍 تتبع حالة الطلب
          </Link>

          <Link
            href={currentUser ? "/dashboard" : "/login"}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: "#502314",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "14.5px",
              padding: "8px 0",
              borderBottom: "1px solid #F5EBDC",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <ShieldCheck size={16} color="#502314" />
            <span>{currentUser ? "لوحة الإدارة والتحكم" : "دخول الكاشير والإدارة"}</span>
          </Link>

          {/* Download App APK */}
          <Link
            href="/download"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#FFFFFF",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "14px",
              backgroundColor: "#D62300",
              fontWeight: 900,
              boxShadow: "0 4px 14px rgba(214, 35, 0, 0.35)",
              marginTop: "6px",
            }}
          >
            <Smartphone size={18} color="#FFFFFF" />
            <span>تحميل تطبيق كابتن برجر (APK)</span>
          </Link>
        </div>
      )}
    </header>
  );
}
