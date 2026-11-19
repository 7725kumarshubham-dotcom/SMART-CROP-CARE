import { NextResponse } from "next/server";
import { mandiSample } from "@/backend/data/mock-data";

type MarketOptionRecord = {
  commodity?: string;
  crop?: string;
  state?: string;
  district?: string;
  market?: string;
};

type MandiOption = { district: string; market: string };

function uniqueSorted(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))))
    .sort((a, b) => a.localeCompare(b));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state")?.trim() ?? "";
  if (state.length > 100) {
    return NextResponse.json({ error: "State filter must be 100 characters or fewer." }, { status: 400 });
  }

  let records: MarketOptionRecord[];
  let source: "sample" | "data.gov.in" = "sample";
  const key = process.env.DATA_GOV_IN_API_KEY || process.env.DATA_GOV_API_KEY;
  const resourceId = process.env.DATA_GOV_IN_RESOURCE_ID || process.env.MANDI_RESOURCE_ID;

  if (key && resourceId) {
    try {
      const url = new URL(`https://api.data.gov.in/resource/${encodeURIComponent(resourceId)}`);
      url.searchParams.set("api-key", key);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "1000");
      url.searchParams.set("offset", "0");
      url.searchParams.set("fields", "commodity,state,district,market");
      if (state) url.searchParams.set("filters[state]", state);
      const response = await fetch(url, { next: { revalidate: 3600 } });
      if (!response.ok) throw new Error(`Market option provider returned HTTP ${response.status}.`);
      const payload = await response.json();
      records = (payload.records ?? []) as MarketOptionRecord[];
      source = "data.gov.in";
    } catch (error) {
      console.error("Mandi filter options could not be loaded:", error);
      return NextResponse.json({ error: "Market filter options are unavailable right now." }, { status: 502 });
    }
  } else {
    records = mandiSample.filter(
      (record) =>
        !state || record.state.toLowerCase() === state.toLowerCase()
    );
  }

  const mandis: MandiOption[] = Array.from(
    new Map(
      records
        .filter((record): record is MarketOptionRecord & { market: string; district: string } =>
          Boolean(record.market?.trim() && record.district?.trim())
        )
        .map((record) => [
          `${record.district.trim().toLowerCase()}|${record.market.trim().toLowerCase()}`,
          { district: record.district.trim(), market: record.market.trim() }
        ])
    ).values()
  ).sort((a, b) => a.market.localeCompare(b.market));

  return NextResponse.json({
    states: uniqueSorted(records.map((record) => record.state)),
    crops: uniqueSorted(records.map((record) => record.commodity ?? record.crop)),
    districts: uniqueSorted(records.map((record) => record.district)),
    mandis,
    source
  });
}
