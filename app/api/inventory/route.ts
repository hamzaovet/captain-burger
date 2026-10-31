import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_INGREDIENTS = [
  { name: "لحم بقري مفروم بلدي 100%", unit: "كيلو", quantity: 60, minStock: 20, costPerUnit: 380 },
  { name: "صدور دجاج متبلة كرسبي", unit: "كيلو", quantity: 45, minStock: 15, costPerUnit: 220 },
  { name: "خبز بريوش فاخر طازج", unit: "باكيت", quantity: 150, minStock: 40, costPerUnit: 35 },
  { name: "جبنة شيدر أمريكية سايحة", unit: "كيلو", quantity: 25, minStock: 8, costPerUnit: 260 },
  { name: "شرائح بيف بيكون مدخن", unit: "كيلو", quantity: 12, minStock: 4, costPerUnit: 420 },
  { name: "بطاطس فارم فريتس مقلية", unit: "كرتونة", quantity: 20, minStock: 6, costPerUnit: 390 },
  { name: "صوص كابتن برجر الخاص", unit: "جركن", quantity: 8, minStock: 3, costPerUnit: 280 },
  { name: "صوص بيج تيستي رانش", unit: "جركن", quantity: 6, minStock: 2, costPerUnit: 290 },
  { name: "خيار مخلل أمريكي شرائح", unit: "جركن", quantity: 10, minStock: 3, costPerUnit: 180 },
  { name: "هالبينو مكسيكي حار", unit: "كيلو", quantity: 8, minStock: 3, costPerUnit: 140 },
  { name: "زيت قلي وتحمير نقي", unit: "كرتونة", quantity: 14, minStock: 5, costPerUnit: 680 },
  { name: "مشروبات غازية كانز مشكل", unit: "كرتونة", quantity: 25, minStock: 10, costPerUnit: 480 },
];

export async function GET() {
  try {
    let items = await prisma.ingredient.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Auto-seed if database table is empty
    if (items.length === 0) {
      await prisma.ingredient.createMany({
        data: DEFAULT_INGREDIENTS,
      });
      items = await prisma.ingredient.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    return NextResponse.json(items);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, unit, quantity, minStock, costPerUnit } = body;
    if (!name) return NextResponse.json({ error: "اسم الصنف مطلوب" }, { status: 400 });

    const item = await prisma.ingredient.create({
      data: {
        name,
        unit: unit || "كيلو",
        quantity: Number(quantity) || 0,
        minStock: Number(minStock) || 0,
        costPerUnit: Number(costPerUnit) || 0,
      },
    });

    return NextResponse.json(item);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
