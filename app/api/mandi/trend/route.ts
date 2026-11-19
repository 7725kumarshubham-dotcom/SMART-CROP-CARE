import { NextResponse } from "next/server";
import { getPrismaClient } from "@/backend/db";

type ProviderRecord = Record<string, string | undefined>;
type TrendPoint = { date: string; price: number };

function parseMandiDate(value: string) {
  const match = value.trim().match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (match) {
    const year = Number(match[3].length === 2 ? `20${match[3]}` : match[3]);
    const date = new Date(Date.UTC(year, Number(match[2]) - 1, Number(match[1])));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop")?.trim() ?? "";
  const variety = searchParams.get("variety")?.trim() ?? "";
  const state = searchParams.get("state")?.trim() ?? "";
  const district = searchParams.get("district")?.trim() ?? "";
  const market = searchParams.get("market")?.trim() ?? "";
  const key = process.env.DATA_GOV_IN_API_KEY || process.env.DATA_GOV_API_KEY;
  const resourceId = process.env.DATA_GOV_IN_RESOURCE_ID || process.env.MANDI_RESOURCE_ID;

  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const stored = await prisma.officialMandiQuote.findMany({
        where: { crop, market, state, district, ...(variety ? { variety } : {}) },
        orderBy: { day: "desc" },
        take: 30
      });
      if (stored.length >= 2) {
        return NextResponse.json({
          history: stored.reverse().map((record) => ({ date: record.day.toISOString().slice(0, 10), price: Number(record.price) })),
          source: "database"
        });
      }
    } catch (error) {
      console.error("Stored Mandi trend lookup failed:", error);
    }
  }
  if (!key || !resourceId) return NextResponse.json({ history: [], source: "sample" });
  if (!crop || !market || [crop, variety, state, district, market].some((value) => value.length > 100)) {
    return NextResponse.json({ error: "Crop and market are required." }, { status: 400 });
  }

  try {
    const url = new URL(`https://api.data.gov.in/resource/${encodeURIComponent(resourceId)}`);
    url.searchParams.set("api-key", key);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1000");
    url.searchParams.set("filters[commodity]", crop);
    url.searchParams.set("filters[market]", market);
    if (variety && variety !== "Standard") url.searchParams.set("filters[variety]", variety);
    if (state) url.searchParams.set("filters[state]", state);
    if (district) url.searchParams.set("filters[district]", district);
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`Provider returned HTTP ${response.status}.`);
    const payload = await response.json();
    const byDate = new Map<string, TrendPoint>();
    for (const record of (payload.records ?? []) as ProviderRecord[]) {
      const rawDate = record.arrival_date ?? record.price_date ?? "";
      const date = parseMandiDate(rawDate);
      const price = Number(String(record.modal_price ?? record.min_price ?? "").replace(/,/g, ""));
      if (date && Number.isFinite(price) && price > 0) {
        byDate.set(date.toISOString().slice(0, 10), { date: date.toISOString().slice(0, 10), price });
      }
    }
    const history = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    return NextResponse.json({ history, source: "data.gov.in" });
  } catch (error) {
    console.error("Mandi trend provider request failed:", error);
    return NextResponse.json({ error: "Live Mandi price history is unavailable right now." }, { status: 502 });
  }
}