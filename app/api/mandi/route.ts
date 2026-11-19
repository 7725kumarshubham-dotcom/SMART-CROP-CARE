import { NextResponse } from "next/server";
import { mandiSample } from "@/backend/data/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop")?.trim() ?? "";
  const state = searchParams.get("state")?.trim() ?? "";
  const district = searchParams.get("district")?.trim() ?? "";
  const market = searchParams.get("market")?.trim() ?? "";
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const parsedLimit = Number(searchParams.get("limit") ?? 50);
  const parsedOffset = Number(searchParams.get("offset") ?? 0);
  const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 1000) : 50;
  const offset = Number.isInteger(parsedOffset) ? Math.max(parsedOffset, 0) : 0;
  const key = process.env.DATA_GOV_IN_API_KEY || process.env.DATA_GOV_API_KEY;
  const resourceId = process.env.DATA_GOV_IN_RESOURCE_ID || process.env.MANDI_RESOURCE_ID;

  if ([crop, state, district, market, search].some((value) => value.length > 100)) {
    return NextResponse.json({ error: "Market filters must be 100 characters or fewer." }, { status: 400 });
  }

  if (key && resourceId) {
    try {
      const url = new URL(`https://api.data.gov.in/resource/${encodeURIComponent(resourceId)}`);
      url.searchParams.set("api-key", key);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(offset));
      if (crop) url.searchParams.set("filters[commodity]", crop);
      if (state) url.searchParams.set("filters[state]", state);
      if (district) url.searchParams.set("filters[district]", district);
      if (market) url.searchParams.set("filters[market]", market);
      if (search) url.searchParams.set("q", search);
      const response = await fetch(url, { next: { revalidate: 3600 } });
      if (!response.ok) throw new Error("Market data provider returned an unsuccessful response.");
      const payload = await response.json();
      const records = (payload.records ?? []).map((record: Record<string, string>) => {
        const rawPrice = String(record.modal_price ?? record.min_price ?? "").replace(/,/g, "");
        return {
          crop: record.commodity ?? "Commodity",
          variety: record.variety ?? "Standard",
          market: record.market ?? "Market not listed",
          district: record.district ?? "",
          state: record.state ?? "India",
          price: Number(rawPrice) || 0,
          change: 0,
          unit: "quintal",
          history: [],
          recordedAt: record.arrival_date ?? record.price_date ?? ""
        };
      }).filter((record: { price: number }) => record.price > 0);
      return NextResponse.json({
        records,
        source: "data.gov.in",
        total: Number(payload.total ?? records.length),
        offset,
        limit,
        hasMore: offset + records.length < Number(payload.total ?? records.length)
      });
    } catch (error) {
      console.error("Market data provider request failed:", error);
      return NextResponse.json({ error: "Live mandi prices are unavailable right now." }, { status: 502 });
    }
  }

  const filtered = mandiSample.filter((record) =>
    (!crop || record.crop.toLowerCase().includes(crop.toLowerCase())) &&
    (!state || record.state.toLowerCase().includes(state.toLowerCase())) &&
    (!district || record.district.toLowerCase().includes(district.toLowerCase())) &&
    (!market || record.market.toLowerCase().includes(market.toLowerCase())) &&
    (!search || `${record.crop} ${record.variety} ${record.market} ${record.district} ${record.state}`.toLowerCase().includes(search))
  );
  const records = filtered.slice(offset, offset + limit);
  return NextResponse.json({
    records,
    source: "sample",
    total: filtered.length,
    offset,
    limit,
    hasMore: offset + records.length < filtered.length
  });
}
