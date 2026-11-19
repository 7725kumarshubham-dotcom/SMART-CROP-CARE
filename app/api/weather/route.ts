import { NextResponse } from "next/server";
import { weatherSample } from "@/backend/data/mock-data";

async function getOpenMeteoWeather(lat: number, lon: number, requestedLocation?: string) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,uv_index"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) throw new Error(`Open-Meteo returned HTTP ${response.status}.`);
    const payload = await response.json();
    if (!payload.current || !payload.daily?.time?.length) {
      throw new Error("Open-Meteo returned incomplete weather data.");
    }

    const describeCode = (code: number) => {
      if (code === 0) return { label: "Clear sky", icon: "sun" };
      if (code <= 2) return { label: "Partly cloudy", icon: code === 1 ? "sun" : "cloud" };
      if (code === 3 || code === 45 || code === 48) return { label: code === 3 ? "Overcast" : "Fog", icon: "cloud" };
      if (code >= 51 && code <= 67) return { label: "Drizzle or rain", icon: "rain" };
      if (code >= 71 && code <= 77) return { label: "Snow", icon: "cloud" };
      if (code >= 80 && code <= 82) return { label: "Rain showers", icon: "rain" };
      if (code >= 85 && code <= 86) return { label: "Snow showers", icon: "cloud" };
      if (code >= 95) return { label: "Thunderstorms", icon: "rain" };
      return { label: "Current conditions", icon: "cloud" };
    };

    const forecast = payload.daily.time.map((date: string, index: number) => ({
      day:
        index === 0
          ? "Today"
          : new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", {
              weekday: "short",
              timeZone: "UTC"
            }),
      ...describeCode(payload.daily.weather_code[index]),
      high: Math.round(payload.daily.temperature_2m_max[index]),
      low: Math.round(payload.daily.temperature_2m_min[index]),
      rain: payload.daily.precipitation_probability_max[index] ?? 0
    }));
    const current = payload.current;
    const currentCondition = describeCode(current.weather_code);
    const rainDay = forecast.find((day: { day: string; rain: number }) => day.rain >= 50);

    return NextResponse.json({
      location:
        requestedLocation ||
        (Math.abs(lat - 19.9975) < 0.01 && Math.abs(lon - 73.7898) < 0.01
          ? weatherSample.location
          : `${lat.toFixed(2)}, ${lon.toFixed(2)}`),
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      rainChance: forecast[0]?.rain ?? 0,
      wind: Math.round(current.wind_speed_10m),
      uv: Math.round(current.uv_index ?? 0),
      condition: currentCondition.label,
      forecast,
      advisory: rainDay
        ? `Rain is likely on ${rainDay.day}. Avoid spraying pesticides before or during the showers.`
        : "Conditions look mostly dry. Check soil moisture before your next irrigation.",
      source: "live"
    });
  } catch (error) {
    console.error("Open-Meteo weather request failed:", error);
    return NextResponse.json({ error: "Live weather is unavailable right now." }, { status: 502 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? 19.9975);
  const lon = Number(searchParams.get("lon") ?? 73.7898);
  const requestedLocation = searchParams.get("location")?.trim().slice(0, 150);
  const key = process.env.OPENWEATHER_API_KEY;

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "A valid latitude and longitude are required." }, { status: 400 });
  }

  if (!key) return getOpenMeteoWeather(lat, lon, requestedLocation);

  try {
    const query = `lat=${lat}&lon=${lon}&appid=${key}&units=metric&exclude=minutely,hourly,alerts`;
    const [weatherResponse, locationResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/3.0/onecall?${query}`, { next: { revalidate: 1800 } }),
      fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`, { next: { revalidate: 86400 } })
    ]);
    if (!weatherResponse.ok) {
      throw new Error(`OpenWeatherMap returned HTTP ${weatherResponse.status}.`);
    }

    const payload = await weatherResponse.json();
    const locations = locationResponse.ok ? await locationResponse.json() : [];
    const forecast = (payload.daily ?? []).slice(0, 7).map((entry: {
      dt: number; temp: { max: number; min: number }; pop?: number; weather?: Array<{ main?: string }>;
    }, index: number) => {
      const day = new Date(entry.dt * 1000).toLocaleDateString("en-IN", { weekday: "short" });
      const condition = entry.weather?.[0]?.main?.toLowerCase() ?? "clear";
      return {
        day: index === 0 ? "Today" : day,
        icon: condition.includes("rain") || condition.includes("drizzle") ? "rain" : condition.includes("cloud") ? "cloud" : "sun",
        high: Math.round(entry.temp.max),
        low: Math.round(entry.temp.min),
        rain: Math.round((entry.pop ?? 0) * 100)
      };
    });
    const current = payload.current;
    const rainDay = forecast.find((day: { day: string; rain: number }) => day.rain >= 50);
    return NextResponse.json({
      location: requestedLocation || (locations[0] ? `${locations[0].name}, ${locations[0].state ?? locations[0].country}` : `${lat.toFixed(2)}, ${lon.toFixed(2)}`),
      temperature: Math.round(current.temp),
      feelsLike: Math.round(current.feels_like),
      humidity: current.humidity,
      rainChance: forecast[0]?.rain ?? 0,
      wind: Math.round((current.wind_speed ?? 0) * 3.6),
      uv: Math.round(current.uvi ?? 0),
      condition: current.weather?.[0]?.description ?? "Current conditions",
      forecast,
      advisory: rainDay
        ? `Rain is likely on ${rainDay.day}. Avoid spraying pesticides before or during the showers.`
        : "Conditions look mostly dry. Check soil moisture before your next irrigation.",
      source: "live"
    });
  } catch (error) {
    console.error("OpenWeatherMap weather request failed; falling back to Open-Meteo:", error);
    return getOpenMeteoWeather(lat, lon, requestedLocation);
  }
}
