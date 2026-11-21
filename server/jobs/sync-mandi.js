import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const key = process.env.DATA_GOV_IN_API_KEY || process.env.DATA_GOV_API_KEY;
  const resourceId = process.env.DATA_GOV_IN_RESOURCE_ID || process.env.MANDI_RESOURCE_ID;
  if (!key || !resourceId) {
    throw new Error("Set DATA_GOV_IN_API_KEY and DATA_GOV_IN_RESOURCE_ID before syncing Mandi history.");
  }

  const url = new URL(`https://api.data.gov.in/resource/${encodeURIComponent(resourceId)}`);
  url.searchParams.set("api-key", key);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", process.env.MANDI_SYNC_LIMIT || "1000");

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Mandi provider returned HTTP ${response.status}.`);
  const payload = await response.json();
  let saved = 0;

  for (const record of payload.records || []) {
    const modalPrice = Number(String(record.modal_price || "").replace(/,/g, ""));
    if (!modalPrice) continue;
    const dateText = record.arrival_date || record.price_date;
    if (!dateText) continue;

    const recordedAt = new Date(dateText);
    if (Number.isNaN(recordedAt.getTime())) continue;

    await prisma.officialMandiQuote.upsert({
      where: {
        crop_variety_grade_market_state_district_day: {
          crop: record.commodity || "Commodity",
          variety: record.variety || "Standard",
          grade: record.grade || "Standard",
          market: record.market || "Market not listed",
          state: record.state || "India",
          district: record.district || "",
          day: recordedAt
        }
      },
      create: {
        crop: record.commodity || "Commodity",
        variety: record.variety || "Standard",
        grade: record.grade || "Standard",
        market: record.market || "Market not listed",
        state: record.state || "India",
        district: record.district || "",
        day: recordedAt,
        price: modalPrice
      },
      update: { price: modalPrice }
    });
    saved += 1;
  }

  console.log(`Synced ${saved} official Mandi records.`);
}

main()
  .catch((error) => {
    console.error("Mandi sync failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
