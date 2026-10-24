import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const crops = [
  { commodity: "Wheat", variety: "Lokwan", state: "Madhya Pradesh", district: "Indore", market: "Indore", base: 2240 },
  { commodity: "Rice", variety: "Common", state: "Haryana", district: "Karnal", market: "Karnal", base: 2120 },
  { commodity: "Cotton", variety: "Medium staple", state: "Gujarat", district: "Rajkot", market: "Rajkot", base: 6900 },
  { commodity: "Tomato", variety: "Hybrid", state: "Maharashtra", district: "Pune", market: "Pune", base: 3450 },
  { commodity: "Potato", variety: "Jyoti", state: "Uttar Pradesh", district: "Agra", market: "Agra", base: 1580 }
];

async function main() {
  const today = new Date();
  const history = crops.flatMap((crop, cropIndex) =>
    Array.from({ length: 14 }, (_, dayIndex) => {
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
        arrivals: 18 + ((dayIndex * 7 + cropIndex * 11) % 55),
        recordedAt
      };
    })
  );

  await prisma.mandiPriceRecord.deleteMany();
  await prisma.mandiPriceRecord.createMany({ data: history });
  await prisma.procurementItem.createMany({
    skipDuplicates: true,
    data: [
      { name: "Certified wheat seeds", category: "Seeds", description: "HD 2967 · 40 kg bag", price: 1850, unit: "bag", certified: true },
      { name: "Neem-based bio-fertilizer", category: "Fertilizer", description: "Organic · 5 litre pack", price: 690, unit: "pack", certified: true },
      { name: "Drip irrigation starter kit", category: "Irrigation", description: "For up to 1 acre", price: 4290, unit: "kit", certified: false }
    ]
  });
  console.log(`Seeded ${history.length} mandi price records and 3 procurement items.`);
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
