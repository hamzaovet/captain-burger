"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { playSound } from "@/lib/sounds";
import CustomerAccountModal from "@/components/CustomerAccountModal";
import CustomerChatWidget from "@/components/CustomerChatWidget";
import { ALL_DELIVERY_ZONES, DEFAULT_ZONE, ZoneItem } from "@/lib/zones";
import {
  ShoppingCart, X, Plus, Minus, Search,
  MapPin, Phone, Clock, CheckCircle2, Loader2,
  Bike, CreditCard, ChefHat, ChevronRight, ChevronLeft,
  Sparkles, Flame, Gift, Store, Utensils,
  Share2, ShieldCheck, Tag, Heart, Info, ArrowLeft, ArrowRight,
  Award, QrCode, Ticket, Check, Compass, Star, Percent
} from "lucide-react";

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  basePrice: number;
  originalPrice?: number | null;
  promoPrice?: number | null;
  promoDays?: string | null;
  promoActive?: boolean;
  isFlashDeal?: boolean;
  trayComponents?: string | null;
  modifiers?: string | null;
  sizes?: string | null;
  image?: string | null;
  description?: string | null;
  isAvailable: boolean;
  sortOrder?: number;
}

interface CartItem {
  product: Product;
  qty: number;
  extras: string[];
  unitPrice: number;
  selectedOption?: string | null;
}

// Burger King Style Hero Carousel for Captain Burger
const HERO_SLIDES = [
  {
    id: "monster-box",
    badge: "وفر 120 جنيه 🔥 العرض الأقوى",
    title: "كابتن بوكس العائلي العملاق",
    subtitle: "4 ساندوتشات كابتن برجر لحم مشوي عالفحم ودجاج كرسبي + لودد فرايز عائلي بالجبنة والبيكون + 4 كانز بيبسي مثلج + صوصات الكابتن الخاصة.",
    price: 499,
    originalPrice: 620,
    note: "يكفي حتى 5 أفراد - وجبة اللمة والصحاب الأوفر",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80",
    cta: "اطلب البوكس الآن",
  },
  {
    id: "juicy-lucy",
    badge: "الأكثر طلباً 🍔 غرقان جبنة",
    title: "جوسي لوسي محشو شيدر مدخن",
    subtitle: "200 جرام لحم بقري بلدي 100% محشو بقلب بركان من الجبنة الشيدر المستوردة والبيكون مع صوص الكابتن السري في خبز بريوش طازج.",
    price: 185,
    originalPrice: 215,
    note: "احذر البركان عند أول قضمة! 🔥",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
    cta: "جرّب الجوسي لوسي",
  },
  {
    id: "double-smash",
    badge: "سماش أصلي 🥩 كراست مقرمش",
    title: "دبل كابتن سماش كلاسيك",
    subtitle: "قطعتين لحم سماش 300 جرام مقرمشين عالجريل مع دبل جبنة أمريكية سايحة وخيار مخلل وصوص البرجر الخاص.",
    price: 210,
    originalPrice: 245,
    note: "طعم الجريل الحقيقي مع كل قضمة",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    cta: "اطلب السماشر",
  },
  {
    id: "fire-chicken",
    badge: "قرمشة حارة نارية 🍗",
    title: "فاير كرسبي تشيكن تاور",
    subtitle: "صدر دجاج كرسبي مقرمش تتبيلة حارة مع جبنة بيبر جاك وصوص سريراتشا مايونيز وهالبينو في عيش بطاطس ذهبي.",
    price: 165,
    originalPrice: 190,
    note: "لمحبي السبايسي والقرمشة العالية",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80",
    cta: "اطلب الكرسبي",
  },
];

const CATEGORY_NAMES = [
  "الكل",
  "برجر لحم بلدي فاخر",
  "برجر دجاج كرسبي",
  "عروض وكومبو الكابتن",
  "بطاطس ومقبلات",
  "صوصات ومشروبات",
];

const EXTRA_OPTIONS = [
  { nameAr: "إكسترا جبنة شيدر سايحة 🧀", price: 20 },
  { nameAr: "إكسترا بيف بيكون مدخن 🥓", price: 30 },
  { nameAr: "شرائح هالبينو حارة سبايسي 🌶️", price: 15 },
  { nameAr: "أصابع موتزاريلا كرسبي (2 ق) 🧀", price: 35 },
  { nameAr: "حلقات بصل مقرمشة (4 ق) 🧅", price: 30 },
  { nameAr: "صوص كابتن رانش إضافي 🥣", price: 20 },
  { nameAr: "صوص بيج تيستي إضافي 🥣", price: 20 },
];

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // BK 4-Bottom-Tab state: "home" | "menu" | "offers" | "rewards"
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "offers" | "rewards">("home");

  // Hero carousel
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch Swipe for Carousel
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX;
  }
  function handleTouchMove(e: React.TouchEvent) {
    touchEndXRef.current = e.touches[0].clientX;
  }
  function handleTouchEnd() {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 40) {
      nextHero();
    } else if (diff < -40) {
      prevHero();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  }

  // Cart & Order
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<"delivery" | "takeaway" | "dine_in">("delivery");

  // Customer Account & Chat Modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);

  // Customization Modal
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [itemNote, setItemNote] = useState("");

  // Customer Checkout Form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedZone, setSelectedZone] = useState<ZoneItem>(DEFAULT_ZONE);
  const [tableNumber, setTableNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "vodafone_cash" | "instapay">("cash");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Coupon / Promo Code
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Flash Deal Timer (Seconds)
  const [flashSeconds, setFlashSeconds] = useState(14520);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSeconds((prev) => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function formatFlashTime(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // Auto-advance Carousel
  useEffect(() => {
    heroTimerRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, []);

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };
  const prevHero = () => {
    setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Listen to Navbar Cart & Account Trigger Events
  useEffect(() => {
    const handleCartOpen = () => setCartOpen(true);
    window.addEventListener("captain-open-cart", handleCartOpen);

    const handleCustomerOpen = () => setCustomerModalOpen(true);
    window.addEventListener("captain-open-customer-modal", handleCustomerOpen);

    return () => {
      window.removeEventListener("captain-open-cart", handleCartOpen);
      window.removeEventListener("captain-open-customer-modal", handleCustomerOpen);
    };
  }, []);

  // Fetch Menu from API
  useEffect(() => {
    fetchMenu();
    loadCartFromStorage();
  }, []);

  async function fetchMenu() {
    try {
      setLoading(true);
      const res = await fetch("/api/menu");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load menu:", err);
    } finally {
      setLoading(false);
    }
  }

  function loadCartFromStorage() {
    try {
      const raw = localStorage.getItem("captain_cart");
      if (raw) {
        setCart(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function saveCartToStorage(updated: CartItem[]) {
    setCart(updated);
    try {
      localStorage.setItem("captain_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("captain-cart-updated"));
    } catch (e) {
      console.error(e);
    }
  }

  function getProductPrice(prod: Product): number {
    if (prod.promoActive && prod.promoPrice) {
      return prod.promoPrice;
    }
    return prod.basePrice;
  }

  function openCustomizeModal(prod: Product) {
    setCustomizingProduct(prod);
    const parsedSizes = prod.sizes ? JSON.parse(prod.sizes) : [];
    setSelectedSize(parsedSizes.length > 0 ? parsedSizes[0] : null);
    setSelectedExtras([]);
    setItemNote("");
  }

  function addToCartDirect(prod: Product) {
    playSound("add");
    const unitPrice = getProductPrice(prod);
    const existingIndex = cart.findIndex(
      (item) => item.product.id === prod.id && (!item.extras || item.extras.length === 0) && !item.selectedOption
    );

    let updated = [...cart];
    if (existingIndex > -1) {
      updated[existingIndex].qty += 1;
    } else {
      updated.push({
        product: prod,
        qty: 1,
        extras: [],
        unitPrice,
      });
    }
    saveCartToStorage(updated);
  }

  function addCustomizedToCart() {
    if (!customizingProduct) return;
    playSound("add");

    let unitPrice = getProductPrice(customizingProduct);
    let sizeTitle = "";
    if (selectedSize) {
      unitPrice += selectedSize.price || 0;
      sizeTitle = selectedSize.nameAr;
    }

    // Add extras cost
    selectedExtras.forEach((extraName) => {
      const found = EXTRA_OPTIONS.find((e) => e.nameAr === extraName);
      if (found) unitPrice += found.price;
    });

    const updated = [...cart];
    updated.push({
      product: customizingProduct,
      qty: 1,
      extras: selectedExtras,
      unitPrice,
      selectedOption: [sizeTitle, itemNote].filter(Boolean).join(" - "),
    });

    saveCartToStorage(updated);
    setCustomizingProduct(null);
  }

  function updateItemQty(index: number, delta: number) {
    const updated = [...cart];
    const newQty = updated[index].qty + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].qty = newQty;
    }
    saveCartToStorage(updated);
  }

  function clearCart() {
    saveCartToStorage([]);
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode("");
  }

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const deliveryFee = orderType === "delivery" ? selectedZone.fee : 0;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryFee);
  const cartTotalQty = cart.reduce((s, i) => s + i.qty, 0);

  function applyCoupon(codeToApply?: string) {
    const c = (codeToApply || couponCode).trim().toUpperCase();
    if (c === "CAPTAIN20" || c === "كابتن20") {
      const discount = Math.round(cartSubtotal * 0.2);
      setCouponDiscount(discount);
      setCouponApplied(true);
      setCouponCode(c);
      playSound("cash");
    } else if (c === "DUODEAL" || c === "عصابة") {
      setCouponDiscount(40);
      setCouponApplied(true);
      setCouponCode(c);
      playSound("cash");
    } else if (c === "FREEFRIES" || c === "بطاطس") {
      setCouponDiscount(35);
      setCouponApplied(true);
      setCouponCode(c);
      playSound("cash");
    } else {
      alert("عذراً، كود الخصم غير صحيح أو منتهي الصلاحية.");
    }
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) {
      alert("يرجى إدخال الاسم ورقم الهاتف لمتابعة الطلب");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress) {
      alert("يرجى إدخال تفاصيل عنوان التوصيل بالتفصيل");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customerName,
        customerPhone,
        serviceType: orderType,
        deliveryZone: orderType === "delivery" ? selectedZone.nameAr : null,
        deliveryFee,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : null,
        tableNumber: orderType === "dine_in" ? tableNumber : null,
        paymentMethod,
        notes: [orderNotes, couponApplied ? `كوبون مطبق: ${couponCode}` : ""].filter(Boolean).join(" | "),
        items: cart.map((item) => ({
          productId: item.product.id,
          productNameAr: item.product.nameAr,
          productNameEn: item.product.nameEn,
          qty: item.qty,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.qty,
          notes: [item.selectedOption, item.extras.join(", ")].filter(Boolean).join(" | "),
        })),
        totalAmount: cartTotal,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const orderData = await res.json();
        playSound("cash");
        setOrderSuccess(orderData);
        clearCart();
      } else {
        alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى أو الاتصال بنا.");
      }
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالخادم. يرجى مراجعة الاتصال بالإنترنت.");
    } finally {
      setSubmitting(false);
    }
  }

  // Filter products by active category & search
  const filteredProducts = products.filter((prod) => {
    const matchCategory =
      activeCategory === "الكل" ||
      prod.category === activeCategory ||
      (activeCategory === "برجر لحم بلدي فاخر" && prod.category.includes("لحم")) ||
      (activeCategory === "برجر دجاج كرسبي" && prod.category.includes("دجاج")) ||
      (activeCategory === "عروض وكومبو الكابتن" && (prod.category.includes("كومبو") || prod.category.includes("عروض"))) ||
      (activeCategory === "بطاطس ومقبلات" && (prod.category.includes("بطاطس") || prod.category.includes("مقبلات"))) ||
      (activeCategory === "صوصات ومشروبات" && (prod.category.includes("صوص") || prod.category.includes("مشروب")));

    const matchSearch =
      !searchQuery ||
      prod.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5EBDC] text-[#502314] pb-28 font-sans selection:bg-[#D62300] selection:text-white">
      {/* 1. TOP HEADER / SERVICE SELECTOR & APP DOWNLOAD BAR */}
      <div className="bg-[#502314] text-[#FAF3E8] py-2 px-4 shadow-md text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-[#D62300] text-white font-black px-2 py-0.5 rounded-full text-[11px] animate-pulse">
              HOT
            </span>
            <span className="font-bold hidden sm:inline">
              🍔 كابتن برجر - فروعنا في الشيخ زايد و 6 أكتوبر
            </span>
            <span className="font-bold sm:hidden">
              كابتن برجر - زايد وأكتوبر
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:01206002168"
              className="flex items-center gap-1.5 text-[#FFAE00] font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span dir="ltr">01206002168</span>
            </a>
            <span className="text-[#FAF3E8]/30">|</span>
            <Link
              href="/download"
              className="bg-[#FFAE00] text-[#502314] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-yellow-400 transition-all shadow-sm text-xs"
            >
              <span>حمّل الأبلكيشن</span>
              <span className="text-[10px] bg-[#502314] text-white px-1 rounded">APK</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTENT SWITCHER */}
      {/* ============================================================ */}
      {/* TAB 1: HOME (الرئيسية 🏠) */}
      {/* ============================================================ */}
      {activeTab === "home" && (
        <main className="animate-fadeIn">
          {/* Service Mode Selector (Delivery / Takeaway / Dine-in) */}
          <div className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
            <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-md border-2 border-[#502314]/10 flex items-center justify-between gap-1 sm:gap-2">
              <button
                onClick={() => {
                  setOrderType("delivery");
                  playSound("click");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all ${
                  orderType === "delivery"
                    ? "bg-[#D62300] text-white shadow-md scale-[1.02]"
                    : "text-[#502314] hover:bg-[#F5EBDC]"
                }`}
              >
                <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>دليفري سريع</span>
              </button>

              <button
                onClick={() => {
                  setOrderType("takeaway");
                  playSound("click");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all ${
                  orderType === "takeaway"
                    ? "bg-[#D62300] text-white shadow-md scale-[1.02]"
                    : "text-[#502314] hover:bg-[#F5EBDC]"
                }`}
              >
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>استلام تيك أواي</span>
              </button>

              <button
                onClick={() => {
                  setOrderType("dine_in");
                  playSound("click");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all ${
                  orderType === "dine_in"
                    ? "bg-[#D62300] text-white shadow-md scale-[1.02]"
                    : "text-[#502314] hover:bg-[#F5EBDC]"
                }`}
              >
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>طلب داخل الصالة</span>
              </button>
            </div>
          </div>

          {/* Juicy Hero Carousel */}
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#502314] border-4 border-[#FFAE00]/40 group"
            >
              <div className="relative min-h-[380px] sm:min-h-[440px] flex items-center">
                {/* Background Image with Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
                  style={{ backgroundImage: `url(${HERO_SLIDES[heroIndex].image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#502314] via-[#502314]/90 to-transparent" />
                </div>

                {/* Slide Text Content */}
                <div className="relative z-10 p-6 sm:p-12 max-w-xl text-white">
                  <span className="inline-block bg-[#D62300] text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full mb-3 shadow-lg">
                    {HERO_SLIDES[heroIndex].badge}
                  </span>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight mb-2 sm:mb-4 text-[#FFAE00]">
                    {HERO_SLIDES[heroIndex].title}
                  </h1>
                  <p className="text-sm sm:text-base text-[#FAF3E8] mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                    {HERO_SLIDES[heroIndex].subtitle}
                  </p>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl sm:text-4xl font-black text-[#FFAE00]">
                      {HERO_SLIDES[heroIndex].price} <span className="text-lg">جنيه</span>
                    </span>
                    <span className="text-lg sm:text-xl text-white/50 line-through">
                      {HERO_SLIDES[heroIndex].originalPrice} جنيه
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveTab("menu");
                        playSound("click");
                      }}
                      className="bg-[#D62300] hover:bg-red-700 text-white font-black px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 text-sm sm:text-base"
                    >
                      <span>{HERO_SLIDES[heroIndex].cta}</span>
                      <ArrowLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("offers");
                        playSound("click");
                      }}
                      className="bg-white/10 hover:bg-white/20 text-[#FFAE00] border border-[#FFAE00]/40 font-bold px-4 py-3 rounded-2xl text-sm transition-all"
                    >
                      كافة العروض 🔥
                    </button>
                  </div>
                </div>

                {/* Left / Right Nav Arrows */}
                <button
                  onClick={prevHero}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm"
                  aria-label="Previous slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={nextHero}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm"
                  aria-label="Next slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      heroIndex === idx ? "w-8 bg-[#FFAE00]" : "w-2.5 bg-white/40"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Categories Bar (Click switches to Menu tab) */}
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg sm:text-xl font-black text-[#502314] flex items-center gap-2">
                <span>تصفح الأقسام</span>
                <span className="text-xs bg-[#FFAE00] text-[#502314] px-2 py-0.5 rounded-full font-bold">
                  طازج يومياً
                </span>
              </h2>
              <button
                onClick={() => setActiveTab("menu")}
                className="text-xs sm:text-sm font-bold text-[#D62300] hover:underline flex items-center gap-1"
              >
                <span>فتح المنيو بالكامل</span>
                <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { name: "برجر لحم بلدي", icon: "🥩", count: "10 أصناف", cat: "برجر لحم بلدي فاخر" },
                { name: "دجاج كرسبي", icon: "🍗", count: "5 أصناف", cat: "برجر دجاج كرسبي" },
                { name: "كومبو وعروض", icon: "🎁", count: "توفير عالي", cat: "عروض وكومبو الكابتن" },
                { name: "لودد فرايز ومقبلات", icon: "🍟", count: "غرقان شيدر", cat: "بطاطس ومقبلات" },
                { name: "صوصات وميلك شيك", icon: "🥤", count: "نوتيلا ولوتس", cat: "صوصات ومشروبات" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategory(item.cat);
                    setActiveTab("menu");
                    playSound("click");
                  }}
                  className="bg-white hover:bg-[#FAF3E8] p-3 sm:p-4 rounded-2xl shadow-sm border border-[#502314]/10 text-right flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-[#502314] group-hover:text-[#D62300] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-xs text-[#502314]/60 font-medium">{item.count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Best Sellers Hits Section */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-black uppercase text-[#D62300] tracking-wider">
                  الأكثر مبيعاً هذا الأسبوع
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#502314] flex items-center gap-2">
                  <span>أطباق الكابتن المميزة 🔥</span>
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#D62300] animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.slice(0, 6).map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#502314]/10 hover:border-[#FFAE00] transition-all flex flex-col justify-between group"
                  >
                    <div className="relative h-48 bg-[#F5EBDC] overflow-hidden">
                      <img
                        src={prod.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"}
                        alt={prod.nameAr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {prod.promoActive && (
                        <div className="absolute top-3 right-3 bg-[#D62300] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                          عرض خاص 🔥
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-[#502314]/80 backdrop-blur-sm text-[#FFAE00] text-xs font-bold px-2 py-1 rounded-lg">
                        {prod.category}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-black text-[#502314] mb-1 group-hover:text-[#D62300] transition-colors">
                          {prod.nameAr}
                        </h3>
                        <p className="text-xs text-[#502314]/70 line-clamp-2 leading-relaxed mb-3">
                          {prod.description || "لحم بلدي فاخر محضر طازج يومياً مع إضافات الكابتن الخاصة"}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#502314]/10 flex items-center justify-between">
                        <div>
                          <span className="text-xl font-black text-[#D62300]">
                            {getProductPrice(prod)} <span className="text-xs">ج.م</span>
                          </span>
                          {prod.originalPrice && prod.originalPrice > prod.basePrice && (
                            <span className="text-xs text-[#502314]/40 line-through mr-2">
                              {prod.originalPrice} ج
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (prod.sizes || prod.modifiers) {
                              openCustomizeModal(prod);
                            } else {
                              addToCartDirect(prod);
                            }
                          }}
                          className="bg-[#D62300] hover:bg-[#502314] text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          <span>أضف للطلب</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Captain Rewards Promo Teaser Banner */}
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="bg-gradient-to-r from-[#502314] to-[#7A361E] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border-2 border-[#FFAE00]">
              <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#FFAE00]/10 rounded-full blur-2xl" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-right">
                  <div className="inline-flex items-center gap-2 bg-[#FFAE00] text-[#502314] font-black text-xs px-3 py-1 rounded-full mb-3 shadow-md">
                    <Award className="w-4 h-4" />
                    <span>برنامج الولاء - كابتن كوينز 👑</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2 text-[#FAF3E8]">
                    اجمع كوينز مع كل طلب واستبدلها بوجبات مجانية!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF3E8]/80 max-w-xl">
                    كل 100 جنيه بتطلبها بتديك 10 كابتن كوينز في حسابك تقدر تستبدلهم ببطاطس لودد، سندوتشات برجر مجانية، أو خصومات فورية داخل فروعنا.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("rewards");
                    playSound("click");
                  }}
                  className="bg-[#FFAE00] hover:bg-yellow-400 text-[#502314] font-black px-6 py-3.5 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-sm sm:text-base flex items-center gap-2 whitespace-nowrap"
                >
                  <QrCode className="w-5 h-5" />
                  <span>عرض كودي ومكافآتي</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MENU (المنيو 🍔) */}
      {/* ============================================================ */}
      {activeTab === "menu" && (
        <main className="max-w-7xl mx-auto px-4 py-6 animate-fadeIn">
          {/* Menu Header & Search Bar */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#502314] mb-2 flex items-center gap-2">
              <span>قائمة طعام كابتن برجر 🍔</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#502314]/70 mb-4">
              برجر لحم بلدي 100% طازج عالفحم، دجاج كرسبي سوبر مقرمش، صوصات غرقانة ولودد فرايز
            </p>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#502314]/50" />
              <input
                type="text"
                placeholder="ابحث عن الساندوتش المفضل لديك (مثال: جوسي لوسي، دبل سماش، كرسبي، لودد فرايز)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-[#502314]/15 rounded-2xl text-sm font-bold text-[#502314] focus:outline-none focus:border-[#D62300] shadow-sm transition-all placeholder:text-[#502314]/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xs bg-[#502314]/10 hover:bg-[#502314]/20 text-[#502314] px-2 py-1 rounded-md"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {CATEGORY_NAMES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  playSound("click");
                }}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat
                    ? "bg-[#D62300] text-white scale-105 shadow-md"
                    : "bg-white text-[#502314] hover:bg-[#FAF3E8] border border-[#502314]/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-[#D62300] animate-spin" />
              <span className="text-sm font-bold text-[#502314]/70">جاري تجهيز منيو الكابتن...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#502314]/20 my-8">
              <ChefHat className="w-12 h-12 text-[#502314]/30 mx-auto mb-3" />
              <h3 className="text-lg font-black text-[#502314] mb-1">لم يتم العثور على نتائج</h3>
              <p className="text-xs text-[#502314]/60">جرب البحث بكلمة أخرى أو اختر قسماً آخر من القائمة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border-2 border-[#502314]/10 hover:border-[#FFAE00] transition-all flex flex-col justify-between group"
                >
                  {/* Image container */}
                  <div className="relative h-44 bg-[#F5EBDC] overflow-hidden">
                    <img
                      src={prod.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"}
                      alt={prod.nameAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {prod.promoActive && (
                      <div className="absolute top-2 right-2 bg-[#D62300] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                        عرض توفير 🔥
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#502314] mb-1 group-hover:text-[#D62300] transition-colors">
                        {prod.nameAr}
                      </h3>
                      <h4 className="text-[11px] font-bold text-[#502314]/40 mb-2">
                        {prod.nameEn}
                      </h4>
                      <p className="text-xs text-[#502314]/70 line-clamp-2 leading-relaxed mb-4">
                        {prod.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-3 border-t border-[#502314]/10 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-[#D62300]">
                          {getProductPrice(prod)} <span className="text-xs font-bold">ج.م</span>
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.basePrice && (
                          <span className="text-xs text-[#502314]/40 line-through mr-1.5">
                            {prod.originalPrice} ج
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (prod.sizes || prod.modifiers) {
                            openCustomizeModal(prod);
                          } else {
                            addToCartDirect(prod);
                          }
                        }}
                        className="bg-[#D62300] hover:bg-[#502314] text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{prod.sizes ? "تخصيص" : "أضف"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ============================================================ */}
      {/* TAB 3: OFFERS & COUPONS (العروض 🔥) */}
      {/* ============================================================ */}
      {activeTab === "offers" && (
        <main className="max-w-7xl mx-auto px-4 py-6 animate-fadeIn">
          {/* Flash Deal Countdown Bar */}
          <div className="bg-[#D62300] text-white rounded-3xl p-5 mb-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center md:text-right">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <h2 className="text-xl font-black">عروض الفلاش الحصرية - وقت محدود!</h2>
                <p className="text-xs text-[#FAF3E8]/80">تنتهي العروض الحالية فور انتهاء العداد التنازلي:</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#502314] px-5 py-2.5 rounded-2xl shadow-inner font-mono text-xl sm:text-2xl font-black text-[#FFAE00]">
              <Clock className="w-5 h-5 text-white mr-1" />
              <span>{formatFlashTime(flashSeconds)}</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-[#502314] mb-4 flex items-center gap-2">
            <span>كوبونات وخصومات الكابتن 🎫</span>
          </h2>

          {/* Interactive Coupon Tickets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
            {[
              {
                code: "CAPTAIN20",
                title: "خصم 20% على طلبك 🍔",
                desc: "خصم فوري 20% على إجمالي الفاتورة للطلبات فوق 250 جنيه.",
                badge: "كوبون المشتركين",
                color: "#D62300",
              },
              {
                code: "FREEFRIES",
                title: "بطاطس شيدر هدية 🍟",
                desc: "باكيت لودد فرايز غرقان صوص شيدر مجاناً عند طلب أي 2 برجر دبل.",
                badge: "الأكثر استخداماً",
                color: "#FFAE00",
              },
              {
                code: "DUODEAL",
                title: "كومبو الصحاب التوفيري 👥",
                desc: "2 ساندوتش برجر كلاسيك سنجل + بطاطس + 2 كانز بيبسي بـ 199 ج فقط بدلاً من 270 ج.",
                badge: "عرض التوفير",
                color: "#502314",
              },
              {
                code: "MONSTERBOX",
                title: "بوكس العيلة العملاق 👑",
                desc: "وفر 120 جنيه كاملة على كابتن بوكس العائلي مع 4 برجر وفرايز وبيبسي.",
                badge: "عرض الجمعة واللمة",
                color: "#D62300",
              },
            ].map((coupon, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 shadow-md border-2 border-dashed border-[#502314]/20 flex flex-col justify-between relative overflow-hidden group hover:border-[#D62300] transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#F5EBDC] text-[#502314] px-2.5 py-1 rounded-full">
                      {coupon.badge}
                    </span>
                    <h3 className="text-lg font-black text-[#502314] mt-2">{coupon.title}</h3>
                    <p className="text-xs text-[#502314]/70 leading-relaxed mt-1">{coupon.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F5EBDC] flex items-center justify-center text-xl shrink-0">
                    🎟️
                  </div>
                </div>

                <div className="pt-4 border-t border-[#502314]/10 flex items-center justify-between gap-3">
                  <div className="bg-[#F5EBDC] px-3.5 py-1.5 rounded-xl border border-[#502314]/20 font-mono font-black text-sm text-[#502314]">
                    {coupon.code}
                  </div>

                  <button
                    onClick={() => {
                      applyCoupon(coupon.code);
                      setCartOpen(true);
                    }}
                    className="bg-[#D62300] hover:bg-[#502314] text-white font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>تطبيق في السلة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Flash Promo Menu Items */}
          <h2 className="text-xl font-black text-[#502314] mb-4 flex items-center gap-2">
            <span>عروض التوفير الأسبوعية المتاحة الآن 🔥</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.category.includes("عروض") || p.category.includes("كومبو") || p.promoActive)
              .map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#D62300]/20 hover:border-[#D62300] transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-[#F5EBDC]">
                    <img
                      src={prod.image || "https://images.unsplash.com/photo-1610614819513-58e34989848b?w=600"}
                      alt={prod.nameAr}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-[#D62300] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-md">
                      خصم حصري 🔥
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-base text-[#502314] mb-1">{prod.nameAr}</h3>
                      <p className="text-xs text-[#502314]/70 line-clamp-2 mb-3">{prod.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#502314]/10 flex items-center justify-between">
                      <span className="text-xl font-black text-[#D62300]">
                        {getProductPrice(prod)} ج.م
                      </span>
                      <button
                        onClick={() => addToCartDirect(prod)}
                        className="bg-[#D62300] hover:bg-[#502314] text-white font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>اطلب العرض</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>
      )}

      {/* ============================================================ */}
      {/* TAB 4: REWARDS & MY IN-STORE CODE (المكافآت 👑) */}
      {/* ============================================================ */}
      {activeTab === "rewards" && (
        <main className="max-w-4xl mx-auto px-4 py-6 animate-fadeIn">
          {/* Member Profile Header */}
          <div className="bg-[#502314] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#FFAE00] mb-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-right">
                <span className="bg-[#FFAE00] text-[#502314] text-xs font-black px-3 py-1 rounded-full inline-block mb-2 shadow-sm">
                  عضو كابتن مميز 👑
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#FAF3E8]">
                  كابتن كوينز (Captain Coins)
                </h1>
                <p className="text-xs sm:text-sm text-[#FAF3E8]/70 mt-1">
                  رقم العضوية: <span className="font-mono text-[#FFAE00]">CPT-2026-984</span>
                </p>
              </div>

              {/* Coins Counter */}
              <div className="bg-[#FAF3E8] text-[#502314] px-6 py-4 rounded-2xl text-center shadow-lg border-2 border-[#FFAE00] min-w-[160px]">
                <span className="text-xs font-black block text-[#502314]/70">رصيدك الحالي</span>
                <span className="text-4xl font-black text-[#D62300]">150</span>
                <span className="text-xs font-bold block text-[#FFAE00]">كوين 🪙</span>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold text-[#FAF3E8]/80 mb-2">
                <span>المستوى الحالي: فضي 🥈</span>
                <span>باقي 50 كوين للوصول إلى الذهبي 🥇</span>
              </div>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                <div className="bg-[#FFAE00] h-full rounded-full transition-all duration-1000" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          {/* Simulated In-Store QR Code (My Code) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-[#502314]/15 mb-8 text-center">
            <div className="max-w-xs mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#D62300] bg-red-50 px-3 py-1 rounded-full mb-3">
                <QrCode className="w-4 h-4" />
                <span>امسح عند الكاشير بالفرع</span>
              </div>
              <h3 className="text-lg font-black text-[#502314] mb-2">كودي في المطعم (In-Store Code)</h3>
              <p className="text-xs text-[#502314]/70 mb-4 leading-relaxed">
                اظهر هذا الكود للكاشير عند الطلب في فروع الشيخ زايد أو 6 أكتوبر لاكتساب النقاط الفورية أو استخدام الخصم.
              </p>

              {/* QR Image Box */}
              <div className="bg-[#F5EBDC] p-4 rounded-2xl border-2 border-[#502314]/20 inline-block mb-3 shadow-inner">
                <img
                  src="/captain-apk-qr.png"
                  alt="My In-Store Member Code"
                  className="w-44 h-44 object-contain rounded-xl mx-auto"
                />
              </div>

              <div className="font-mono text-base font-black tracking-widest text-[#502314] bg-[#F5EBDC] py-1.5 px-4 rounded-xl border border-[#502314]/20 inline-block">
                CPT-7729-BRGR
              </div>
            </div>
          </div>

          {/* Redeemable Rewards Catalog */}
          <div>
            <h2 className="text-xl font-black text-[#502314] mb-4 flex items-center gap-2">
              <span>استبدال النقاط بمكافآت مجانية 🎁</span>
            </h2>

            <div className="space-y-3">
              {[
                { coins: 50, item: "كوب صوص شيدر سايح أو رانش مجاناً", unlocked: true },
                { coins: 100, item: "باكيت بطاطس كابتن كرسبي مقلية عائلية", unlocked: true },
                { coins: 200, item: "ساندوتش كابتن كلاسيك بيف سنجل مجاناً", unlocked: false },
                { coins: 350, item: "وجبة جوسي لوسي دبل بركان جبنة كومبو كاملة", unlocked: false },
                { coins: 500, item: "كابتن بوكس العائلي مجاناً بالكامل 👑", unlocked: false },
              ].map((reward, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                    reward.unlocked
                      ? "bg-white border-[#502314]/15 shadow-sm"
                      : "bg-[#F5EBDC]/50 border-dashed border-[#502314]/20 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                        reward.unlocked
                          ? "bg-[#FFAE00] text-[#502314]"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {reward.coins}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#502314]">{reward.item}</h4>
                      <span className="text-[11px] text-[#502314]/60">
                        {reward.unlocked ? "متاح للاستبدال الفوري" : `متبقي ${reward.coins - 150} كوين`}
                      </span>
                    </div>
                  </div>

                  {reward.unlocked ? (
                    <button
                      onClick={() => {
                        alert(`تم تفعيل مكافأة: ${reward.item}! يرجى إضافتها في ملاحظات الطلب.`);
                        playSound("cash");
                      }}
                      className="bg-[#D62300] hover:bg-red-700 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-md"
                    >
                      استبدل الآن
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
                      مغلق 🔒
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* 3. FLOATING CART PILL (Pinned directly above the 4-Bottom-Tab Nav) */}
      {cart.length > 0 && (
        <div className="fixed bottom-[74px] left-0 right-0 z-40 px-4 max-w-lg mx-auto animate-bounce-short">
          <button
            onClick={() => {
              setCartOpen(true);
              playSound("click");
            }}
            className="w-full bg-[#D62300] hover:bg-[#502314] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-[#FFAE00] transition-all transform hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="relative bg-[#502314] p-2 rounded-xl text-[#FFAE00]">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-[#FFAE00] text-[#502314] font-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartTotalQty}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-yellow-200 block">سلة طلبات الكابتن</span>
                <span className="text-sm font-black text-white">عرض السلة وإتمام الطلب</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-[#FFAE00]">
                {cartTotal} <span className="text-xs font-bold text-white">ج.م</span>
              </span>
              <ChevronLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* 4. BURGER KING 4-BOTTOM-TAB FIXED NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5EBDC] border-t-2 border-[#502314]/15 shadow-2xl py-2 px-3">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* Tab 1: Home */}
          <button
            onClick={() => {
              setActiveTab("home");
              playSound("click");
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "home"
                ? "text-[#D62300] font-black scale-105"
                : "text-[#502314]/70 hover:text-[#502314] font-bold"
            }`}
          >
            <span className="text-xl mb-0.5">🏠</span>
            <span className="text-[11px]">الرئيسية</span>
            {activeTab === "home" && <div className="w-1.5 h-1.5 bg-[#D62300] rounded-full mt-0.5" />}
          </button>

          {/* Tab 2: Menu */}
          <button
            onClick={() => {
              setActiveTab("menu");
              playSound("click");
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "menu"
                ? "text-[#D62300] font-black scale-105"
                : "text-[#502314]/70 hover:text-[#502314] font-bold"
            }`}
          >
            <span className="text-xl mb-0.5">🍔</span>
            <span className="text-[11px]">المنيو</span>
            {activeTab === "menu" && <div className="w-1.5 h-1.5 bg-[#D62300] rounded-full mt-0.5" />}
          </button>

          {/* Tab 3: Offers */}
          <button
            onClick={() => {
              setActiveTab("offers");
              playSound("click");
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "offers"
                ? "text-[#D62300] font-black scale-105"
                : "text-[#502314]/70 hover:text-[#502314] font-bold"
            }`}
          >
            <span className="text-xl mb-0.5">🔥</span>
            <span className="text-[11px]">العروض</span>
            {activeTab === "offers" && <div className="w-1.5 h-1.5 bg-[#D62300] rounded-full mt-0.5" />}
          </button>

          {/* Tab 4: Rewards */}
          <button
            onClick={() => {
              setActiveTab("rewards");
              playSound("click");
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "rewards"
                ? "text-[#D62300] font-black scale-105"
                : "text-[#502314]/70 hover:text-[#502314] font-bold"
            }`}
          >
            <span className="text-xl mb-0.5">👑</span>
            <span className="text-[11px]">المكافآت</span>
            {activeTab === "rewards" && <div className="w-1.5 h-1.5 bg-[#D62300] rounded-full mt-0.5" />}
          </button>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* 5. MODAL: PRODUCT CUSTOMIZATION (Sizes & Extras) */}
      {/* ============================================================ */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F5EBDC] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-[#FFAE00] flex flex-col">
            {/* Header */}
            <div className="relative h-44 bg-[#502314] overflow-hidden">
              <img
                src={customizingProduct.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"}
                alt={customizingProduct.nameAr}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setCustomizingProduct(null)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1">
              <h3 className="text-xl font-black text-[#502314] mb-1">
                {customizingProduct.nameAr}
              </h3>
              <p className="text-xs text-[#502314]/70 mb-4 leading-relaxed">
                {customizingProduct.description}
              </p>

              {/* Sizes Selection */}
              {customizingProduct.sizes && (
                <div className="mb-5">
                  <span className="text-xs font-black uppercase text-[#D62300] block mb-2">
                    اختر الحجم والوزن 🥩
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {JSON.parse(customizingProduct.sizes).map((sz: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(sz)}
                        className={`p-3 rounded-2xl text-right border-2 font-black text-xs transition-all ${
                          selectedSize?.nameAr === sz.nameAr
                            ? "bg-[#D62300] text-white border-[#D62300] shadow-md"
                            : "bg-white text-[#502314] border-[#502314]/15 hover:bg-[#FAF3E8]"
                        }`}
                      >
                        <div className="font-black">{sz.nameAr}</div>
                        <div className="text-[11px] opacity-80">
                          {sz.price > 0 ? `+${sz.price} جنيه` : "السعر الأساسي"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Addons */}
              <div className="mb-5">
                <span className="text-xs font-black uppercase text-[#D62300] block mb-2">
                  إضافات وصوصات الكابتن 🧀
                </span>
                <div className="space-y-2">
                  {EXTRA_OPTIONS.map((extra, idx) => {
                    const isChecked = selectedExtras.includes(extra.nameAr);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedExtras(selectedExtras.filter((e) => e !== extra.nameAr));
                          } else {
                            setSelectedExtras([...selectedExtras, extra.nameAr]);
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                          isChecked
                            ? "bg-[#FAF3E8] border-[#D62300] text-[#D62300]"
                            : "bg-white border-[#502314]/10 text-[#502314]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked ? "bg-[#D62300] border-[#D62300] text-white" : "border-gray-400"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{extra.nameAr}</span>
                        </div>
                        <span>+{extra.price} ج</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Note */}
              <div className="mb-4">
                <label className="text-xs font-black text-[#502314] block mb-1">
                  ملاحظات خاصة بالساندوتش (بدون بصل، مايونيز زيادة...)
                </label>
                <input
                  type="text"
                  placeholder="اكتب ملاحظاتك للشيف..."
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#502314]/20 rounded-xl text-xs font-bold focus:outline-none focus:border-[#D62300]"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={addCustomizedToCart}
                className="w-full bg-[#D62300] hover:bg-[#502314] text-white font-black py-3.5 rounded-2xl shadow-xl transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة إلى السلة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. DRAWER: CART & COMPLETE ORDER CHECKOUT */}
      {/* ============================================================ */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="bg-[#FAF3E8] w-full max-w-md h-full flex flex-col shadow-2xl border-l-4 border-[#FFAE00] animate-slideInRight">
            {/* Drawer Header */}
            <div className="bg-[#502314] text-[#FAF3E8] p-4 flex items-center justify-between border-b-2 border-[#FFAE00]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#FFAE00]" />
                <h3 className="font-black text-base">سلة طلبات كابتن برجر</h3>
                <span className="text-xs bg-[#FFAE00] text-[#502314] font-black px-2 py-0.5 rounded-full">
                  {cartTotalQty}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-12 h-12 text-[#502314]/20 mx-auto mb-3" />
                  <h4 className="font-black text-base text-[#502314]">السلة فارغة حالياً</h4>
                  <p className="text-xs text-[#502314]/60 mt-1">تصفح المنيو واختر وجبتك المفضلة!</p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-2xl border border-[#502314]/10 shadow-sm flex items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <h4 className="font-black text-sm text-[#502314]">{item.product.nameAr}</h4>
                          {item.selectedOption && (
                            <p className="text-[11px] text-[#502314]/60">{item.selectedOption}</p>
                          )}
                          {item.extras.length > 0 && (
                            <p className="text-[10px] text-[#D62300] font-bold">
                              +{item.extras.join(", ")}
                            </p>
                          )}
                          <span className="text-xs font-black text-[#D62300] mt-1 block">
                            {item.unitPrice * item.qty} ج.م
                          </span>
                        </div>

                        {/* Qty Controls */}
                        <div className="flex items-center gap-2 bg-[#F5EBDC] px-2 py-1 rounded-xl border border-[#502314]/15">
                          <button
                            onClick={() => updateItemQty(idx, -1)}
                            className="w-6 h-6 rounded-lg bg-white text-[#502314] flex items-center justify-center shadow-xs hover:bg-red-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-black text-xs text-[#502314] min-w-[16px] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateItemQty(idx, 1)}
                            className="w-6 h-6 rounded-lg bg-[#D62300] text-white flex items-center justify-center shadow-xs hover:bg-red-700"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Input */}
                  <div className="bg-white p-3 rounded-2xl border border-[#502314]/10">
                    <span className="text-xs font-black text-[#502314] block mb-2">
                      لديك كود خصم أو كوبون؟ 🎟️
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أدخل الكوبون (مثال: CAPTAIN20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 p-2 bg-[#F5EBDC] border border-[#502314]/15 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#D62300]"
                      />
                      <button
                        onClick={() => applyCoupon()}
                        className="bg-[#502314] text-[#FFAE00] font-black px-4 py-2 rounded-xl text-xs hover:bg-[#3D1A0F] transition-all"
                      >
                        تطبيق
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-[11px] font-bold text-green-700 mt-2 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>تم تطبيق الكوبون بنجاح: خصم {couponDiscount} ج</span>
                      </p>
                    )}
                  </div>

                  {/* Customer Checkout Form */}
                  <form onSubmit={handleCheckout} className="bg-white p-4 rounded-2xl border border-[#502314]/10 space-y-3">
                    <h4 className="font-black text-xs text-[#D62300] uppercase tracking-wider">
                      بيانات العميل والتوصيل 🛵
                    </h4>

                    <div>
                      <label className="text-[11px] font-black text-[#502314] block mb-1">
                        الاسم بالكامل *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: أحمد محمود"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-2.5 bg-[#F5EBDC] border border-[#502314]/15 rounded-xl text-xs font-bold focus:outline-none focus:border-[#D62300]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-[#502314] block mb-1">
                        رقم الهاتف / واتساب *
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        placeholder="01xxxxxxxxx"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2.5 bg-[#F5EBDC] border border-[#502314]/15 rounded-xl text-xs font-bold text-right focus:outline-none focus:border-[#D62300]"
                      />
                    </div>

                    {orderType === "delivery" && (
                      <>
                        <div>
                          <label className="text-[11px] font-black text-[#502314] block mb-1">
                            منطقة التوصيل (زايد وأكتوبر) *
                          </label>
                          <select
                            value={selectedZone.code}
                            onChange={(e) => {
                              const found = ALL_DELIVERY_ZONES.find((z) => z.code === e.target.value);
                              if (found) setSelectedZone(found);
                            }}
                            className="w-full p-2.5 bg-[#F5EBDC] border border-[#502314]/15 rounded-xl text-xs font-bold text-[#502314] focus:outline-none focus:border-[#D62300]"
                          >
                            {ALL_DELIVERY_ZONES.map((z) => (
                              <option key={z.code} value={z.code}>
                                {z.nameAr} ({z.fee} ج - {z.timeMinutes} دقيقة)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-black text-[#502314] block mb-1">
                            العنوان بالتفصيل (عمارة، شقة، علامة مميزة) *
                          </label>
                          <textarea
                            required
                            rows={2}
                            placeholder="اكتب العنوان بالتفصيل..."
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full p-2 bg-[#F5EBDC] border border-[#502314]/15 rounded-xl text-xs font-bold focus:outline-none focus:border-[#D62300]"
                          />
                        </div>
                      </>
                    )}

                    {orderType === "dine_in" && (
                      <div>
                        <label className="text-[11px] font-black text-[#502314] block mb-1">
                          رقم الطاولة في الصالة *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: طاولة 5"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full p-2 bg-[#F5EBDC] border border-[#502314]/15 rounded-xl text-xs font-bold focus:outline-none focus:border-[#D62300]"
                        />
                      </div>
                    )}

                    {/* Payment Method */}
                    <div>
                      <label className="text-[11px] font-black text-[#502314] block mb-1">
                        طريقة الدفع المفضلة 💳
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "cash", label: "كاش عند الاستلام" },
                          { id: "card", label: "فيزا / ماستركارد" },
                          { id: "vodafone_cash", label: "فودافون كاش" },
                          { id: "instapay", label: "إنستاباي InstaPay" },
                        ].map((m) => (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => setPaymentMethod(m.id as any)}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                              paymentMethod === m.id
                                ? "bg-[#D62300] text-white border-[#D62300]"
                                : "bg-[#F5EBDC] text-[#502314] border-[#502314]/15"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="text-[11px] font-black text-[#502314] block mb-1">
                        ملاحظات إضافية للطلب
                      </label>
                      <input
                        type="text"
                        placeholder="أي تفاصيل أخرى..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full p-2 bg-[#F5EBDC] border border-[#502314]/15 rounded-xl text-xs font-bold focus:outline-none focus:border-[#D62300]"
                      />
                    </div>

                    {/* Summary Totals */}
                    <div className="pt-3 border-t border-[#502314]/10 space-y-1 text-xs">
                      <div className="flex justify-between text-[#502314]/70">
                        <span>قيمة الساندوتشات:</span>
                        <span>{cartSubtotal} ج.م</span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-green-700 font-bold">
                          <span>خصم الكوبون:</span>
                          <span>-{couponDiscount} ج.م</span>
                        </div>
                      )}
                      {orderType === "delivery" && (
                        <div className="flex justify-between text-[#502314]/70">
                          <span>رسوم التوصيل ({selectedZone.nameEn}):</span>
                          <span>{deliveryFee} ج.م</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-black text-[#D62300] pt-2 border-t border-[#502314]/10">
                        <span>المجموع الإجمالي:</span>
                        <span>{cartTotal} ج.م</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#D62300] hover:bg-[#502314] text-white font-black py-3.5 rounded-2xl shadow-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>جاري تأكيد الطلب...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>تأكيد الطلب الآن ({cartTotal} ج)</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. MODAL: ORDER SUCCESS DIALOG */}
      {/* ============================================================ */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border-4 border-[#FFAE00] shadow-2xl">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-[#502314] mb-1">
              تم استلام طلبك بنجاح! 🍔🎉
            </h3>
            <p className="text-xs text-[#502314]/70 mb-4">
              شكراً لاختيارك كابتن برجر. شيفاتنا بدأت في تحضير برجر عالفحم حالاً!
            </p>

            <div className="bg-[#F5EBDC] p-4 rounded-2xl border border-[#502314]/15 mb-6 text-right space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-[#502314]/70">رقم الطلب:</span>
                <span className="font-mono font-black text-[#D62300]">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#502314]/70">إجمالي المبلغ:</span>
                <span className="font-black text-[#502314]">{orderSuccess.totalAmount} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#502314]/70">نوع الخدمة:</span>
                <span className="font-bold text-[#502314]">{orderSuccess.serviceType}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`/track/${orderSuccess.orderNumber}`}
                className="w-full bg-[#D62300] hover:bg-[#502314] text-white font-black py-3 rounded-2xl shadow-md text-xs sm:text-sm transition-all"
              >
                تتبع حالة الطلب بالثانية 🛵
              </Link>
              <button
                onClick={() => setOrderSuccess(null)}
                className="w-full bg-[#F5EBDC] hover:bg-[#EAE0D1] text-[#502314] font-bold py-2.5 rounded-2xl text-xs transition-colors"
              >
                العودة للمتجر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CUSTOMER ACCOUNT MODAL & CHAT WIDGET */}
      <CustomerAccountModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
      />
      <CustomerChatWidget />
    </div>
  );
}
