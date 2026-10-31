"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Download, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  BellRing, 
  ChevronRight, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  Sparkles,
  Flame
} from "lucide-react";

export default function DownloadAppPage() {
  const [downloading, setDownloading] = useState(false);
  const [autoCountdown, setAutoCountdown] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auto") === "1") {
        setAutoCountdown(3);
      }
    }
  }, []);

  useEffect(() => {
    if (autoCountdown === null) return;
    if (autoCountdown > 0) {
      const timer = setTimeout(() => setAutoCountdown(autoCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoCountdown === 0) {
      handleDownload();
      setAutoCountdown(null);
    }
  }, [autoCountdown]);

  function handleDownload() {
    setDownloading(true);
    const link = document.createElement("a");
    link.href = "/api/download/apk";
    link.setAttribute("download", "captain-burger.apk");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 4000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "تطبيق كابتن برجر للأندرويد",
        text: "حمّل تطبيق كابتن برجر الرسمي للأندرويد واستمتع بأشهى برجر لحم مشوي محشي جبنة وفراخ مقرمشة مع أسرع توصيل في الشيخ زايد و6 أكتوبر!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div 
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#F5EBDC",
        color: "#502314",
        fontFamily: "var(--font-cairo), system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 16px 64px",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Top Navbar */}
      <header 
        style={{
          width: "100%",
          maxWidth: "880px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          zIndex: 10,
        }}
      >
        <Link 
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#502314",
            textDecoration: "none",
            fontSize: "13.5px",
            fontWeight: 800,
            background: "#FFFFFF",
            border: "1.5px solid #502314",
            padding: "8px 18px",
            borderRadius: "100px",
            boxShadow: "0 2px 6px rgba(80,35,20,0.06)",
          }}
        >
          <ChevronRight size={17} />
          <span>الرجوع للمطعم والمنيو</span>
        </Link>

        <button
          onClick={handleShare}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            color: "#D62300",
            background: "#FFFFFF",
            border: "1.5px solid #D62300",
            padding: "8px 16px",
            borderRadius: "100px",
            fontSize: "12.5px",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(214,35,0,0.06)",
          }}
        >
          <Share2 size={15} />
          <span>{copied ? "تم نسخ الرابط! ✓" : "مشاركة التطبيق"}</span>
        </button>
      </header>

      {/* Hero Badge */}
      <div 
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(214, 35, 0, 0.1)",
          border: "1.5px solid #D62300",
          padding: "6px 20px",
          borderRadius: "100px",
          color: "#D62300",
          fontSize: "12.5px",
          fontWeight: 900,
          marginBottom: "16px",
          zIndex: 10,
        }}
      >
        <Sparkles size={15} />
        <span>النسخة الأصلية الرسمية • Android APK v1.0.0</span>
      </div>

      {/* Main Title */}
      <h1 
        style={{
          fontSize: "clamp(26px, 5vw, 40px)",
          fontWeight: 900,
          textAlign: "center",
          marginBottom: "10px",
          color: "#502314",
          lineHeight: 1.25,
          zIndex: 10,
        }}
      >
        حمّل تطبيق كابتن برجر الرسمي 🍔🔥
      </h1>
      <p 
        style={{
          color: "#6B4226",
          fontSize: "clamp(14px, 2.5vw, 16px)",
          textAlign: "center",
          maxWidth: "580px",
          lineHeight: 1.6,
          marginBottom: "32px",
          zIndex: 10,
          fontWeight: 700,
        }}
      >
        طعم البرجر الأصلي! استمتع بأشهى ساندوتشات البيف المشوي المحشي جبنة، الفراخ الكريسبي، ولودد تشيز فرايز مع توصيل سريع لكافة أحياء الشيخ زايد و6 أكتوبر.
      </p>

      {/* Auto Countdown Banner if triggered */}
      {autoCountdown !== null && (
        <div 
          style={{
            background: "#DCFCE7",
            border: "1px solid #86EFAC",
            borderRadius: "14px",
            padding: "12px 20px",
            marginBottom: "24px",
            color: "#15803D",
            fontSize: "14px",
            fontWeight: 800,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16a34a", animation: "pulse 1.2s infinite" }} />
          <span>سيبدأ تحميل التطبيق تلقائياً خلال {autoCountdown} ثانية...</span>
        </div>
      )}

      {/* Download Center Card */}
      <main
        style={{
          width: "100%",
          maxWidth: "880px",
          background: "#FFFFFF",
          border: "2px solid #502314",
          borderRadius: "28px",
          padding: "36px 28px",
          boxShadow: "0 20px 50px rgba(80, 35, 20, 0.08)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "36px",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Left Column: QR Code & Scan Instructions */}
        <div 
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            background: "#F5EBDC",
            border: "2px solid #502314",
            borderRadius: "22px",
            padding: "24px 20px",
          }}
        >
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              color: "#D62300",
              fontSize: "13px",
              fontWeight: 900,
              marginBottom: "14px",
            }}
          >
            <QrCode size={18} />
            <span>امسح الكود بكاميرا الموبايل للتحميل المباشر</span>
          </div>

          <div 
            style={{
              background: "#FFFFFF",
              padding: "12px",
              borderRadius: "18px",
              border: "1.5px solid #502314",
              boxShadow: "0 8px 24px rgba(80, 35, 20, 0.08)",
              marginBottom: "16px",
            }}
          >
            <img 
              src="/captain-apk-qr.png" 
              alt="QR Code لتحميل تطبيق كابتن برجر"
              style={{
                width: "190px",
                height: "190px",
                display: "block",
                borderRadius: "10px",
              }}
            />
          </div>

          <p style={{ color: "#6B4226", fontSize: "12.5px", maxWidth: "230px", lineHeight: 1.5, fontWeight: 700 }}>
            وجّه كاميرا هاتفك نحو الكود ليتم فتح صفحة التحميل وتثبيت ملف التطبيق مباشرة.
          </p>
        </div>

        {/* Right Column: Action Buttons & Install Guide */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Smartphone size={24} style={{ color: "#D62300" }} />
              <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#502314", margin: 0 }}>
                نسخة الأندرويد الرسمية المباشرة
              </h2>
            </div>
            <p style={{ color: "#6B4226", fontSize: "13px", margin: 0, fontWeight: 700 }}>
              حجم الملف: <strong>12 ميجابايت</strong> • متوافق مع كافة أجهزة Android 8.0 فما فوق
            </p>
          </div>

          {/* Big Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              background: downloading 
                ? "#16a34a" 
                : "linear-gradient(135deg, #D62300 0%, #A51800 100%)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "16px",
              padding: "18px 24px",
              fontSize: "16.5px",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              boxShadow: "0 12px 30px rgba(214, 35, 0, 0.35)",
              transition: "all 0.25s ease",
            }}
          >
            {downloading ? (
              <>
                <CheckCircle2 size={22} />
                <span>جاري بدء التحميل الآن...</span>
              </>
            ) : (
              <>
                <Download size={22} />
                <span>تحميل ملف تطبيق كابتن برجر (APK)</span>
              </>
            )}
          </button>

          {/* Direct link fallback */}
          <div style={{ textAlign: "center" }}>
            <a 
              href="https://github.com/hamzaovet/captain-burger/releases/download/v1.0.0/captain-burger.apk"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#D62300",
                fontSize: "12.5px",
                textDecoration: "underline",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 800,
              }}
            >
              <span>رابط تحميل احتياطي مباشر (GitHub Releases)</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Quick 3-Step Install Guide */}
          <div 
            style={{
              background: "#F5EBDC",
              border: "1.5px solid #502314",
              borderRadius: "16px",
              padding: "16px 18px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 900, color: "#502314", marginBottom: "12px" }}>
              خطوات التثبيت السريعة (3 خطوات فقط):
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px", color: "#6B4226", fontWeight: 700 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ 
                  background: "#D62300", 
                  color: "#FFFFFF", 
                  width: "20px", 
                  height: "20px", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "11px", 
                  fontWeight: 900,
                  flexShrink: 0,
                  marginTop: "1px"
                }}>1</span>
                <span>اضغط على زر <strong>تحميل ملف تطبيق كابتن برجر</strong> أعلاه أو امسح كود QR.</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ 
                  background: "#D62300", 
                  color: "#FFFFFF", 
                  width: "20px", 
                  height: "20px", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "11px", 
                  fontWeight: 900,
                  flexShrink: 0,
                  marginTop: "1px"
                }}>2</span>
                <span>افتح الملف من التنزيلات واضغط <strong>تثبيت (Install)</strong>. إذا طلب هاتفك السماح اختر "السماح بالتثبيت من هذا المصدر".</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ 
                  background: "#D62300", 
                  color: "#FFFFFF", 
                  width: "20px", 
                  height: "20px", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "11px", 
                  fontWeight: 900,
                  flexShrink: 0,
                  marginTop: "1px"
                }}>3</span>
                <span>افتح التطبيق واستمتع بأشهى برجر لحم مشوي وفراخ مقرمشة وعروض التوفير الحصرية! 🍔🔥</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Highlights Grid */}
      <section
        style={{
          width: "100%",
          maxWidth: "880px",
          marginTop: "36px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          zIndex: 10,
        }}
      >
        <div 
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #502314",
            borderRadius: "18px",
            padding: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            boxShadow: "0 2px 8px rgba(80,35,20,0.04)",
          }}
        >
          <div style={{ background: "rgba(214, 35, 0, 0.1)", padding: "10px", borderRadius: "12px", color: "#D62300" }}>
            <Zap size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 900, color: "#502314", marginBottom: "4px" }}>سرعة استجابة فائقة</h4>
            <p style={{ fontSize: "12px", color: "#6B4226", lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              تصفح سلس للمنيو وأصناف البرجر والكومبو دون الحاجة لفتح المتصفح.
            </p>
          </div>
        </div>

        <div 
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #502314",
            borderRadius: "18px",
            padding: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            boxShadow: "0 2px 8px rgba(80,35,20,0.04)",
          }}
        >
          <div style={{ background: "rgba(214, 35, 0, 0.1)", padding: "10px", borderRadius: "12px", color: "#D62300" }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 900, color: "#502314", marginBottom: "4px" }}>شات خاص ومباشر</h4>
            <p style={{ fontSize: "12px", color: "#6B4226", lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              محادثاتك مع المطعم معزولة تماماً لمتابعة تفاصيل طلبك بدقة وسرعة.
            </p>
          </div>
        </div>

        <div 
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #502314",
            borderRadius: "18px",
            padding: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            boxShadow: "0 2px 8px rgba(80,35,20,0.04)",
          }}
        >
          <div style={{ background: "rgba(214, 35, 0, 0.1)", padding: "10px", borderRadius: "12px", color: "#D62300" }}>
            <BellRing size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 900, color: "#502314", marginBottom: "4px" }}>إشعارات وعروض فورية</h4>
            <p style={{ fontSize: "12px", color: "#6B4226", lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              تنبيهات فورية بأقوى عروض التوفير ومتابعة حالة الدليفري والطيار خطوة بخطوة.
            </p>
          </div>
        </div>
      </section>

      {/* App Stores Roadmap */}
      <footer 
        style={{
          width: "100%",
          maxWidth: "880px",
          marginTop: "48px",
          textAlign: "center",
          borderTop: "1.5px solid rgba(80, 35, 20, 0.15)",
          paddingTop: "24px",
          color: "#6B4226",
          fontSize: "12.5px",
          zIndex: 10,
        }}
      >
        <p style={{ marginBottom: "8px", fontWeight: 700 }}>
          🚀 جاري تجهيز وإصدار النسخة الرسمية على <strong>Google Play Store</strong> و <strong>Apple App Store</strong>.
        </p>
        <p style={{ color: "#502314", fontWeight: 900, marginBottom: "12px" }}>
          جميع الحقوق محفوظة © كابتن برجر (Captain Burger) {new Date().getFullYear()}
        </p>
        <div>
          <a
            href="https://wa.me/201018671000"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#6B4226",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "100px",
              background: "#FFFFFF",
              border: "1.5px solid #502314",
              boxShadow: "0 2px 6px rgba(80,35,20,0.06)",
            }}
          >
            <span>تم التطوير بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية 🐋</span>
            <span style={{ direction: "ltr", fontFamily: "monospace" }}>01018671000</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
