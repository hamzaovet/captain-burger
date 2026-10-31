import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

let cachedSettings: any = null;
let lastSettingsTime = 0;
const SETTINGS_TTL_MS = 10_000; // 10 seconds

export async function GET() {
  try {
    const now = Date.now();
    if (cachedSettings && now - lastSettingsTime < SETTINGS_TTL_MS) {
      return NextResponse.json(cachedSettings);
    }

    let settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: "default",
          restaurantName: "كابتن برجر",
          phone: "01206002168",
          hotlines: "01206002168 | 01117776349 | 01018804888 | 01008847666",
          address: "فروعنا: الشيخ زايد (الحي العاشر) و 6 أكتوبر (غرب سوميد)",
          deliveryZones: JSON.stringify([
            { name: "الشيخ زايد - الحي العاشر وجوار الفرع", fee: 15 },
            { name: "الشيخ زايد - الأحياء (1 إلى 5)", fee: 20 },
            { name: "الشيخ زايد - الأحياء (6 إلى 9)", fee: 20 },
            { name: "الشيخ زايد - بيفرلي هيلز والخمائل", fee: 30 },
            { name: "6 أكتوبر - غرب سوميد ومحور 26 يوليو", fee: 15 },
            { name: "6 أكتوبر - الحصري والحي المتميز", fee: 20 },
            { name: "6 أكتوبر - حدائق أكتوبر وهضبة الأهرام", fee: 35 },
          ]),
          soundsEnabled: true,
          offersEnabled: true,
          whatsappOrdersEnabled: true,
          ownerWhatsapp: "01206002168",
        },
      });
    }

    cachedSettings = settings;
    lastSettingsTime = now;
    return NextResponse.json(settings);
  } catch (err: unknown) {
    if (cachedSettings) return NextResponse.json(cachedSettings);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const updateData: any = {};
    if (body.restaurantName !== undefined) updateData.restaurantName = body.restaurantName;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.hotlines !== undefined) updateData.hotlines = body.hotlines;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.soundsEnabled !== undefined) updateData.soundsEnabled = body.soundsEnabled;
    if (body.offersEnabled !== undefined) updateData.offersEnabled = body.offersEnabled;
    if (body.specialOffers !== undefined) updateData.specialOffers = typeof body.specialOffers === "string" ? body.specialOffers : JSON.stringify(body.specialOffers);
    if (body.deliveryZones !== undefined) updateData.deliveryZones = typeof body.deliveryZones === "string" ? body.deliveryZones : JSON.stringify(body.deliveryZones);
    if (body.whatsappOrdersEnabled !== undefined) updateData.whatsappOrdersEnabled = body.whatsappOrdersEnabled;
    if (body.ownerWhatsapp !== undefined) updateData.ownerWhatsapp = body.ownerWhatsapp;
    if (body.saro5WebhookUrl !== undefined) updateData.saro5WebhookUrl = body.saro5WebhookUrl;
    if (body.talabatWebhookUrl !== undefined) updateData.talabatWebhookUrl = body.talabatWebhookUrl;

    const updated = await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: updateData,
      create: {
        id: "default",
        restaurantName: body.restaurantName || "كابتن برجر",
        phone: body.phone || "01206002168",
        hotlines: body.hotlines || "01206002168 | 01117776349 | 01018804888 | 01008847666",
        address: body.address || "فروعنا: الشيخ زايد (الحي العاشر) و 6 أكتوبر (غرب سوميد)",
        soundsEnabled: body.soundsEnabled ?? true,
        offersEnabled: body.offersEnabled ?? true,
        whatsappOrdersEnabled: body.whatsappOrdersEnabled ?? true,
        ownerWhatsapp: body.ownerWhatsapp || "01206002168",
        saro5WebhookUrl: body.saro5WebhookUrl || null,
        talabatWebhookUrl: body.talabatWebhookUrl || null,
        deliveryZones: typeof body.deliveryZones === "string" ? body.deliveryZones : JSON.stringify(body.deliveryZones || []),
      },
    });

    cachedSettings = updated;
    lastSettingsTime = Date.now();

    return NextResponse.json(updated);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
