import { NextResponse } from "next/server";

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function distanceKm(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = radians(toLat - fromLat);
  const dLon = radians(toLon - fromLon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(fromLat)) * Math.cos(radians(toLat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const radius = Number(searchParams.get("radius") ?? 25000);

  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "A valid farm latitude and longitude are required." }, { status: 400 });
  }
  if (![10000, 25000, 50000].includes(radius)) {
    return NextResponse.json({ error: "Choose a search radius of 10, 25, or 50 kilometres." }, { status: 400 });
  }

  const query = `[out:json][timeout:8];nwr(around:${radius},${lat},${lon})[name~"soil|agricultur|krishi|laborator|testing lab|farm science|extension|KVK",i];out center tags;`;
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(9000)
      });
      if (!response.ok) throw new Error(`Map directory returned HTTP ${response.status}.`);
      const payload = await response.json();
      const records = (payload.elements as OverpassElement[] | undefined) ?? [];
      const seen = new Set<string>();
      const results = records
        .map((element) => {
          const placeLat = element.lat ?? element.center?.lat;
          const placeLon = element.lon ?? element.center?.lon;
          const name = element.tags?.name?.trim();
          if (!name || placeLat === undefined || placeLon === undefined) return null;
          const distance = distanceKm(lat, lon, placeLat, placeLon);
          const key = `${name.toLowerCase()}:${placeLat.toFixed(4)}:${placeLon.toFixed(4)}`;
          if (seen.has(key)) return null;
          seen.add(key);
          const tags = element.tags ?? {};
          const address = [
            tags["addr:street"],
            tags["addr:suburb"],
            tags["addr:city"] ?? tags["addr:town"] ?? tags["addr:village"],
            tags["addr:state"]
          ].filter(Boolean).join(", ");
          return {
            id: `${element.type}-${element.id}`,
            name,
            address,
            distanceKm: Math.round(distance * 10) / 10,
            latitude: placeLat,
            longitude: placeLon,
            phone: tags.phone ?? tags["contact:phone"] ?? "",
            website: tags.website ?? tags["contact:website"] ?? "",
            mapUrl: `https://www.openstreetmap.org/?mlat=${placeLat}&mlon=${placeLon}#map=16/${placeLat}/${placeLon}`,
            directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLon}`,
            source: "OpenStreetMap"
          };
        })
        .filter((lab): lab is NonNullable<typeof lab> => lab !== null)
        .filter((lab) => lab.distanceKm <= radius / 1000)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 20);

      return NextResponse.json({
        results,
        radiusKm: radius / 1000,
        source: "OpenStreetMap",
        directoryUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`soil testing lab agricultural laboratory near ${lat},${lon}`)}`
      });
    } catch (error) {
      lastError = error;
    }
  }

  console.error("Nearby soil lab directory request failed:", lastError);
  return NextResponse.json({ error: "The nearby lab directory is temporarily unavailable. Please try again or search the map directly." }, { status: 502 });
}
