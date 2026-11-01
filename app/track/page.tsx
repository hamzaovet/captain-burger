"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, Bike, CheckCircle2, Clock, ChefHat, 
  MapPin, Phone, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, Loader2
} from "lucide-react";
import { playSound } from "@/lib/sounds";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  const [query, setQuery] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrder) {
      handleSearch(initialOrder);
    }
  }, [initialOrder]);

  async function handleSearch(searchQuery?: string) {
    const q = (searchQuery || query).trim();
    if (!q) {
      setError("يرجى إدخال رقم الطلب أو رقم الهاتف");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      playSound("click");

      const res = await fetch(`/api/public/track?query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        } else if (data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        } else {
          setError("لم نتمكن من العثور على طلب بهذا الرقم. تأكد من صحة رقم الطلب أو رقم الموبايل.");
          setOrder(null);
        }
      } else {
        setError("لم يتم العثور على طلب مطابق.");
        setOrder(null);
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  // Stepper stages: new -> kitchen/preparing -> delivering/driver -> delivered
  const stages = [
    { key: "new", title: "تم تأكيد الطلب", desc: "استلمنا طلبك وجاري مراجعته", icon: "📋" },
    { key: "preparing", title: "قيد التحضير عالفحم", desc: "شيفات كابتن برجر تشوي البرجر طازج حالاً", icon: "🍔" },
    { key: "delivering", title: "في الطريق إليك", desc: "الطلب مع طيار كابتن برجر متجهاً لعنوانك", icon: "🛵" },
    { key: "completed", title: "تم التوصيل بنجاح", desc: "بالهنا والشفا! نورت كابتن برجر", icon: "🎉" },
  ];

  function getActiveStageIndex(status: string) {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "delivered") return 3;
    if (s === "delivering" || s === "on_the_way" || s === "with_driver") return 2;
    if (s === "preparing" || s === "in_kitchen" || s === "cooking") return 1;
    return 0; // new
  }

  const currentStageIdx = order ? getActiveStageIndex(order.status) : 0;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px 16px" }}>
      {/* Title Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#FAF3E8",
            border: "2px solid #FFAE00",
            padding: "6px 16px",
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: 900,
            color: "#D62300",
            marginBottom: "12px",
          }}
        >
          <Bike size={16} />
          <span>تتبع أوردر كابتن برجر المباشر 🛵💨</span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#502314", margin: "0 0 8px 0" }}>
          أين طلبي الآن؟
        </h1>
        <p style={{ fontSize: "14px", color: "#7E6554", margin: 0, fontWeight: 600 }}>
          أدخل رقم الطلب (Order #) أو رقم هاتفك لمعرفة حالة البرجر وموقع الطيار لحظياً
        </p>
      </div>

      {/* Search Input Box */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "16px",
          border: "2px solid rgba(80, 35, 20, 0.12)",
          boxShadow: "0 10px 30px rgba(80, 35, 20, 0.06)",
          marginBottom: "32px",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7E6554",
              }}
            />
            <input
              type="text"
              placeholder="اكتب رقم الطلب (مثال: CPT-20261101...) أو رقم الهاتف..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 44px 14px 14px",
                backgroundColor: "#F5EBDC",
                border: "2px solid transparent",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#502314",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#D62300")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#D62300",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "16px",
              padding: "14px 28px",
              fontSize: "14px",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(214, 35, 0, 0.3)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>جاري البحث...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>تتبع الطلب</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: "14px",
              padding: "12px 16px",
              backgroundColor: "#FEF2F2",
              border: "1.5px solid #FCA5A5",
              borderRadius: "14px",
              color: "#991B1B",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "28px",
            border: "2px solid #FFAE00",
            boxShadow: "0 12px 40px rgba(80, 35, 20, 0.1)",
            overflow: "hidden",
            animation: "fadeIn 0.3s ease",
          }}
        >
          {/* Header Status Bar */}
          <div
            style={{
              backgroundColor: "#502314",
              color: "#FAF3E8",
              padding: "20px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              borderBottom: "3px solid #FFAE00",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  backgroundColor: "#D62300",
                  color: "#FFFFFF",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  display: "inline-block",
                  marginBottom: "4px",
                }}
              >
                طلب رقم: #{order.orderNumber}
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 900, margin: 0, color: "#FFAE00" }}>
                {order.customerName}
              </h2>
            </div>

            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: "12px", color: "#FAF3E8", opacity: 0.8, display: "block" }}>
                إجمالي الفاتورة
              </span>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "#FFAE00" }}>
                {order.total || order.totalAmount} ج.م
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div style={{ padding: "30px 24px", backgroundColor: "#FAF3E8" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", position: "relative" }}>
              {stages.map((stg, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div
                    key={stg.key}
                    style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        backgroundColor: isPassed ? (isCurrent ? "#D62300" : "#502314") : "#EADBCC",
                        color: isPassed ? "#FFFFFF" : "#7E6554",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        marginBottom: "10px",
                        border: isCurrent ? "4px solid #FFAE00" : "2px solid transparent",
                        boxShadow: isPassed ? "0 4px 14px rgba(80, 35, 20, 0.2)" : "none",
                        transition: "all 0.3s",
                      }}
                    >
                      {stg.icon}
                    </div>

                    <h4
                      style={{
                        fontSize: "12px",
                        fontWeight: 900,
                        color: isPassed ? "#502314" : "#7E6554",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {stg.title}
                    </h4>

                    <p
                      style={{
                        fontSize: "10px",
                        color: "#7E6554",
                        margin: 0,
                        lineHeight: 1.3,
                        display: "none",
                      }}
                    >
                      {stg.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Body */}
          <div style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 900, color: "#502314", marginBottom: "16px" }}>
              تفاصيل الطلب والعنوان:
            </h3>

            <div
              style={{
                backgroundColor: "#F5EBDC",
                padding: "16px",
                borderRadius: "18px",
                border: "1px solid rgba(80,35,20,0.12)",
                marginBottom: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
                fontSize: "13px",
              }}
            >
              <div>
                <span style={{ color: "#7E6554", fontWeight: 700, display: "block" }}>نوع الخدمة:</span>
                <span style={{ fontWeight: 900, color: "#502314" }}>
                  {order.orderType === "takeaway" ? "استلام من الفرع (تيك أواي)" : order.orderType === "dinein" ? "طلب بالصالة" : "توصيل للمنزل (دليفري)"}
                </span>
              </div>

              <div>
                <span style={{ color: "#7E6554", fontWeight: 700, display: "block" }}>منطقة التوصيل:</span>
                <span style={{ fontWeight: 900, color: "#502314" }}>
                  {order.zone || order.deliveryZone || "فروع الشيخ زايد و6 أكتوبر"}
                </span>
              </div>

              <div>
                <span style={{ color: "#7E6554", fontWeight: 700, display: "block" }}>العنوان:</span>
                <span style={{ fontWeight: 900, color: "#502314" }}>
                  {order.address || order.deliveryAddress || "غير محدد"}
                </span>
              </div>

              <div>
                <span style={{ color: "#7E6554", fontWeight: 700, display: "block" }}>طريقة الدفع:</span>
                <span style={{ fontWeight: 900, color: "#D62300" }}>
                  {order.paymentMethod === "cash" ? "كاش عند الاستلام" : order.paymentMethod}
                </span>
              </div>
            </div>

            {/* Need Help Action */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(80,35,20,0.1)",
              }}
            >
              <a
                href="https://wa.me/201206002168"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: "#25D366",
                  color: "#FFFFFF",
                  padding: "12px 20px",
                  borderRadius: "14px",
                  fontSize: "13px",
                  fontWeight: 900,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                }}
              >
                <Phone size={16} />
                <span>تواصل مع المطعم واتساب</span>
              </a>

              <Link
                href="/"
                style={{
                  backgroundColor: "#502314",
                  color: "#FAF3E8",
                  padding: "12px 20px",
                  borderRadius: "14px",
                  fontSize: "13px",
                  fontWeight: 900,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>طلب وجبة جديدة 🍔</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <div style={{ backgroundColor: "#F5EBDC", minHeight: "100vh", direction: "rtl", fontFamily: "var(--font-cairo), sans-serif" }}>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "80px", color: "#502314" }}>جاري تحميل صفحة التتبع...</div>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
