import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_OFFERS = {
  enabled: true,
  badge: "عروض محدودة 🔥",
  title: "عروض كابتن برجر الحصرية",
  subtitle: "أقوى عروض البرجر والفرايز والمشروبات في الشيخ زايد و6 أكتوبر",
  cards: [
    {
      id: "combo",
      title: "كومبو الصحاب التوفيري 🍔🍟",
      desc: "2 برجر كلاسيك بيف + لودد فرايز بالشيدر + 2 كانز بيبسي بـ 280 ج بدلاً من 350 ج",
      icon: "party",
    },
    {
      id: "delivery",
      title: "توصيل سريع مجاني 🛵",
      desc: "اطلب بقيمة 400 جنيه أو أكثر واستمتع بالتوصيل المجاني لكافة مناطق زايد وأكتوبر",
      icon: "delivery",
    },
    {
      id: "captain20",
      title: "كوبون خصم 20% كابتن 🎟️",
      desc: "استخدم كود CAPTAIN20 في السلة واحصل على خصم فوري 20% على إجمالي طلبك",
      icon: "student",
    },
  ],
  banner: {
    badge: "الأكثر طلباً ومبيعاً 🔥",
    title: "جوسي لوسي بركان الشيدر والبيكون",
    linkText: "اطلب الساندوتش الآن",
    linkHref: "#menu",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600",
  },
  discount: {
    enabled: false,
    title: "خصم خاص لفترة محدودة 🔥",
    type: "percentage",
    value: 15,
    scope: "all",
    categoryName: "برجر لحم بلدي فاخر",
    productIds: [],
  },
};

export async function GET() {
  try {
    const setting = await prisma.systemSettings.findUnique({
      where: { id: "default" },
      select: { specialOffers: true, offersEnabled: true },
    });

    let data: any = { ...DEFAULT_OFFERS };
    if (setting?.specialOffers) {
      try {
        const parsed = JSON.parse(setting.specialOffers);
        data = { ...data, ...parsed };
      } catch (e) {
        console.error("Failed to parse specialOffers:", e);
      }
    }

    if (setting?.offersEnabled !== undefined) {
      data.enabled = setting.offersEnabled;
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(DEFAULT_OFFERS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const currentSetting = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    let currentOffers: any = { ...DEFAULT_OFFERS };
    if (currentSetting?.specialOffers) {
      try {
        currentOffers = { ...currentOffers, ...JSON.parse(currentSetting.specialOffers) };
      } catch (e) {
        console.error("Failed to parse specialOffers:", e);
      }
    }

    const merged = { ...currentOffers, ...body };

    await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: {
        specialOffers: JSON.stringify(merged),
        offersEnabled: merged.enabled !== undefined ? merged.enabled : true,
      },
      create: {
        id: "default",
        restaurantName: "كابتن برجر",
        phone: "01206002168",
        specialOffers: JSON.stringify(merged),
        offersEnabled: merged.enabled !== undefined ? merged.enabled : true,
      },
    });

    return NextResponse.json({ success: true, offers: merged });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
