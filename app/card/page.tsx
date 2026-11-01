"use client";

import React from "react";
import Link from "next/link";
import { Download, ExternalLink, ArrowRight, Home } from "lucide-react";

export default function CardPage() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#140C07",
        color: "#FAF3E8",
        fontFamily: "var(--font-cairo), -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px 60px",
      }}
    >
      {/* Header bar */}
      <header
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(255, 174, 0, 0.2)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#FFAE00",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "14px",
          }}
        >
          <Home size={18} />
          <span>الرئيسية للمتجر</span>
        </Link>

        <span
          style={{
            backgroundColor: "#23150C",
            border: "1px solid #FFAE00",
            padding: "4px 12px",
            borderRadius: "100px",
            fontSize: "12px",
            fontWeight: 900,
            color: "#FFAE00",
          }}
        >
          كارت التدشين الرسمي والباركود 🍔
        </span>
      </header>

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 900,
            color: "#FFAE00",
            margin: "0 0 8px 0",
          }}
        >
          بطاقة مطعم كابتن برجر الرسمية
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#D8BFA6",
            margin: "0 0 24px 0",
            fontWeight: 600,
          }}
        >
          كارت الطباعة الرسمي المعتمد يحتوي على باركود المتجر السريع وباركود تطبيق الأندرويد APK
        </p>

        {/* Action Button: Download PNG */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <a
            href="/captain-official-card.png"
            download="captain-burger-card.png"
            style={{
              backgroundColor: "#D62300",
              color: "#FFFFFF",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: "16px",
              fontSize: "15px",
              fontWeight: 900,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 8px 24px rgba(214, 35, 0, 0.4)",
            }}
          >
            <Download size={20} />
            <span>تحميل الكارت الأصلي بجودة فائقة (PNG)</span>
          </a>

          <Link
            href="/download"
            style={{
              backgroundColor: "#23150C",
              color: "#FFAE00",
              border: "2px solid #FFAE00",
              textDecoration: "none",
              padding: "14px 24px",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>صفحة تنزيل التطبيق (APK)</span>
          </Link>
        </div>

        {/* Card Image Display */}
        <div
          style={{
            backgroundColor: "#23150C",
            borderRadius: "28px",
            padding: "12px",
            border: "2px solid #FFAE00",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          <img
            src="/captain-official-card.png"
            alt="كارت كابتن برجر الرسمي"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "20px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
