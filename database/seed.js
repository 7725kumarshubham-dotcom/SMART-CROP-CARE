import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();
const crops = [
  { commodity: "Wheat", variety: "Lokwan", state: "Madhya Pradesh", district: "Indore", market: "Indore", base: 2240 },
  { commodity: "Rice", variety: "Common", state: "Haryana", district: "Karnal", market: "Karnal", base: 2120 },
  { commodity: "Cotton", variety: "Medium staple", state: "Gujarat", district: "Rajkot", market: "Rajkot", base: 6900 },
  { commodity: "Tomato", variety: "Hybrid", state: "Maharashtra", district: "Pune", market: "Pune", base: 3450 },
  { commodity: "Potato", variety: "Jyoti", state: "Uttar Pradesh", district: "Agra", market: "Agra", base: 1580 }
];
async function main() {
  const demoEmail = "demo@smartcropcare.local";
  const demoPassword = "Demo1234";
  const existingDemo = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingDemo) {
    await prisma.user.create({
      data: {
        name: "Demo Farmer",
        phone: "9876543210",
        email: demoEmail,
        passwordHash: await hash(demoPassword, 12),
        farmProfile: {
          create: {
            location: "Nashik",
            district: "Nashik",
            state: "Maharashtra",
            acreage: 2.5,
            primaryCrops: JSON.stringify(["Wheat", "Onion"])
          }
        }
      }
    });
  }

  const today = /* @__PURE__ */ new Date();
  const history = crops.flatMap(
    (crop, cropIndex) => Array.from({ length: 14 }, (_, dayIndex) => {
      const variation = Math.round(Math.sin((dayIndex + cropIndex) * 0.8) * crop.base * 0.035);
      const modalPrice = crop.base + variation + dayIndex * (cropIndex % 2 === 0 ? 8 : -3);
      const recordedAt = new Date(today);
      recordedAt.setDate(today.getDate() - (13 - dayIndex));
      return {
        commodity: crop.commodity,
        variety: crop.variety,
        state: crop.state,
        district: crop.district,
        market: crop.market,
        minPrice: modalPrice - 90,
        maxPrice: modalPrice + 110,
        modalPrice,
        arrivals: 18 + (dayIndex * 7 + cropIndex * 11) % 55,
        recordedAt
      };
    })
  );
  for (const record of history) {
    await prisma.mandiPriceRecord.upsert({
      where: {
        commodity_variety_state_district_market_recordedAt: {
          commodity: record.commodity,
          variety: record.variety,
          state: record.state,
          district: record.district,
          market: record.market,
          recordedAt: record.recordedAt
        }
      },
      create: record,
      update: {}
    });
  }
  const procurementItems = [
    { name: "Certified wheat seeds", category: "Seeds", description: "HD 2967 \xB7 40 kg bag", price: 1850, unit: "bag", certified: true },
    { name: "Neem-based bio-fertilizer", category: "Fertilizer", description: "Organic \xB7 5 litre pack", price: 690, unit: "pack", certified: true },
    { name: "Drip irrigation starter kit", category: "Irrigation", description: "For up to 1 acre", price: 4290, unit: "kit", certified: false }
  ];
  for (const item of procurementItems) {
    const existing = await prisma.procurementItem.findFirst({ where: { name: item.name } });
    if (!existing) await prisma.procurementItem.create({ data: item });
  }
  console.log(`Seeded ${history.length} mandi price records and 3 procurement items.`);
}
main().catch((error) => {
  console.error("Database seed failed:", error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
