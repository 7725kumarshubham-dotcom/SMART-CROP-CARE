import { NextResponse } from "next/server";
import { indianStates } from "@/lib/india-locations";

const geocoderStateNames: Record<string, string> = {
  "andaman and nicobar islands": "andaman and nicobar",
  delhi: "national capital territory of delhi"
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const state = searchParams.get("state")?.trim() ?? "";
  const district = searchParams.get("district")?.trim() ?? "";

  if (query.length < 2 || query.length > 80 || district.length > 80) {
    return NextResponse.json({ error: "Enter a location search between 2 and 80 characters." }, { status: 400 });
  }
  if (!indianStates.some((item) => item.toLowerCase() === state.toLowerCase())) {
    return NextResponse.json({ error: "Choose a valid Indian state or union territory." }, { status: 400 });
  }
  const geocoderState = geocoderStateNames[state.toLowerCase()] ?? state;

  try {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", query);
    url.searchParams.set("count", "100");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");
    url.searchParams.set("countryCode", "IN");

    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error("Location provider returned an unsuccessful response.");
    const payload = await response.json();
    const results = (payload.results ?? [])
      .filter((place: { admin1?: string; admin2?: string; country_code?: string }) =>
        place.country_code === "IN" &&
        place.admin1?.toLowerCase() === geocoderState.toLowerCase() &&
        (!district || place.admin2?.toLowerCase().includes(district.toLowerCase()))
      )
      .map((place: {
        name: string;
        admin1: string;
        admin2?: string;
        latitude: number;
        longitude: number;
      }) => ({
        name: place.name,
        district: place.admin2 ?? "",
        state: place.admin1,
        latitude: place.latitude,
        longitude: place.longitude
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Location search failed:", error);
    return NextResponse.json({ error: "Location search is unavailable right now." }, { status: 502 });
  }
}
