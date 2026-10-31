export interface ZoneItem {
  id?: string;
  code?: string;
  nameEn: string;
  nameAr: string;
  fee: number;
  timeMinutes: number;
  isActive?: boolean;
}

export const CAPTAIN_BURGER_DELIVERY_ZONES: ZoneItem[] = [
  { code: "ZAYED-10", nameAr: "الشيخ زايد - الحي العاشر وجوار الفرع", nameEn: "Sheikh Zayed - District 10", fee: 15.0, timeMinutes: 25 },
  { code: "ZAYED-01", nameAr: "الشيخ زايد - الأحياء (1 إلى 5)", nameEn: "Sheikh Zayed - Districts 1-5", fee: 20.0, timeMinutes: 30 },
  { code: "ZAYED-06", nameAr: "الشيخ زايد - الأحياء (6 إلى 9)", nameEn: "Sheikh Zayed - Districts 6-9", fee: 20.0, timeMinutes: 35 },
  { code: "ZAYED-BEV", nameAr: "الشيخ زايد - بيفرلي هيلز والحزام الأخضر", nameEn: "Beverly Hills & Green Belt", fee: 30.0, timeMinutes: 40 },
  { code: "ZAYED-KHM", nameAr: "الشيخ زايد - الخمائل والربوة والكرما", nameEn: "Khamayel & Karma", fee: 25.0, timeMinutes: 35 },
  { code: "OCT-SOMID", nameAr: "6 أكتوبر - غرب سوميد ومحور 26 يوليو", nameEn: "6th Oct - West Somid", fee: 15.0, timeMinutes: 25 },
  { code: "OCT-MOTAMAYEZ", nameAr: "6 أكتوبر - الحي المتميز وجامعة مصر MUST", nameEn: "6th Oct - Motamayez & MUST", fee: 20.0, timeMinutes: 30 },
  { code: "OCT-HOSARY", nameAr: "6 أكتوبر - الحصري والحي الأول والكفراوي", nameEn: "6th Oct - Hosary & Kafrawy", fee: 25.0, timeMinutes: 35 },
  { code: "OCT-DAHSHUR", nameAr: "6 أكتوبر - وصلة دهشور والتوسعات الشمالية", nameEn: "Dahshur Link & North Expansions", fee: 25.0, timeMinutes: 35 },
  { code: "OCT-HADAYEK", nameAr: "6 أكتوبر - حدائق أكتوبر وهضبة الأهرام", nameEn: "October Gardens & Pyramids", fee: 35.0, timeMinutes: 45 },
];

export const ALL_DELIVERY_ZONES: ZoneItem[] = CAPTAIN_BURGER_DELIVERY_ZONES;
export const OCTOBER_DELIVERY_ZONES: ZoneItem[] = CAPTAIN_BURGER_DELIVERY_ZONES;
export const CAIRO_DELIVERY_ZONES: ZoneItem[] = CAPTAIN_BURGER_DELIVERY_ZONES;

export const DEFAULT_ZONE: ZoneItem = ALL_DELIVERY_ZONES[0];

export function findZone(nameOrCode?: string): ZoneItem {
  if (!nameOrCode) return DEFAULT_ZONE;
  const clean = nameOrCode.trim().toLowerCase();
  const match = ALL_DELIVERY_ZONES.find(
    (z) =>
      (z.code && z.code.toLowerCase() === clean) ||
      z.nameAr.toLowerCase().includes(clean) ||
      z.nameEn.toLowerCase().includes(clean) ||
      clean.includes(z.nameAr.toLowerCase()) ||
      clean.includes(z.nameEn.toLowerCase())
  );
  return (
    match || {
      nameAr: nameOrCode,
      nameEn: nameOrCode,
      fee: 20.0,
      timeMinutes: 35,
    }
  );
}
