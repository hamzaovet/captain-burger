import { PrismaClient } from "../lib/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import crypto from "crypto";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_5CGUoVg0xPBu@ep-floral-dew-b98j9jsw-pooler.c-7.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 30000,
});
const adapter = new PrismaPg(pool, { schema: "public" });
const prisma = new PrismaClient({ adapter });

function hashPassword(pass: string): string {
  return crypto.createHash("sha256").update(pass).digest("hex");
}

async function main() {
  console.log("🍔 Starting seed for كابتن برجر (Captain Burger)...");

  // 1. Settings
  await prisma.systemSettings.upsert({
    where: { id: "default" },
    update: {
      restaurantName: "كابتن برجر",
      phone: "01206002168",
      hotlines: "01206002168 | 01117776349 | 01018804888 | 01008847666",
      address: "الشيخ زايد (الحي العاشر) و 6 أكتوبر (غرب سوميد / وصلة دهشور)",
      whatsappOrdersEnabled: true,
      ownerWhatsapp: "01206002168",
      soundsEnabled: true,
      offersEnabled: true,
      specialOffers: JSON.stringify({
        enabled: true,
        bannerText: "عروض كابتن برجر الأسبوعية 🔥 | اطلب 2 ساندوتش بيف بـ 280 ج بدلاً من 340 ج مع بطاطس ولتر كولا!",
        activeDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        flashDeal: {
          title: "عرض الكابتن الصاعق ⚡",
          item: "ساندوتش كلاسيك بيف 150 جم مع بطاطس وصوص شيدر بـ 120 ج لفترة محدودة!",
        },
      }),
    },
    create: {
      id: "default",
      restaurantName: "كابتن برجر",
      phone: "01206002168",
      hotlines: "01206002168 | 01117776349 | 01018804888 | 01008847666",
      address: "الشيخ زايد (الحي العاشر) و 6 أكتوبر (غرب سوميد / وصلة دهشور)",
      whatsappOrdersEnabled: true,
      ownerWhatsapp: "01206002168",
      soundsEnabled: true,
      offersEnabled: true,
      deliveryZones: JSON.stringify([
        { name: "الشيخ زايد - الحي العاشر وجوار الفرع", fee: 15 },
        { name: "الشيخ زايد - الأحياء (1 إلى 9)", fee: 20 },
        { name: "الشيخ زايد - الكرمة والخمائل والياسمين", fee: 25 },
        { name: "الشيخ زايد - بيفرلي هيلز والثورة الخضراء", fee: 30 },
        { name: "6 أكتوبر - غرب سوميد وجوار الفرع الثاني", fee: 15 },
        { name: "6 أكتوبر - الحي المتميز ومحور 26 يوليو", fee: 20 },
        { name: "6 أكتوبر - الحصري ومحور الكفراوي", fee: 25 },
        { name: "6 أكتوبر - حدائق أكتوبر وهضبة الأهرام", fee: 35 },
      ]),
    },
  });
  console.log("✅ SystemSettings updated.");

  // 2. Users: Owner + 2 Demo Users
  // Owner: maestro / 123456789 / 157230
  await prisma.user.upsert({
    where: { username: "maestro" },
    update: {
      name: "المالك المايسترو (حمزة)",
      passwordHash: hashPassword("123456789"),
      pin: "157230",
      role: "owner",
      phone: "01206002168",
      department: "الإدارة العليا والتشغيل",
      isActive: true,
    },
    create: {
      name: "المالك المايسترو (حمزة)",
      username: "maestro",
      passwordHash: hashPassword("123456789"),
      pin: "157230",
      role: "owner",
      phone: "01206002168",
      department: "الإدارة العليا والتشغيل",
      isActive: true,
    },
  });

  // Demo Cashier: captain_cashier / 123456 / 123456
  await prisma.user.upsert({
    where: { username: "captain_cashier" },
    update: {
      name: "كاشير تجريبي (Demo Cashier)",
      passwordHash: hashPassword("123456"),
      pin: "123456",
      role: "cashier",
      phone: "01117776349",
      department: "المبيعات والصالة",
      isActive: true,
    },
    create: {
      name: "كاشير تجريبي (Demo Cashier)",
      username: "captain_cashier",
      passwordHash: hashPassword("123456"),
      pin: "123456",
      role: "cashier",
      phone: "01117776349",
      department: "المبيعات والصالة",
      isActive: true,
    },
  });

  // Demo Manager: captain_manager / 123456 / 123456
  await prisma.user.upsert({
    where: { username: "captain_manager" },
    update: {
      name: "مدير تجريبي (Demo Manager)",
      passwordHash: hashPassword("123456"),
      pin: "123456",
      role: "manager",
      phone: "01018804888",
      department: "إدارة الفروع والطلبات",
      isActive: true,
    },
    create: {
      name: "مدير تجريبي (Demo Manager)",
      username: "captain_manager",
      passwordHash: hashPassword("123456"),
      pin: "123456",
      role: "manager",
      phone: "01018804888",
      department: "إدارة الفروع والطلبات",
      isActive: true,
    },
  });
  console.log("✅ Users configured (maestro [owner], captain_cashier [demo], captain_manager [demo]).");

  // 3. Categories
  const categoriesData = [
    {
      nameAr: "برجر لحم بيف",
      nameEn: "Gourmet Beef Burgers",
      sortOrder: 1,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    },
    {
      nameAr: "برجر فراخ كريسبي",
      nameEn: "Crispy Chicken Burgers",
      sortOrder: 2,
      image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
    },
    {
      nameAr: "عروض الكابتن والكومبو",
      nameEn: "Captain Combos & Deals",
      sortOrder: 3,
      image: "https://images.unsplash.com/photo-1610614819513-58e34989848b?w=600&auto=format&fit=crop&q=80",
    },
    {
      nameAr: "بطاطس ومقبلات",
      nameEn: "Loaded Fries & Sides",
      sortOrder: 4,
      image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
    },
    {
      nameAr: "صوصات ومشروبات",
      nameEn: "Sauces & Drinks",
      sortOrder: 5,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    },
  ];

  await prisma.category.deleteMany({});
  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  console.log("✅ Categories seeded (5 burger categories).");

  // 4. Products
  const productsData = [
    // --- Category: برجر لحم بيف ---
    {
      nameAr: "ساندوتش كلاسيك بيف",
      nameEn: "Classic Beef Burger",
      category: "برجر لحم بيف",
      basePrice: 145,
      originalPrice: 170,
      promoPrice: 145,
      promoDays: "يومياً",
      promoActive: true,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "قطعة بيف صافي 150 جم مشوية عالجريل",
        "جبنة شيدر أمريكي ذائبة",
        "صوص كاتشب + صوص باربيكيو مدخن",
        "طماطم طازجة وخس مقرمش",
        "باكيت بطاطس فارم فريتس مقرمشة",
      ]),
      sizes: JSON.stringify([
        { nameAr: "سنجل (150 جم)", nameEn: "Single (150g)", price: 0 },
        { nameAr: "دبل (300 جم)", nameEn: "Double (300g)", price: 65 },
        { nameAr: "تريبل كابتن (450 جم)", nameEn: "Triple (450g)", price: 120 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إضافة صوص شيدر سايح", nameEn: "Melted Cheddar", price: 20 },
        { nameAr: "إضافة بيف بيكون مدخن", nameEn: "Beef Bacon", price: 30 },
        { nameAr: "إضافة هالبينو حار", nameEn: "Jalapeno", price: 15 },
        { nameAr: "إضافة أصابع موتزاريلا (2 ق)", nameEn: "2 Mozzarella Sticks", price: 35 },
      ]),
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      description: "قطعة بيف لحم بلدي 150 جم مشوية بلهب الجريل مع صوص الباربيكيو والشيدر والخس والطماطم، تُقدم مع باكيت بطاطس.",
      sortOrder: 1,
    },
    {
      nameAr: "ساندوتش جوسي لوسي بيف (محشي جبنة)",
      nameEn: "Juicy Lucy Beef Burger",
      category: "برجر لحم بيف",
      basePrice: 185,
      originalPrice: 215,
      promoPrice: 185,
      promoDays: "يومياً",
      promoActive: true,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "قطعة بيف 200 جم محشية جبنة ذائبة من الداخل",
        "شرائح بيف بيكون مقرمشة",
        "شيدر صوص وكاتشب وباربيكيو",
        "طماطم، خس، خيار مخلل",
        "باكيت بطاطس مقلية",
      ]),
      sizes: JSON.stringify([
        { nameAr: "حجم قياسي (200 جم محشي)", nameEn: "Standard (200g)", price: 0 },
        { nameAr: "حجم دبل عملاق (400 جم محشي)", nameEn: "Double Beast (400g)", price: 85 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إكسترا شيدر مدخن", nameEn: "Extra Smoked Cheddar", price: 20 },
        { nameAr: "إكسترا بيكون مدخن", nameEn: "Extra Beef Bacon", price: 30 },
        { nameAr: "إضافة صوص رانش", nameEn: "Ranch Sauce", price: 15 },
      ]),
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
      description: "الأسطورة! قطعة بيف 200 جم تنفجر بالجبنة الذائبة مع كل قضمة، مع شرائح بيف بيكون مدخن وصوص الباربيكيو الغني.",
      sortOrder: 2,
    },
    {
      nameAr: "ساندوتش رانش بيف",
      nameEn: "Ranch Stuffed Beef",
      category: "برجر لحم بيف",
      basePrice: 175,
      originalPrice: 200,
      promoPrice: 175,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "قطعة بيف 200 جم محشية جبنة جودة وموتزاريلا",
        "صوص كابتن رانش الغني بالأعشاب",
        "شيدر صوص، طماطم، خس فريش",
        "باكيت بطاطس ذهبية",
      ]),
      sizes: JSON.stringify([
        { nameAr: "حجم قياسي 200 جم", nameEn: "Standard (200g)", price: 0 },
        { nameAr: "حجم دبل 400 جم", nameEn: "Double (400g)", price: 80 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إضافة هالبينو", nameEn: "Jalapeno", price: 15 },
        { nameAr: "إضافة حلقات بصل", nameEn: "Onion Rings", price: 25 },
      ]),
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
      description: "بيف 200 جم محشي جبنة مع لمسة صوص الرانش المتبل الفاخر وجبنة شيدر وخضار طازج، يُقدم مع بطاطس.",
      sortOrder: 3,
    },
    {
      nameAr: "ساندوتش بيج تيستي بيف",
      nameEn: "Big Tasty Beef Burger",
      category: "برجر لحم بيف",
      basePrice: 180,
      originalPrice: 210,
      promoPrice: 180,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "قطعة بيف 200 جم محشية جبنة",
        "صوص بيج تيستي المدخن الأصلي",
        "شريحة شيدر عريضة، خس، طماطم",
        "باكيت بطاطس مقلية",
      ]),
      sizes: JSON.stringify([
        { nameAr: "سنجل تيستي 200 جم", nameEn: "Single Tasty", price: 0 },
        { nameAr: "دبل تيستي 400 جم", nameEn: "Double Tasty", price: 80 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إكسترا صوص تيستي", nameEn: "Extra Tasty Sauce", price: 15 },
        { nameAr: "إضافة بيكون", nameEn: "Beef Bacon", price: 30 },
      ]),
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80",
      description: "طعم التيستي الأسطوري المدخن مع برجر محشي جبنة وشيدر صوص وطماطم وخس، يقدم مع بطاطس.",
      sortOrder: 4,
    },
    {
      nameAr: "ساندوتش كابتن هلابينو سبايسي",
      nameEn: "Captain Jalapeno Fire Burger",
      category: "برجر لحم بيف",
      basePrice: 175,
      originalPrice: 200,
      promoPrice: 155,
      promoDays: "الثلاثاء والأربعاء والخميس",
      promoActive: true,
      isFlashDeal: true,
      trayComponents: JSON.stringify([
        "قطعة بيف 200 جم محشية جبنة ومتبلة بهارات حارة",
        "حلقات هلابينو مخلل مكسيكي حار",
        "صوص فاير سبايسي + صوص باربيكيو",
        "شيدر صوص، خس، طماطم",
        "باكيت بطاطس",
      ]),
      sizes: JSON.stringify([
        { nameAr: "سنجل فاير (200 جم)", nameEn: "Single Fire", price: 0 },
        { nameAr: "دبل فاير (400 جم)", nameEn: "Double Fire", price: 80 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إكسترا هلابينو", nameEn: "Extra Jalapeno", price: 15 },
        { nameAr: "إكسترا شيدر سايح", nameEn: "Extra Melted Cheddar", price: 20 },
      ]),
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80",
      description: "لعشاق السبايسي الحقيقي! بيف 200 جم محشي جبنة مع حلقات الهلابينو وصوص الفاير الناري والشيدر والباربيكيو.",
      sortOrder: 5,
    },
    {
      nameAr: "ساندوتش أوريجينال كابتن (مع موتزاريلا ستيكس)",
      nameEn: "Captain Original Stuffed + Mozzarella",
      category: "برجر لحم بيف",
      basePrice: 205,
      originalPrice: 240,
      promoPrice: 205,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "قطعة بيف 200 جم محشية جبنة",
        "2 أصابع موتزاريلا مقرمشة داخل الساندوتش",
        "شرائح بيف بيكون مقرمشة",
        "شيدر صوص، كاتشب، باربيكيو، خس، طماطم",
        "باكيت بطاطس",
      ]),
      sizes: JSON.stringify([
        { nameAr: "ساندوتش كابتن أوريجينال", nameEn: "Captain Original", price: 0 },
        { nameAr: "دبل كابتن أوريجينال", nameEn: "Double Original", price: 85 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إكسترا شيدر", nameEn: "Extra Cheddar", price: 20 },
        { nameAr: "إكسترا صوص رانش", nameEn: "Ranch Sauce", price: 15 },
      ]),
      image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80",
      description: "الساندوتش الكامل! بيف 200 جم محشي جبنة يعلوه أصابع الموتزاريلا الاستيكس المقرمشة مع البيكون وصوص الشيدر والباربيكيو.",
      sortOrder: 6,
    },

    // --- Category: برجر فراخ كريسبي ---
    {
      nameAr: "ساندوتش كابتن كريسبي تشيكن",
      nameEn: "Captain Crispy Chicken",
      category: "برجر فراخ كريسبي",
      basePrice: 135,
      originalPrice: 160,
      promoPrice: 135,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "صدور دجاج كريسبي مقرمشة بخلطة الكابتن السرية",
        "شريحة جبنة شيدر أمريكي ذائبة",
        "صوص كابتن مايونيز بالثوم والأعشاب",
        "خس مقرمش وطماطم",
        "باكيت بطاطس",
      ]),
      sizes: JSON.stringify([
        { nameAr: "حجم قياسي (سنجل صدر كامل)", nameEn: "Single Fillet", price: 0 },
        { nameAr: "حجم دبل (2 صدر كريسبي)", nameEn: "Double Fillet", price: 55 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إضافة صوص شيدر", nameEn: "Cheddar Sauce", price: 20 },
        { nameAr: "إضافة تركي مدخن", nameEn: "Smoked Turkey", price: 25 },
        { nameAr: "إضافة هلابينو سبايسي", nameEn: "Jalapeno", price: 15 },
      ]),
      image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
      description: "صدر دجاج كامل مقرمش ومتبل على طريقة كابتن برجر الخاصة مع الشيدر وصوص المايونيز والخس، يُقدم مع بطاطس.",
      sortOrder: 7,
    },
    {
      nameAr: "ساندوتش سموكي بيكون تشيكن",
      nameEn: "Smoky Bacon Crispy Chicken",
      category: "برجر فراخ كريسبي",
      basePrice: 165,
      originalPrice: 190,
      promoPrice: 165,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "صدر دجاج كريسبي مقرمش وذهبي",
        "شرائح بيف بيكون مقرمشة ومحمصة",
        "صوص باربيكيو مدخن + صوص شيدر كريمي",
        "خس طازج وطماطم",
        "باكيت بطاطس مقلية",
      ]),
      sizes: JSON.stringify([
        { nameAr: "سنجل بيكون", nameEn: "Single Bacon", price: 0 },
        { nameAr: "دبل بيكون", nameEn: "Double Bacon", price: 60 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إكسترا بيكون", nameEn: "Extra Bacon", price: 30 },
        { nameAr: "إكسترا شيدر", nameEn: "Extra Cheddar", price: 20 },
      ]),
      image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80",
      description: "دجاج كريسبي فائق القرمشة مع شرائح البيكون المدخن الغني وصوص الباربيكيو والشيدر، يقدم مع بطاطس.",
      sortOrder: 8,
    },
    {
      nameAr: "ساندوتش فاير تشيكن سبايسي",
      nameEn: "Fire Spicy Crispy Chicken",
      category: "برجر فراخ كريسبي",
      basePrice: 150,
      originalPrice: 175,
      promoPrice: 135,
      promoDays: "الثلاثاء والأربعاء والخميس",
      promoActive: true,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "دجاج كريسبي متبل بخلطة فاير الحارة",
        "حلقات هلابينو مكسيكي",
        "صوص سيراتشا مايو ناري",
        "شريحة شيدر وخس طازج",
        "باكيت بطاطس مقلية",
      ]),
      sizes: JSON.stringify([
        { nameAr: "سنجل فاير", nameEn: "Single Fire", price: 0 },
        { nameAr: "دبل فاير", nameEn: "Double Fire", price: 55 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إكسترا هلابينو", nameEn: "Extra Jalapeno", price: 15 },
        { nameAr: "إكسترا شيدر سايح", nameEn: "Extra Cheddar", price: 20 },
      ]),
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
      description: "عشاق الحار فقط! دجاج كريسبي سبايسي بصوص السيراتشا والمايونيز مع الهالبينو المكسيكي والشيدر، يقدم مع بطاطس.",
      sortOrder: 9,
    },

    // --- Category: عروض الكابتن والكومبو ---
    {
      nameAr: "كومبو الصحاب (2 ساندوتش + 2 بطاطس + 2 كولا)",
      nameEn: "Captain Duo Combo",
      category: "عروض الكابتن والكومبو",
      basePrice: 280,
      originalPrice: 340,
      promoPrice: 280,
      promoDays: "يومياً",
      promoActive: true,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "2 ساندوتش كلاسيك بيف 150 جم مشوي عالجريل",
        "2 باكيت بطاطس فارم فريتس مقرمشة",
        "2 صوص شيدر سايح",
        "2 كانز بيبسي أو سفن آب مثلج",
      ]),
      sizes: JSON.stringify([
        { nameAr: "كومبو الصحاب بيف", nameEn: "Duo Beef Combo", price: 0 },
        { nameAr: "كومبو ميكس (1 بيف + 1 كريسبي دجاج)", nameEn: "Mix (1 Beef + 1 Chicken)", price: 0 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "ترقية البطاطس إلى لودد تشيز فرايز", nameEn: "Upgrade to Loaded Fries", price: 35 },
        { nameAr: "إضافة 4 أصابع موتزاريلا", nameEn: "4 Mozzarella Sticks", price: 60 },
      ]),
      image: "https://images.unsplash.com/photo-1610614819513-58e34989848b?w=600&auto=format&fit=crop&q=80",
      description: "عرض التوفير الأقوى للصحاب! اختار 2 ساندوتش مع 2 بطاطس و2 كولا وصوص شيدر بسعر خاص جداً.",
      sortOrder: 10,
    },
    {
      nameAr: "بوكس العيلة العملاق (4 ساندوتشات + لودد فرايز عائلي + 4 كولا)",
      nameEn: "Captain Mega Family Box",
      category: "عروض الكابتن والكومبو",
      basePrice: 590,
      originalPrice: 720,
      promoPrice: 590,
      promoDays: "يومياً",
      promoActive: true,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "2 ساندوتش بيف (كلاسيك وجوسي لوسي)",
        "2 ساندوتش دجاج كريسبي ورانش",
        "طبق لودد تشيز فرايز عائلي كبير مع البيكون والصوصات",
        "4 عبوات صوص متنوعة (شيدر، رانش، باربيكيو، تيستي)",
        "4 كانز بيبسي مثلج",
      ]),
      sizes: JSON.stringify([
        { nameAr: "بوكس العيلة 4 ساندوتشات", nameEn: "Family Box (4 Sandwiches)", price: 0 },
        { nameAr: "بوكس اللمة الكبرى 6 ساندوتشات", nameEn: "Party Box (6 Sandwiches)", price: 260 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إضافة 6 حلقات بصل + 4 أصابع موتزاريلا", nameEn: "Appetizers Mix", price: 80 },
      ]),
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80",
      description: "لمة العيلة والصحاب متكملش إلا ببوكس الكابتن! 4 ساندوتشات فاخرة، طبق لودد فرايز عائلي غرقان شيدر وبيكون، 4 كولا و4 صوصات.",
      sortOrder: 11,
    },
    {
      nameAr: "وجبة التوفير السريعة (ساندوتش + بطاطس + كانز)",
      nameEn: "Daily Value Meal",
      category: "عروض الكابتن والكومبو",
      basePrice: 155,
      originalPrice: 185,
      promoPrice: 155,
      promoDays: "يومياً",
      promoActive: true,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "ساندوتش كلاسيك بيف أو كريسبي دجاج",
        "باكيت بطاطس مقلية ذهبية",
        "صوص شيدر",
        "كانز مشروب غازي",
      ]),
      sizes: JSON.stringify([
        { nameAr: "وجبة كلاسيك بيف", nameEn: "Classic Beef Meal", price: 0 },
        { nameAr: "وجبة كريسبي تشيكن", nameEn: "Crispy Chicken Meal", price: 0 },
      ]),
      image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=80",
      description: "الوجبة اليومية المثالية للغداء والعمل! ساندوتش برجر مشوي مع بطاطس ومشروب وصوص شيدر.",
      sortOrder: 12,
    },

    // --- Category: بطاطس ومقبلات ---
    {
      nameAr: "طبق لودد تشيز فرايز بالبيكون",
      nameEn: "Bacon Loaded Cheese Fries",
      category: "بطاطس ومقبلات",
      basePrice: 85,
      originalPrice: 105,
      promoPrice: 85,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "بطاطس فارم فريتس مقلية وذهبية",
        "صوص جبنة شيدر أمريكي ذائبة ساخنة",
        "قطع بيف بيكون مقرمشة ومحمصة",
        "رشة هالبينو وصوص باربيكيو مدخن",
      ]),
      sizes: JSON.stringify([
        { nameAr: "حجم وسط", nameEn: "Medium", price: 0 },
        { nameAr: "حجم كبير عائلي", nameEn: "Large Share", price: 35 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "إكسترا شيدر", nameEn: "Extra Cheddar", price: 20 },
        { nameAr: "إكسترا هالبينو", nameEn: "Extra Jalapeno", price: 15 },
      ]),
      image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
      description: "بطاطس مقرمشة مغطاة بطبقة غنية من الجبنة الشيدر السايحة وقطع البيكون المقرمش ورشة صوص الباربيكيو.",
      sortOrder: 13,
    },
    {
      nameAr: "أصابع موتزاريلا مقرمشة (4 قطع)",
      nameEn: "Crispy Mozzarella Sticks (4 pcs)",
      category: "بطاطس ومقبلات",
      basePrice: 70,
      originalPrice: 85,
      promoPrice: 70,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "4 أصابع موتزاريلا مقرمشة مطاطية",
        "عبوة صوص رانش بالأعشاب أو مارينارا",
      ]),
      sizes: JSON.stringify([
        { nameAr: "4 قطع", nameEn: "4 Pieces", price: 0 },
        { nameAr: "8 قطع عائلية", nameEn: "8 Pieces", price: 60 },
      ]),
      image: "https://images.unsplash.com/photo-1548340742-b831a47face7?w=600&auto=format&fit=crop&q=80",
      description: "أصابع الموتزاريلا الذهبية المقرمشة والجبنة المطاطية اللذيذة مع صوص الرانش المتبل.",
      sortOrder: 14,
    },
    {
      nameAr: "حلقات بصل مقرمشة (6 قطع)",
      nameEn: "Crispy Onion Rings (6 pcs)",
      category: "بطاطس ومقبلات",
      basePrice: 55,
      originalPrice: 70,
      promoPrice: 55,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "6 حلقات بصل ذهبية مقرمشة",
        "عبوة صوص باربيكيو مدخن",
      ]),
      sizes: JSON.stringify([
        { nameAr: "6 قطع", nameEn: "6 Pieces", price: 0 },
        { nameAr: "12 قطعة", nameEn: "12 Pieces", price: 45 },
      ]),
      image: "https://images.unsplash.com/photo-1639024471285-0af5085e64a0?w=600&auto=format&fit=crop&q=80",
      description: "حلقات بصل طازجة متبلة ومقلية لقرمشة مثالية مع صوص الباربيكيو.",
      sortOrder: 15,
    },
    {
      nameAr: "باكيت بطاطس فارم فريتس",
      nameEn: "French Fries Packet",
      category: "بطاطس ومقبلات",
      basePrice: 40,
      originalPrice: 50,
      promoPrice: 40,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      trayComponents: JSON.stringify([
        "بطاطس فارم فريتس مقلية مقرمشة وساخنة",
        "توابل كابتن برجر الخاصة",
      ]),
      sizes: JSON.stringify([
        { nameAr: "حجم وسط", nameEn: "Medium", price: 0 },
        { nameAr: "حجم لارج كبير", nameEn: "Large", price: 20 },
      ]),
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
      description: "أصابع البطاطس المقلية الذهبية المقرمشة بتوابل الكابتن اللذيذة.",
      sortOrder: 16,
    },

    // --- Category: صوصات ومشروبات ---
    {
      nameAr: "كوب صوص شيدر سايح ساخن",
      nameEn: "Melted Cheddar Cheese Cup",
      category: "صوصات ومشروبات",
      basePrice: 25,
      originalPrice: null,
      promoPrice: null,
      promoActive: false,
      isFlashDeal: false,
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
      description: "كوب صوص شيدر أمريكي ذائبة ساخنة وكريمية لتغميس الساندوتشات والبطاطس.",
      sortOrder: 17,
    },
    {
      nameAr: "كوب صوص كابتن رانش",
      nameEn: "Captain Ranch Sauce Cup",
      category: "صوصات ومشروبات",
      basePrice: 20,
      originalPrice: null,
      promoPrice: null,
      promoActive: false,
      isFlashDeal: false,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
      description: "صوص الرانش المتبل بالأعشاب والليمون الخاص بكابتن برجر.",
      sortOrder: 18,
    },
    {
      nameAr: "كوب صوص بيج تيستي مدخن",
      nameEn: "Big Tasty Sauce Cup",
      category: "صوصات ومشروبات",
      basePrice: 20,
      originalPrice: null,
      promoPrice: null,
      promoActive: false,
      isFlashDeal: false,
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
      description: "صوص البيج تيستي المدخن والمميز بالبصل المكرمل والتوابل.",
      sortOrder: 19,
    },
    {
      nameAr: "ميلك شيك شوكولاتة نوتيلا",
      nameEn: "Nutella Chocolate Milkshake",
      category: "صوصات ومشروبات",
      basePrice: 65,
      originalPrice: 80,
      promoPrice: 65,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
      description: "ميلك شيك آيس كريم شوكولاتة غني بالنوتيلا والكريمة المخفوقة.",
      sortOrder: 20,
    },
    {
      nameAr: "ميلك شيك لوتس كراميل",
      nameEn: "Lotus Caramel Milkshake",
      category: "صوصات ومشروبات",
      basePrice: 70,
      originalPrice: 85,
      promoPrice: 70,
      promoDays: "يومياً",
      promoActive: false,
      isFlashDeal: false,
      image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80",
      description: "ميلك شيك بسكويت لوتس Biscoff وزبدة الكراميل وصوص التوفي.",
      sortOrder: 21,
    },
    {
      nameAr: "كانز مشروب غازي مثلج (بيبسي / سفن / ميرندا)",
      nameEn: "Soft Drinks Can (Pepsi / 7Up / Mirinda)",
      category: "صوصات ومشروبات",
      basePrice: 25,
      originalPrice: null,
      promoPrice: null,
      promoActive: false,
      isFlashDeal: false,
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
      description: "مشروب غازي بارد ومنعش 330 مل حسب اختيارك.",
      sortOrder: 22,
    },
  ];

  await prisma.product.deleteMany({});
  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }
  console.log(`✅ Products seeded (${productsData.length} Captain Burger items).`);

  // 5. Delivery Zones (Sheikh Zayed & 6th of October)
  const zonesData = [
    { code: "ZAYED-10", nameAr: "الشيخ زايد - الحي العاشر وجوار الفرع", nameEn: "Sheikh Zayed - District 10", fee: 15, timeMinutes: 25 },
    { code: "ZAYED-01", nameAr: "الشيخ زايد - الأحياء (1 إلى 5)", nameEn: "Sheikh Zayed - Districts 1-5", fee: 20, timeMinutes: 30 },
    { code: "ZAYED-06", nameAr: "الشيخ زايد - الأحياء (6 إلى 9)", nameEn: "Sheikh Zayed - Districts 6-9", fee: 20, timeMinutes: 35 },
    { code: "ZAYED-BEV", nameAr: "الشيخ زايد - بيفرلي هيلز والثورة الخضراء", nameEn: "Beverly Hills & Green Belt", fee: 30, timeMinutes: 40 },
    { code: "ZAYED-KHM", nameAr: "الشيخ زايد - الخمائل والكرمة والياسمين", nameEn: "Khamayel & Karma", fee: 25, timeMinutes: 35 },
    { code: "OCT-SOMID", nameAr: "6 أكتوبر - غرب سوميد وجوار الفرع", nameEn: "6th Oct - West Somid", fee: 15, timeMinutes: 25 },
    { code: "OCT-MOTAMAYEZ", nameAr: "6 أكتوبر - الحي المتميز وجامعة مصر", nameEn: "6th Oct - Motamayez & MUST", fee: 20, timeMinutes: 30 },
    { code: "OCT-HOSARY", nameAr: "6 أكتوبر - الحصري ومحور الكفراوي", nameEn: "6th Oct - Hosary & Kafrawy", fee: 25, timeMinutes: 35 },
    { code: "OCT-DAHSHUR", nameAr: "6 أكتوبر - وصلة دهشور والتوسعات الشمالية", nameEn: "Dahshur Link & North Expansions", fee: 25, timeMinutes: 35 },
    { code: "OCT-HADAYEK", nameAr: "6 أكتوبر - حدائق أكتوبر وهضبة الأهرام", nameEn: "October Gardens & Pyramids", fee: 35, timeMinutes: 45 },
  ];

  await prisma.deliveryZone.deleteMany({});
  for (const z of zonesData) {
    await prisma.deliveryZone.create({ data: z });
  }
  console.log(`✅ Delivery Zones seeded (${zonesData.length} zones for Zayed & October).`);

  console.log("🎉 Seeding completed successfully for كابتن برجر (Captain Burger)!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
