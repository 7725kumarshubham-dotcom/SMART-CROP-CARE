import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());

type ProviderRecord = Record<string, string | undefined>;

function parseDate(value: string) {
  const parts = value.trim().match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (!parts) return null;
  const year = Number(parts[3].length === 2 ? `20${parts[3]}` : parts[3]);
  const date = new Date(Date.UTC(year, Number(parts[2]) - 1, Number(parts[1])));
  return Number.isNaN(date.getTime()) ? null : date;
}

function amount(value: string | undefined) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

async function main() {
  const key = process.env.DATA_GOV_API_KEY || process.env.DATA_GOV_IN_API_KEY;
  const resourceId = process.env.MANDI_RESOURCE_ID || process.env.DATA_GOV_IN_RESOURCE_ID;
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  if (!key || !resourceId) throw new Error("Data.gov.in credentials are required.");

  const url = new URL(`https://api.data.gov.in/resource/${resourceId}`);
  url.searchParams.set("api-key", key);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(Math.min(Math.max(Number(process.env.MANDI_SYNC_LIMIT ?? 1000), 1), 1000)));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`data.gov.in returned HTTP ${response.status}.`);
  const payload = await response.json();
  const prisma = new PrismaClient();
  let saved = 0;
  try {
    for (const row of (payload.records ?? []) as ProviderRecord[]) {
      const commodity = row.commodity?.trim() ?? "";
      const market = row.market?.trim() ?? "";
      const day = parseDate(row.arrival_date ?? row.price_date ?? "");
      const modalPrice = Math.round(amount(row.modal_price));
      if (!commodity || !market || !day || modalPrice <= 0) continue;
      const variety = row.variety?.trim() || "Standard";
      const state = row.state?.trim() || "India";
      const district = row.district?.trim() || "";
      await prisma.officialMandiQuote.upsert({
        where: { crop_variety_grade_market_state_district_day: { crop: commodity, variety, grade: "Standard", market, state, district, day } },
        create: { crop: commodity, variety, grade: "Standard", market, state, district, day, price: modalPrice },
        update: { price: modalPrice }
      });
      saved += 1;
    }
  } finally {
    await prisma.$disconnect();
  }
  console.log(`Saved ${saved} Mandi records.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });