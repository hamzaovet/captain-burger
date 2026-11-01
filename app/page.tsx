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
  Bike, Store, Utensils, ChevronRight, ChevronLeft,
  Sparkles, Flame, Gift, ArrowLeft, ArrowRight,
  Award, QrCode, Ticket, Check, Star, AlertCircle
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
    subtitle: "4 ساندوتشات كابتن برجر لحم مشوي عالفحم ودجاج كرسبي + لودد فرايز عائلي بالشيدر والبيكون + 4 كانز بيبسي مثلج + صوصات الكابتن الخاصة.",
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

// Fallback Initial Products so menu never renders empty
const INITIAL_BURGER_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    nameAr: "كابتن كلاسيك بيف برجر",
    nameEn: "Classic Beef Burger",
    category: "برجر لحم بلدي فاخر",
    basePrice: 145,
    sizes: JSON.stringify([
      { nameAr: "سنجل (150 جم)", nameEn: "Single (150g)", price: 0 },
      { nameAr: "دبل (300 جم)", nameEn: "Double (300g)", price: 65 },
      { nameAr: "تريبل وحش (450 جم)", nameEn: "Triple (450g)", price: 120 },
    ]),
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    description: "شريحة لحم بلدي طازجة 150 جم مشوية على اللهب مع جبنة شيدر أمريكية، خس مقرمش، طماطم، وصوص الكابتن السري في خبز بريوش طري.",
    isAvailable: true,
  },
  {
    id: "prod-2",
    nameAr: "ساندوتش جوسي لوسي بيف (بركان جبنة)",
    nameEn: "Juicy Lucy Beef Burger",
    category: "برجر لحم بلدي فاخر",
    basePrice: 185,
    promoActive: true,
    promoPrice: 185,
    originalPrice: 215,
    sizes: JSON.stringify([
      { nameAr: "حجم قياسي (200 جم محشو)", nameEn: "Standard (200g)", price: 0 },
      { nameAr: "دبل بيست محشو (400 جم)", nameEn: "Double Beast (400g)", price: 85 },
    ]),
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
    description: "المفاجأة! قطعة لحم 200 جم محشوة ومحكمة الإغلاق بقلب من الجبن الشيدر والبيكون المدخن، تنفجر بالجبنة السايحة فور أول قضمة.",
    isAvailable: true,
  },
  {
    id: "prod-3",
    nameAr: "دبل كابتن سماش برجر",
    nameEn: "Double Captain Smash",
    category: "برجر لحم بلدي فاخر",
    basePrice: 210,
    originalPrice: 245,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
    description: "قطعتين لحم 300 جم سماش مقرمشين عالجريل مع دبل جبنة أمريكية سايحة وخيار مخلل وصوص البرجر الخاص.",
    isAvailable: true,
  },
  {
    id: "prod-4",
    nameAr: "ساندوتش كابتن فاير كرسبي تشيكن",
    nameEn: "Captain Fire Crispy Chicken",
    category: "برجر دجاج كرسبي",
    basePrice: 165,
    originalPrice: 190,
    promoActive: true,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
    description: "صدر دجاج كامل مقرمش ومتبل بخلطة كابتن الحارة مع صوص الرانش والمايونيز والجبنة الشيدر السايحة في خبز بريوش طازج.",
    isAvailable: true,
  },
  {
    id: "prod-5",
    nameAr: "كابتن بوكس العائلي العملاق (4 أفراد)",
    nameEn: "Captain Monster Family Box",
    category: "عروض وكومبو الكابتن",
    basePrice: 499,
    originalPrice: 620,
    promoActive: true,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80",
    description: "بوكس اللمة والصحاب الأقوى في مصر! 4 ساندوتشات كابتن برجر لحم وفراخ + بطاطس لودد عائلية + 4 بيبسي مثلج + صوصات الكابتن.",
    isAvailable: true,
  },
  {
    id: "prod-6",
    nameAr: "كومبو الصحاب التوفيري (2 برجر + فرايز + 2 بيبسي)",
    nameEn: "Friends Duo Deal Combo",
    category: "عروض وكومبو الكابتن",
    basePrice: 280,
    originalPrice: 350,
    promoActive: true,
    image: "https://images.unsplash.com/photo-1610614819513-58e34989848b?w=600&auto=format&fit=crop&q=80",
    description: "عرض التوفير الأقوى لشخصين: 2 ساندوتش برجر كلاسيك بيف + باكيت بطاطس كبير + 2 كانز بيبسي مثلج.",
    isAvailable: true,
  },
  {
    id: "prod-7",
    nameAr: "بطاطس لودد فرايز غرقانة شيدر وبيكون",
    nameEn: "Loaded Cheddar & Bacon Fries",
    category: "بطاطس ومقبلات",
    basePrice: 85,
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
    description: "بطاطس ذهبية مقرمشة غارقة في صوص الجبنة الشيدر الأمريكي الساخن مع قطع بيف بيكون مدخن وهالبينو.",
    isAvailable: true,
  },
  {
    id: "prod-8",
    nameAr: "أصابع جبنة موتزاريلا كرسبي (4 قطع)",
    nameEn: "Crispy Mozzarella Sticks",
    category: "بطاطس ومقبلات",
    basePrice: 70,
    image: "https://images.unsplash.com/photo-1548340742-b831a47face7?w=600&auto=format&fit=crop&q=80",
    description: "أصابع الموتزاريلا الذهبية المقرمشة تقدم مع صوص المارينارا أو الرانش.",
    isAvailable: true,
  },
  {
    id: "prod-9",
    nameAr: "ميلك شيك نوتيلا شوكولاتة مثلج",
    nameEn: "Nutella Chocolate Milkshake",
    category: "صوصات ومشروبات",
    basePrice: 65,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    description: "ميلك شيك كثيف غني بشوكولاتة النوتيلا والكريمة المخفوقة وصوص الشوكولاتة.",
    isAvailable: true,
  },
  {
    id: "prod-10",
    nameAr: "ميلك شيك لوتس كراميل مقرمش",
    nameEn: "Lotus Caramel Milkshake",
    category: "صوصات ومشروبات",
    basePrice: 70,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80",
    description: "ميلك شيك زبدة بسكويت Biscoff مع قطع بسكويت مقرمشة وصوص توفي كراميل.",
    isAvailable: true,
  },
];

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_BURGER_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Active Bottom Tab: "home" | "menu" | "offers" | "rewards"
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "offers" | "rewards">("home");

  // Hero carousel
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cart & Order State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<"delivery" | "takeaway" | "dine_in">("delivery");

  // Customer Account Modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);

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

  // Flash Deal Timer
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

  const nextHero = () => setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevHero = () => setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  // Smooth Scroll Helper
  function scrollToSection(sectionId: string, tabName: "home" | "menu" | "offers" | "rewards") {
    setActiveTab(tabName);
    playSound("click");
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Handle URL Hash navigation on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#menu-section") {
        setTimeout(() => scrollToSection("menu-section", "menu"), 200);
      } else if (hash === "#offers-section") {
        setTimeout(() => scrollToSection("offers-section", "offers"), 200);
      }
    }
  }, []);

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

  // Fetch Menu from API (tries /api/menu first, then /api/products)
  useEffect(() => {
    fetchMenu();
    loadCartFromStorage();
  }, []);

  async function fetchMenu() {
    try {
      const res = await fetch("/api/menu");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          return;
        }
      }
      // Fallback to /api/products
      const fallbackRes = await fetch("/api/products");
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData) && fallbackData.length > 0) {
          setProducts(fallbackData);
        }
      }
    } catch (err) {
      console.warn("Using initial burger products:", err);
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
    <div
      style={{
        backgroundColor: "#F5EBDC",
        color: "#502314",
        minHeight: "100vh",
        paddingBottom: "110px",
        fontFamily: "var(--font-cairo), 'Segoe UI', Tahoma, sans-serif",
        direction: "rtl",
      }}
    >
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div
        style={{
          backgroundColor: "#502314",
          color: "#FAF3E8",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: 700,
          borderBottom: "2px solid #FFAE00",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                backgroundColor: "#D62300",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 900,
                padding: "2px 8px",
                borderRadius: "100px",
              }}
            >
              HOT 🔥
            </span>
            <span>كابتن برجر - فروعنا في الشيخ زايد (الحي العاشر) و 6 أكتوبر (غرب سوميد / وصلة دهشور)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <a
              href="tel:01206002168"
              style={{ color: "#FFAE00", textDecoration: "none", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Phone size={14} />
              <span dir="ltr">01206002168</span>
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link
              href="/download"
              style={{
                backgroundColor: "#FFAE00",
                color: "#502314",
                fontWeight: 900,
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "8px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>حمّل الأبلكيشن</span>
              <span style={{ backgroundColor: "#502314", color: "#FFFFFF", fontSize: "10px", padding: "1px 4px", borderRadius: "4px" }}>APK</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN STOREFRONT CONTENT */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
        
        {/* SECTION 1: HERO PROMO CAROUSEL (Starts immediately, No awkward delivery bar) */}
        <section
          id="home-section"
          style={{
            position: "relative",
            borderRadius: "28px",
            overflow: "hidden",
            backgroundColor: "#502314",
            border: "4px solid #FFAE00",
            boxShadow: "0 16px 40px rgba(80, 35, 20, 0.2)",
            marginBottom: "32px",
            minHeight: "420px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Background Image with Gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${HERO_SLIDES[heroIndex].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "all 0.6s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to left, rgba(80, 35, 20, 0.95) 0%, rgba(80, 35, 20, 0.85) 50%, rgba(80, 35, 20, 0.4) 100%)",
              }}
            />
          </div>

          {/* Slide Text Content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "36px 32px",
              maxWidth: "600px",
              color: "#FFFFFF",
            }}
          >
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#D62300",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 900,
                padding: "4px 12px",
                borderRadius: "100px",
                marginBottom: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              {HERO_SLIDES[heroIndex].badge}
            </span>

            <h1
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: "#FFAE00",
                margin: "0 0 12px 0",
                lineHeight: 1.2,
              }}
            >
              {HERO_SLIDES[heroIndex].title}
            </h1>

            <p
              style={{
                fontSize: "15px",
                color: "#FAF3E8",
                lineHeight: 1.6,
                marginBottom: "20px",
                fontWeight: 600,
              }}
            >
              {HERO_SLIDES[heroIndex].subtitle}
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "24px" }}>
              <span style={{ fontSize: "36px", fontWeight: 900, color: "#FFAE00" }}>
                {HERO_SLIDES[heroIndex].price} <span style={{ fontSize: "16px" }}>جنيه</span>
              </span>
              <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", textDecoration: "line-through" }}>
                {HERO_SLIDES[heroIndex].originalPrice} جنيه
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => scrollToSection("menu-section", "menu")}
                style={{
                  backgroundColor: "#D62300",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: "15px",
                  padding: "12px 26px",
                  borderRadius: "16px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 6px 18px rgba(214, 35, 0, 0.4)",
                }}
              >
                <span>{HERO_SLIDES[heroIndex].cta}</span>
                <ArrowLeft size={18} />
              </button>

              <button
                onClick={() => scrollToSection("offers-section", "offers")}
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#FFAE00",
                  border: "1.5px solid #FFAE00",
                  fontWeight: 800,
                  fontSize: "14px",
                  padding: "12px 20px",
                  borderRadius: "16px",
                  cursor: "pointer",
                }}
              >
                كافة العروض 🔥
              </button>
            </div>
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={prevHero}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <ChevronRight size={24} />
          </button>

          <button
            onClick={nextHero}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Dots */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "8px",
              zIndex: 20,
            }}
          >
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                style={{
                  width: heroIndex === idx ? "28px" : "10px",
                  height: "10px",
                  borderRadius: "100px",
                  backgroundColor: heroIndex === idx ? "#FFAE00" : "rgba(255,255,255,0.4)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </section>

        {/* SECTION 2: QUICK CATEGORIES BAR */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#502314", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <span>تصفح الأقسام</span>
              <span style={{ fontSize: "12px", backgroundColor: "#FFAE00", color: "#502314", padding: "2px 8px", borderRadius: "100px", fontWeight: 800 }}>
                طازج يومياً
              </span>
            </h2>

            <button
              onClick={() => scrollToSection("menu-section", "menu")}
              style={{ background: "none", border: "none", color: "#D62300", fontWeight: 900, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <span>فتح المنيو بالكامل</span>
              <ChevronLeft size={16} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
            }}
          >
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
                  scrollToSection("menu-section", "menu");
                }}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "2px solid rgba(80, 35, 20, 0.1)",
                  borderRadius: "20px",
                  padding: "16px",
                  textAlign: "right",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(80, 35, 20, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "100px",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{item.icon}</div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 900, color: "#502314", margin: "0 0 2px 0" }}>
                    {item.name}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#7E6554", fontWeight: 600 }}>{item.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: THE FULL BURGER MENU GRID */}
        <section id="menu-section" style={{ marginBottom: "48px", paddingTop: "20px" }}>
          {/* Header & Search */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#502314", margin: "0 0 6px 0" }}>
              قائمة طعام كابتن برجر 🍔
            </h2>
            <p style={{ fontSize: "14px", color: "#7E6554", margin: "0 0 18px 0" }}>
              برجر لحم بلدي 100% طازج عالفحم، دجاج كرسبي سوبر مقرمش، لودد فرايز وصوصات خاصة
            </p>

            <div style={{ position: "relative" }}>
              <Search
                size={18}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#7E6554" }}
              />
              <input
                type="text"
                placeholder="ابحث عن وجبتك المفضلة (جوسي لوسي، دبل سماش، كرسبي تشيكن، لودد فرايز)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 48px 14px 16px",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid rgba(80, 35, 20, 0.15)",
                  borderRadius: "18px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#502314",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(80,35,20,0.1)",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    color: "#502314",
                    cursor: "pointer",
                  }}
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "12px",
              marginBottom: "24px",
            }}
          >
            {CATEGORY_NAMES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    playSound("click");
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "16px",
                    fontSize: "13px",
                    fontWeight: 900,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    border: active ? "2px solid #D62300" : "1.5px solid rgba(80, 35, 20, 0.15)",
                    backgroundColor: active ? "#D62300" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#502314",
                    boxShadow: active ? "0 4px 12px rgba(214, 35, 0, 0.25)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "2px solid rgba(80, 35, 20, 0.1)",
                  boxShadow: "0 6px 20px rgba(80, 35, 20, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ position: "relative", height: "190px", backgroundColor: "#F5EBDC" }}>
                  <img
                    src={prod.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"}
                    alt={prod.nameAr}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {prod.promoActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#D62300",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: 900,
                        padding: "3px 8px",
                        borderRadius: "100px",
                      }}
                    >
                      عرض توفير 🔥
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      backgroundColor: "rgba(80, 35, 20, 0.85)",
                      color: "#FFAE00",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    {prod.category}
                  </div>
                </div>

                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: 900, color: "#502314", margin: "0 0 2px 0" }}>
                      {prod.nameAr}
                    </h3>
                    <h4 style={{ fontSize: "11px", fontWeight: 700, color: "rgba(80,35,20,0.5)", margin: "0 0 8px 0" }}>
                      {prod.nameEn}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#7E6554", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                      {prod.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(80, 35, 20, 0.1)",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "19px", fontWeight: 900, color: "#D62300" }}>
                        {getProductPrice(prod)} <span style={{ fontSize: "12px" }}>ج.م</span>
                      </span>
                      {prod.originalPrice && prod.originalPrice > prod.basePrice && (
                        <span style={{ fontSize: "12px", color: "#A89485", textDecoration: "line-through", marginRight: "6px" }}>
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
                      style={{
                        backgroundColor: "#D62300",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "12px",
                        padding: "8px 14px",
                        fontSize: "12px",
                        fontWeight: 900,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        boxShadow: "0 4px 10px rgba(214, 35, 0, 0.25)",
                      }}
                    >
                      <Plus size={15} />
                      <span>{prod.sizes ? "تخصيص" : "أضف"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: COUPONS & SPECIAL OFFERS */}
        <section id="offers-section" style={{ marginBottom: "48px", paddingTop: "20px" }}>
          {/* Flash Deal Bar */}
          <div
            style={{
              backgroundColor: "#D62300",
              color: "#FFFFFF",
              borderRadius: "24px",
              padding: "20px 24px",
              boxShadow: "0 10px 30px rgba(214, 35, 0, 0.3)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                ⚡
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 4px 0" }}>عروض الفلاش الحصرية - وقت محدود!</h2>
                <p style={{ fontSize: "13px", opacity: 0.9, margin: 0 }}>تنتهي العروض فور انتهاء العداد التنازلي:</p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#502314",
                padding: "10px 20px",
                borderRadius: "16px",
                fontFamily: "monospace",
                fontSize: "24px",
                fontWeight: 900,
                color: "#FFAE00",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Clock size={20} color="#FFFFFF" />
              <span>{formatFlashTime(flashSeconds)}</span>
            </div>
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#502314", marginBottom: "16px" }}>
            كوبونات وخصومات الكابتن 🎫
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "18px",
              marginBottom: "36px",
            }}
          >
            {[
              {
                code: "CAPTAIN20",
                title: "خصم 20% على طلبك 🍔",
                desc: "خصم فوري 20% على إجمالي الفاتورة للطلبات فوق 250 جنيه.",
                badge: "كوبون المشتركين",
              },
              {
                code: "FREEFRIES",
                title: "بطاطس شيدر هدية 🍟",
                desc: "باكيت لودد فرايز غرقان صوص شيدر مجاناً عند طلب أي 2 برجر دبل.",
                badge: "الأكثر استخداماً",
              },
              {
                code: "DUODEAL",
                title: "كومبو الصحاب التوفيري 👥",
                desc: "2 ساندوتش برجر كلاسيك سنجل + بطاطس + 2 كانز بيبسي بـ 199 ج فقط بدلاً من 270 ج.",
                badge: "عرض التوفير",
              },
              {
                code: "MONSTERBOX",
                title: "بوكس العيلة العملاق 👑",
                desc: "وفر 120 جنيه كاملة على كابتن بوكس العائلي مع 4 برجر وفرايز وبيبسي.",
                badge: "عرض الجمعة واللمة",
              },
            ].map((coupon, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "20px",
                  border: "2px dashed rgba(80, 35, 20, 0.2)",
                  boxShadow: "0 6px 18px rgba(80, 35, 20, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 900,
                      backgroundColor: "#F5EBDC",
                      color: "#502314",
                      padding: "3px 8px",
                      borderRadius: "100px",
                      display: "inline-block",
                      marginBottom: "8px",
                    }}
                  >
                    {coupon.badge}
                  </span>
                  <h3 style={{ fontSize: "17px", fontWeight: 900, color: "#502314", margin: "0 0 4px 0" }}>
                    {coupon.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#7E6554", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                    {coupon.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(80, 35, 20, 0.1)",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#F5EBDC",
                      padding: "6px 12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(80,35,20,0.15)",
                      fontFamily: "monospace",
                      fontWeight: 900,
                      fontSize: "14px",
                      color: "#502314",
                    }}
                  >
                    {coupon.code}
                  </span>

                  <button
                    onClick={() => {
                      applyCoupon(coupon.code);
                      setCartOpen(true);
                    }}
                    style={{
                      backgroundColor: "#D62300",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "12px",
                      padding: "8px 16px",
                      fontSize: "12px",
                      fontWeight: 900,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 10px rgba(214, 35, 0, 0.25)",
                    }}
                  >
                    <Check size={14} />
                    <span>تطبيق في السلة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: LOYALTY REWARDS & MY CODE */}
        <section id="rewards-section" style={{ marginBottom: "48px", paddingTop: "20px" }}>
          <div
            style={{
              backgroundColor: "#502314",
              borderRadius: "28px",
              padding: "28px",
              color: "#FFFFFF",
              border: "4px solid #FFAE00",
              boxShadow: "0 16px 40px rgba(80, 35, 20, 0.2)",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              <div>
                <span
                  style={{
                    backgroundColor: "#FFAE00",
                    color: "#502314",
                    fontSize: "11px",
                    fontWeight: 900,
                    padding: "3px 10px",
                    borderRadius: "100px",
                    display: "inline-block",
                    marginBottom: "8px",
                  }}
                >
                  عضو كابتن مميز 👑
                </span>
                <h2 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 4px 0", color: "#FAF3E8" }}>
                  كابتن كوينز (Captain Coins)
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                  رقم العضوية: <span style={{ fontFamily: "monospace", color: "#FFAE00" }}>CPT-2026-984</span>
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#FAF3E8",
                  color: "#502314",
                  padding: "16px 24px",
                  borderRadius: "18px",
                  textAlign: "center",
                  border: "2px solid #FFAE00",
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 900, opacity: 0.7, display: "block" }}>رصيدك الحالي</span>
                <span style={{ fontSize: "36px", fontWeight: 900, color: "#D62300" }}>150</span>
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#FFAE00", display: "block" }}>كوين 🪙</span>
              </div>
            </div>

            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
                <span>المستوى الحالي: فضي 🥈</span>
                <span>باقي 50 كوين للوصول إلى الذهبي 🥇</span>
              </div>
              <div style={{ width: "100%", height: "10px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ width: "75%", height: "100%", backgroundColor: "#FFAE00", borderRadius: "100px" }} />
              </div>
            </div>
          </div>

          {/* In-Store Code Box */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "28px",
              border: "2px solid rgba(80, 35, 20, 0.12)",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(80, 35, 20, 0.05)",
            }}
          >
            <div style={{ maxWidth: "300px", margin: "0 auto" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#FEF2F2",
                  color: "#D62300",
                  fontSize: "12px",
                  fontWeight: 900,
                  padding: "4px 12px",
                  borderRadius: "100px",
                  marginBottom: "12px",
                }}
              >
                <QrCode size={14} />
                <span>امسح عند الكاشير بالفرع</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#502314", margin: "0 0 6px 0" }}>
                كودي داخل المطعم
              </h3>
              <p style={{ fontSize: "12px", color: "#7E6554", lineHeight: 1.5, marginBottom: "16px" }}>
                اظهر هذا الكود للكاشير في فروع زايد أو أكتوبر لاكتساب النقاط الفورية أو استخدام الخصم.
              </p>

              <div
                style={{
                  backgroundColor: "#F5EBDC",
                  padding: "16px",
                  borderRadius: "20px",
                  display: "inline-block",
                  marginBottom: "12px",
                  border: "2px solid rgba(80,35,20,0.15)",
                }}
              >
                <img
                  src="/captain-apk-qr.png"
                  alt="In-store QR Code"
                  style={{ width: "160px", height: "160px", objectFit: "contain", display: "block" }}
                />
              </div>

              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#502314",
                  backgroundColor: "#F5EBDC",
                  padding: "6px 14px",
                  borderRadius: "10px",
                  letterSpacing: "1px",
                }}
              >
                CPT-7729-BRGR
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 3. FLOATING CART PILL */}
      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "74px",
            left: 0,
            right: 0,
            zIndex: 900,
            padding: "0 16px",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => {
              setCartOpen(true);
              playSound("click");
            }}
            style={{
              width: "100%",
              backgroundColor: "#D62300",
              color: "#FFFFFF",
              padding: "14px 20px",
              borderRadius: "20px",
              border: "3px solid #FFAE00",
              boxShadow: "0 10px 30px rgba(214, 35, 0, 0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "#502314",
                  padding: "8px",
                  borderRadius: "12px",
                  color: "#FFAE00",
                }}
              >
                <ShoppingCart size={20} />
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    backgroundColor: "#FFAE00",
                    color: "#502314",
                    fontSize: "11px",
                    fontWeight: 900,
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartTotalQty}
                </span>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#FED7AA", display: "block" }}>سلة كابتن برجر</span>
                <span style={{ fontSize: "14px", fontWeight: 900 }}>عرض السلة وإتمام الطلب</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#FFAE00" }}>
                {cartTotal} <span style={{ fontSize: "12px", color: "#FFFFFF" }}>ج.م</span>
              </span>
              <ChevronLeft size={18} />
            </div>
          </button>
        </div>
      )}

      {/* 4. BURGER KING 4-BOTTOM-TAB NAVIGATION */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#FAF3E8",
          borderTop: "2px solid rgba(80, 35, 20, 0.15)",
          boxShadow: "0 -4px 20px rgba(80, 35, 20, 0.08)",
          padding: "8px 12px",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "4px",
          }}
        >
          {[
            { id: "home", label: "الرئيسية", icon: "🏠", section: "home-section" },
            { id: "menu", label: "المنيو", icon: "🍔", section: "menu-section" },
            { id: "offers", label: "العروض", icon: "🔥", section: "offers-section" },
            { id: "rewards", label: "المكافآت", icon: "👑", section: "rewards-section" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.section, tab.id as any)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 2px",
                  borderRadius: "12px",
                  color: active ? "#D62300" : "rgba(80, 35, 20, 0.7)",
                  transform: active ? "scale(1.08)" : "scale(1)",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "20px", marginBottom: "2px" }}>{tab.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: active ? 900 : 700 }}>{tab.label}</span>
                {active && (
                  <div style={{ width: "6px", height: "6px", backgroundColor: "#D62300", borderRadius: "50%", marginTop: "3px" }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 5. PRODUCT CUSTOMIZATION MODAL */}
      {customizingProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            backgroundColor: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FAF3E8",
              borderRadius: "28px",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              border: "3px solid #FFAE00",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", height: "180px", backgroundColor: "#502314" }}>
              <img
                src={customizingProduct.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"}
                alt={customizingProduct.nameAr}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={() => setCustomizingProduct(null)}
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#502314", margin: "0 0 4px 0" }}>
                {customizingProduct.nameAr}
              </h3>
              <p style={{ fontSize: "13px", color: "#7E6554", lineHeight: 1.5, margin: "0 0 18px 0" }}>
                {customizingProduct.description}
              </p>

              {/* Sizes Selection */}
              {customizingProduct.sizes && (
                <div style={{ marginBottom: "18px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 900, color: "#D62300", display: "block", marginBottom: "8px" }}>
                    اختر الحجم والوزن 🥩
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {JSON.parse(customizingProduct.sizes).map((sz: any, idx: number) => {
                      const active = selectedSize?.nameAr === sz.nameAr;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedSize(sz)}
                          style={{
                            padding: "10px",
                            borderRadius: "14px",
                            textAlign: "right",
                            border: active ? "2px solid #D62300" : "1.5px solid rgba(80,35,20,0.15)",
                            backgroundColor: active ? "#D62300" : "#FFFFFF",
                            color: active ? "#FFFFFF" : "#502314",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ fontWeight: 900, fontSize: "13px" }}>{sz.nameAr}</div>
                          <div style={{ fontSize: "11px", opacity: 0.8 }}>
                            {sz.price > 0 ? `+${sz.price} جنيه` : "السعر الأساسي"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extras */}
              <div style={{ marginBottom: "18px" }}>
                <span style={{ fontSize: "12px", fontWeight: 900, color: "#D62300", display: "block", marginBottom: "8px" }}>
                  إضافات وصوصات الكابتن 🧀
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "12px",
                          border: isChecked ? "1.5px solid #D62300" : "1px solid rgba(80,35,20,0.12)",
                          backgroundColor: isChecked ? "#FAF3E8" : "#FFFFFF",
                          color: isChecked ? "#D62300" : "#502314",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "4px",
                              border: isChecked ? "2px solid #D62300" : "1.5px solid #7E6554",
                              backgroundColor: isChecked ? "#D62300" : "transparent",
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isChecked && <Check size={12} />}
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
              <div style={{ marginBottom: "18px" }}>
                <label style={{ fontSize: "12px", fontWeight: 900, color: "#502314", display: "block", marginBottom: "6px" }}>
                  ملاحظات للشيف (بدون بصل، مايونيز زيادة...)
                </label>
                <input
                  type="text"
                  placeholder="اكتب ملاحظاتك..."
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid rgba(80,35,20,0.15)",
                    borderRadius: "12px",
                    fontSize: "13px",
                    color: "#502314",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                onClick={addCustomizedToCart}
                style={{
                  width: "100%",
                  backgroundColor: "#D62300",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "16px",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: 900,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 6px 18px rgba(214, 35, 0, 0.35)",
                }}
              >
                <Plus size={18} />
                <span>إضافة إلى السلة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CART DRAWER & CHECKOUT (Service Mode is here where it belongs!) */}
      {cartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              backgroundColor: "#FAF3E8",
              width: "100%",
              maxWidth: "450px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 0 40px rgba(0,0,0,0.3)",
              borderLeft: "3px solid #FFAE00",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#502314",
                color: "#FAF3E8",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "2px solid #FFAE00",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingCart size={20} color="#FFAE00" />
                <h3 style={{ fontSize: "16px", fontWeight: 900, margin: 0 }}>سلة طلبات كابتن برجر</h3>
                <span
                  style={{
                    backgroundColor: "#FFAE00",
                    color: "#502314",
                    fontSize: "11px",
                    fontWeight: 900,
                    padding: "2px 8px",
                    borderRadius: "100px",
                  }}
                >
                  {cartTotalQty}
                </span>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 10px" }}>
                  <ShoppingCart size={48} color="rgba(80,35,20,0.2)" />
                  <h4 style={{ fontSize: "16px", fontWeight: 900, color: "#502314", marginTop: "12px" }}>
                    السلة فارغة حالياً
                  </h4>
                  <p style={{ fontSize: "12px", color: "#7E6554" }}>تصفح المنيو واختر وجبتك المفضلة!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  
                  {/* Service Mode Selector IN CART */}
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      padding: "6px",
                      border: "1.5px solid rgba(80, 35, 20, 0.12)",
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    {[
                      { id: "delivery", label: "دليفري", icon: <Bike size={16} /> },
                      { id: "takeaway", label: "تيك أواي", icon: <Store size={16} /> },
                      { id: "dine_in", label: "صالة", icon: <Utensils size={16} /> },
                    ].map((m) => {
                      const active = orderType === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setOrderType(m.id as any);
                            playSound("click");
                          }}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "10px 4px",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: 900,
                            cursor: "pointer",
                            border: "none",
                            backgroundColor: active ? "#D62300" : "transparent",
                            color: active ? "#FFFFFF" : "#502314",
                            transition: "all 0.2s",
                          }}
                        >
                          {m.icon}
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Items List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "18px",
                          padding: "14px",
                          border: "1.5px solid rgba(80,35,20,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: "14px", fontWeight: 900, color: "#502314", margin: "0 0 2px 0" }}>
                            {item.product.nameAr}
                          </h4>
                          {item.selectedOption && (
                            <p style={{ fontSize: "11px", color: "#7E6554", margin: "0 0 2px 0" }}>{item.selectedOption}</p>
                          )}
                          {item.extras.length > 0 && (
                            <p style={{ fontSize: "11px", color: "#D62300", fontWeight: 700, margin: "0 0 4px 0" }}>
                              +{item.extras.join(", ")}
                            </p>
                          )}
                          <span style={{ fontSize: "13px", fontWeight: 900, color: "#D62300" }}>
                            {item.unitPrice * item.qty} ج.م
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#F5EBDC",
                            padding: "4px 8px",
                            borderRadius: "12px",
                          }}
                        >
                          <button
                            onClick={() => updateItemQty(idx, -1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "8px",
                              backgroundColor: "#FFFFFF",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: 900, fontSize: "13px", minWidth: "16px", textAlign: "center" }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateItemQty(idx, 1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "8px",
                              backgroundColor: "#D62300",
                              color: "#FFFFFF",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Box */}
                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "18px", padding: "14px", border: "1.5px solid rgba(80,35,20,0.1)" }}>
                    <span style={{ fontSize: "12px", fontWeight: 900, color: "#502314", display: "block", marginBottom: "8px" }}>
                      كود الخصم أو الكوبون 🎟️
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="أدخل الكوبون..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          backgroundColor: "#F5EBDC",
                          border: "1px solid rgba(80,35,20,0.15)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontFamily: "monospace",
                          fontWeight: 900,
                          textTransform: "uppercase",
                        }}
                      />
                      <button
                        onClick={() => applyCoupon()}
                        style={{
                          backgroundColor: "#502314",
                          color: "#FFAE00",
                          border: "none",
                          borderRadius: "12px",
                          padding: "10px 16px",
                          fontSize: "12px",
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        تطبيق
                      </button>
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <form
                    onSubmit={handleCheckout}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "18px",
                      padding: "16px",
                      border: "1.5px solid rgba(80,35,20,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 900, color: "#D62300", textTransform: "uppercase" }}>
                      بيانات العميل 👤
                    </span>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 900, color: "#502314", display: "block", marginBottom: "4px" }}>
                        الاسم بالكامل *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="اسم العميل..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        style={{ width: "100%", padding: "10px", backgroundColor: "#F5EBDC", border: "1px solid rgba(80,35,20,0.15)", borderRadius: "10px", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 900, color: "#502314", display: "block", marginBottom: "4px" }}>
                        رقم الهاتف / واتساب *
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        placeholder="01xxxxxxxxx"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        style={{ width: "100%", padding: "10px", backgroundColor: "#F5EBDC", border: "1px solid rgba(80,35,20,0.15)", borderRadius: "10px", fontSize: "13px", textAlign: "right", boxSizing: "border-box" }}
                      />
                    </div>

                    {orderType === "delivery" && (
                      <>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 900, color: "#502314", display: "block", marginBottom: "4px" }}>
                            منطقة التوصيل (زايد وأكتوبر) *
                          </label>
                          <select
                            value={selectedZone.code}
                            onChange={(e) => {
                              const found = ALL_DELIVERY_ZONES.find((z) => z.code === e.target.value);
                              if (found) setSelectedZone(found);
                            }}
                            style={{ width: "100%", padding: "10px", backgroundColor: "#F5EBDC", border: "1px solid rgba(80,35,20,0.15)", borderRadius: "10px", fontSize: "13px", color: "#502314", boxSizing: "border-box" }}
                          >
                            {ALL_DELIVERY_ZONES.map((z) => (
                              <option key={z.code} value={z.code}>
                                {z.nameAr} ({z.fee} ج - {z.timeMinutes} دقيقة)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 900, color: "#502314", display: "block", marginBottom: "4px" }}>
                            العنوان بالتفصيل *
                          </label>
                          <textarea
                            required
                            rows={2}
                            placeholder="العمارة، الشقة، علامة مميزة..."
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            style={{ width: "100%", padding: "10px", backgroundColor: "#F5EBDC", border: "1px solid rgba(80,35,20,0.15)", borderRadius: "10px", fontSize: "13px", boxSizing: "border-box" }}
                          />
                        </div>
                      </>
                    )}

                    {orderType === "dine_in" && (
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 900, color: "#502314", display: "block", marginBottom: "4px" }}>
                          رقم الطاولة في الصالة *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: طاولة 4"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          style={{ width: "100%", padding: "10px", backgroundColor: "#F5EBDC", border: "1px solid rgba(80,35,20,0.15)", borderRadius: "10px", fontSize: "13px", boxSizing: "border-box" }}
                        />
                      </div>
                    )}

                    {/* Summary */}
                    <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(80,35,20,0.1)", display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#7E6554" }}>
                        <span>قيمة الساندوتشات:</span>
                        <span>{cartSubtotal} ج.م</span>
                      </div>
                      {couponApplied && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "green", fontWeight: 700 }}>
                          <span>خصم الكوبون:</span>
                          <span>-{couponDiscount} ج.م</span>
                        </div>
                      )}
                      {orderType === "delivery" && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#7E6554" }}>
                          <span>رسوم التوصيل:</span>
                          <span>{deliveryFee} ج.م</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: 900, color: "#D62300", paddingTop: "6px", borderTop: "1px solid rgba(80,35,20,0.1)" }}>
                        <span>الإجمالي المطلوب:</span>
                        <span>{cartTotal} ج.م</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        backgroundColor: "#D62300",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "14px",
                        padding: "14px",
                        fontSize: "14px",
                        fontWeight: 900,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 4px 14px rgba(214, 35, 0, 0.35)",
                      }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>جاري تأكيد الطلب...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>تأكيد الطلب الآن ({cartTotal} ج)</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. ORDER SUCCESS MODAL */}
      {orderSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "28px",
              maxWidth: "420px",
              width: "100%",
              padding: "28px",
              textAlign: "center",
              border: "4px solid #FFAE00",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#DCFCE7",
                color: "#16A34A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#502314", margin: "0 0 6px 0" }}>
              تم استلام طلبك بنجاح! 🍔🎉
            </h3>
            <p style={{ fontSize: "13px", color: "#7E6554", margin: "0 0 20px 0" }}>
              شيفات كابتن برجر بدأت في تحضير برجر عالفحم حالاً!
            </p>

            <div
              style={{
                backgroundColor: "#F5EBDC",
                padding: "14px",
                borderRadius: "16px",
                marginBottom: "20px",
                fontSize: "13px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#7E6554", fontWeight: 700 }}>رقم الطلب:</span>
                <span style={{ fontWeight: 900, color: "#D62300", fontFamily: "monospace" }}>{orderSuccess.orderNumber}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#7E6554", fontWeight: 700 }}>الإجمالي:</span>
                <span style={{ fontWeight: 900, color: "#502314" }}>{orderSuccess.totalAmount} ج.م</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link
                href={`/track?order=${encodeURIComponent(orderSuccess.orderNumber)}`}
                style={{
                  backgroundColor: "#D62300",
                  color: "#FFFFFF",
                  padding: "12px",
                  borderRadius: "14px",
                  fontSize: "13px",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                تتبع حالة الطلب بالثانية 🛵
              </Link>

              <button
                onClick={() => setOrderSuccess(null)}
                style={{
                  backgroundColor: "#F5EBDC",
                  color: "#502314",
                  border: "none",
                  borderRadius: "14px",
                  padding: "10px",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CUSTOMER ACCOUNT & CHAT */}
      <CustomerAccountModal isOpen={customerModalOpen} onClose={() => setCustomerModalOpen(false)} />
      <CustomerChatWidget />
    </div>
  );
}
