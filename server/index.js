import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compare, hash } from "bcryptjs";
import { Prisma } from "@prisma/client";

import { getPrismaClient } from "./db.js";
import { mandiSample, weatherSample } from "./mock-data.js";
import {
  authCookieName,
  authSessionDurationSeconds,
  clearAuthCookie,
  createSessionToken,
  getSessionUser,
  hashSessionToken,
  setAuthCookie
} from "./auth.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "14mb" }));
app.use(cookieParser());

function formatEntry(entry) {
  return {
    id: entry.id,
    crop: entry.crop,
    activity: entry.activity,
    date: entry.date.toISOString().slice(0, 10),
    notes: entry.notes,
    createdAt: entry.createdAt.toISOString()
  };
}

function formatReminder(reminder) {
  return {
    id: reminder.id,
    title: reminder.title,
    crop: reminder.crop,
    dueDate: reminder.dueDate.toISOString().slice(0, 10),
    completed: reminder.completed,
    createdAt: reminder.createdAt.toISOString()
  };
}

app.post("/api/auth/signup", async (req, res) => {
  const { name = "", phone = "", email = "", password = "", confirmPassword = "" } = req.body || {};
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({ error: "Enter a name between 2 and 100 characters." });
  }
  if (typeof phone !== "string" || !/^[6-9]\d{9}$/.test(phone.trim())) {
    return res.status(400).json({ error: "Enter a valid 10-digit Indian mobile number." });
  }
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (typeof password !== "string" || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return res.status(400).json({ error: "Use at least 8 characters, including a letter and a number." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Your passwords do not match." });
  }

  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured. Set DATABASE_URL and restart the app." });
  const sessionToken = createSessionToken();
  try {
    const passwordHash = await hash(password, 12);
    const user = await prisma.$transaction(async (transaction) => {
      const created = await transaction.user.create({
        data: { name: name.trim(), phone: phone.trim(), email: normalizedEmail, passwordHash },
        select: { id: true, name: true, phone: true, email: true }
      });
      await transaction.authSession.create({
        data: {
          tokenHash: hashSessionToken(sessionToken),
          userId: created.id,
          expiresAt: new Date(Date.now() + authSessionDurationSeconds * 1000)
        }
      });
      return created;
    });
    setAuthCookie(res, sessionToken);
    return res.status(201).json({ user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "An account already uses this email address or mobile number." });
    }
    console.error("Account creation failed:", error);
    return res.status(500).json({ error: "We couldn't create your account. Please try again." });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!email || !password) return res.status(400).json({ error: "Enter your email and password." });
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured. Set DATABASE_URL and restart the app." });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash || !(await compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
    const sessionToken = createSessionToken();
    await prisma.authSession.create({
      data: {
        tokenHash: hashSessionToken(sessionToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + authSessionDurationSeconds * 1000)
      }
    });
    setAuthCookie(res, sessionToken);
    return res.json({ user: { id: user.id, name: user.name, phone: user.phone, email: user.email } });
  } catch (error) {
    console.error("Sign-in failed:", error);
    return res.status(500).json({ error: "We couldn't sign you in. Please try again." });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  const token = req.cookies?.[authCookieName];
  if (token) {
    const prisma = getPrismaClient();
    if (prisma) await prisma.authSession.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
  }
  clearAuthCookie(res);
  res.json({ success: true });
});

app.get("/api/auth/me", async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Please sign in." });
    const profile = user.farmProfile;
    let primaryCrops = [];
    if (profile?.primaryCrops) {
      try {
        const parsed = JSON.parse(profile.primaryCrops);
        if (Array.isArray(parsed)) primaryCrops = parsed;
      } catch {}
    }
    res.json({
      account: {
        name: user.name,
        email: user.email || "",
        phone: user.phone,
        farmProfile: profile ? {
          location: profile.location,
          district: profile.district,
          state: profile.state,
          acreage: profile.acreage,
          primaryCrops
        } : null
      }
    });
  } catch (error) {
    console.error("Session lookup failed:", error);
    res.status(500).json({ error: "We couldn't verify your session." });
  }
});

app.get("/api/diary", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to view your crop diary." });
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured." });
  try {
    const entries = await prisma.cropDiaryEntry.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 100
    });
    res.json({ entries: entries.map(formatEntry) });
  } catch (error) {
    console.error("Crop diary load failed:", error);
    res.status(500).json({ error: "We couldn't load your crop diary. Please try again." });
  }
});

app.post("/api/diary", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to save a crop diary entry." });
  const { crop = "", activity = "", date = "", notes = "" } = req.body || {};
  const validActivities = ["Sowing", "Irrigation", "Fertilizing", "Spraying", "Weeding", "Harvest", "Other"];
  const entryDate = new Date(`${date}T00:00:00.000Z`);
  if (typeof crop !== "string" || !crop.trim() || crop.length > 80 || !validActivities.includes(activity) ||
      typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(entryDate.getTime()) ||
      entryDate.toISOString().slice(0, 10) !== date || typeof notes !== "string" || notes.length > 1000) {
    return res.status(400).json({ error: "Enter a crop, valid activity, date, and notes under 1,000 characters." });
  }
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured." });
  try {
    const entry = await prisma.cropDiaryEntry.create({
      data: { userId: user.id, crop: crop.trim(), activity, date: entryDate, notes: notes.trim() }
    });
    res.status(201).json({ entry: formatEntry(entry) });
  } catch (error) {
    console.error("Crop diary save failed:", error);
    res.status(500).json({ error: "We couldn't save your crop diary entry. Please try again." });
  }
});

app.get("/api/reminders", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to view your reminders." });
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured." });
  const reminders = await prisma.farmReminder.findMany({
    where: { userId: user.id },
    orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    take: 200
  });
  res.json({ reminders: reminders.map(formatReminder) });
});

app.post("/api/reminders", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to save a reminder." });
  const { title = "", crop = null, dueDate = "" } = req.body || {};
  const date = new Date(`${dueDate}T00:00:00.000Z`);
  if (typeof title !== "string" || !title.trim() || title.length > 120 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== dueDate ||
      (crop !== null && (typeof crop !== "string" || !crop.trim() || crop.length > 80))) {
    return res.status(400).json({ error: "Enter a task, valid due date, and optional crop." });
  }
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured." });
  const reminder = await prisma.farmReminder.create({
    data: { userId: user.id, title: title.trim(), crop: crop?.trim() || null, dueDate: date }
  });
  res.status(201).json({ reminder: formatReminder(reminder) });
});

app.patch("/api/reminders", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to update a reminder." });
  const prisma = getPrismaClient();
  const result = await prisma?.farmReminder.updateMany({
    where: { id: req.body?.id, userId: user.id },
    data: { completed: req.body?.completed }
  });
  if (!result?.count) return res.status(404).json({ error: "Reminder not found." });
  res.json({ id: req.body.id, completed: req.body.completed });
});

app.delete("/api/reminders", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to delete a reminder." });
  const prisma = getPrismaClient();
  const result = await prisma?.farmReminder.deleteMany({ where: { id: req.body?.id, userId: user.id } });
  if (!result?.count) return res.status(404).json({ error: "Reminder not found." });
  res.json({ deleted: true });
});

app.get("/api/weather", async (req, res) => {
  const lat = Number(req.query.lat ?? 19.9975);
  const lon = Number(req.query.lon ?? 73.7898);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({ error: "A valid latitude and longitude are required." });
  }
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("current", "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,uv_index");
    url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max");
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "7");
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);
    const payload = await response.json();
    const describe = (code) => code <= 2 ? ["Partly cloudy", code === 1 ? "sun" : "cloud"] : code >= 51 ? ["Rain or drizzle", "rain"] : ["Clear or overcast", "cloud"];
    const forecast = payload.daily.time.map((date, index) => ({
      day: index === 0 ? "Today" : new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" }),
      icon: describe(payload.daily.weather_code[index])[1],
      high: Math.round(payload.daily.temperature_2m_max[index]),
      low: Math.round(payload.daily.temperature_2m_min[index]),
      rain: payload.daily.precipitation_probability_max[index] ?? 0
    }));
    res.json({
      location: typeof req.query.location === "string" ? req.query.location.slice(0, 150) : `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      temperature: Math.round(payload.current.temperature_2m),
      feelsLike: Math.round(payload.current.apparent_temperature),
      humidity: payload.current.relative_humidity_2m,
      rainChance: forecast[0]?.rain ?? 0,
      wind: Math.round(payload.current.wind_speed_10m),
      uv: Math.round(payload.current.uv_index ?? 0),
      condition: describe(payload.current.weather_code)[0],
      forecast,
      advisory: forecast.find((day) => day.rain >= 50)
        ? "Rain is likely soon. Avoid spraying pesticides before or during the showers."
        : "Conditions look mostly dry. Check soil moisture before your next irrigation.",
      source: "live"
    });
  } catch (error) {
    console.error("Weather provider failed:", error);
    res.status(502).json({ error: "Live weather is unavailable right now." });
  }
});

app.get("/api/mandi", (req, res) => {
  const crop = String(req.query.crop || "").trim();
  const state = String(req.query.state || "").trim();
  const district = String(req.query.district || "").trim();
  const market = String(req.query.market || "").trim();
  const search = String(req.query.search || "").trim().toLowerCase();
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 1000);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const filtered = mandiSample.filter((record) =>
    (!crop || record.crop.toLowerCase().includes(crop.toLowerCase())) &&
    (!state || record.state.toLowerCase().includes(state.toLowerCase())) &&
    (!district || record.district.toLowerCase().includes(district.toLowerCase())) &&
    (!market || record.market.toLowerCase().includes(market.toLowerCase())) &&
    (!search || `${record.crop} ${record.variety} ${record.market} ${record.district} ${record.state}`.toLowerCase().includes(search))
  );
  const records = filtered.slice(offset, offset + limit);
  res.json({ records, source: "sample", total: filtered.length, offset, limit, hasMore: offset + records.length < filtered.length });
});

app.get("/api/mandi/options", (_req, res) => {
  res.json({
    states: [...new Set(mandiSample.map((record) => record.state))].sort(),
    crops: [...new Set(mandiSample.map((record) => record.crop))].sort(),
    districts: [...new Set(mandiSample.map((record) => record.district))].sort(),
    mandis: mandiSample.map((record) => ({ district: record.district, market: record.market }))
  });
});

app.get("/api/mandi/trend", (req, res) => {
  const crop = String(req.query.crop || "");
  const record = mandiSample.find((item) => item.crop.toLowerCase() === crop.toLowerCase()) || mandiSample[0];
  res.json({ trend: record.history.map((price, index) => ({ date: `Day ${index + 1}`, price })) });
});

function isWeatherQuestion(question) {
  return /\b(weather|forecast|temperature|rain|raining|humidity|wind|hot|cold)\b|मौसम|तापमान|बारिश|वर्षा|बादल|हवामान|पाऊस|आर्द्रता/iu.test(question);
}

function extractWeatherLocation(question, defaultLocation) {
  const englishMatch = [...question.matchAll(/\b(?:in|at|near)\s+([^?!;]+)/gi)].pop();
  if (englishMatch) {
    const candidate = englishMatch[1]
      .replace(/\(([^)]*)\)/g, ", $1")
      .replace(/\b(?:today|tomorrow|right now|currently|this week|next week)\b.*$/i, "")
      .trim()
      .replace(/[,.]+$/, "");
    if (candidate) return candidate;
  }

  const hindiPatterns = [
    /([\p{L}][\p{L}\p{M}\s,.-]{1,70}?)\s+(?:का|की|चा|ची|चे)\s*(?:(?:आज|अभी|वर्तमान)\s*)?(?:मौसम|तापमान|बारिश|वर्षा|हवामान|पाऊस)/iu,
    /([\p{L}][\p{L}\p{M}\s,.-]{1,70}?)\s+में\s*(?:(?:आज|अभी|वर्तमान)\s*)?(?:मौसम|तापमान|बारिश|वर्षा|हवामान|पाऊस)/iu,
    /(?:मौसम|तापमान|बारिश|वर्षा|हवामान|पाऊस)[^।?!]{0,40}?(?:में|के लिए|के पास)\s*([\p{L}][\p{L}\p{M}\s,.-]{1,70})/iu
  ];
  for (const pattern of hindiPatterns) {
    const match = question.match(pattern);
    if (match?.[1]) {
      const candidate = match[1]
        .replace(/\(([^)]*)\)/g, ", $1")
        .replace(/^(?:(?:आज|अभी|वर्तमान|मुझे|बताइए|क्या)\s+)+/u, "")
        .trim();
      if (candidate) return candidate;
    }
  }

  return typeof defaultLocation === "string" ? defaultLocation.trim().slice(0, 120) : "";
}

function normalizePlaceName(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

const regionAliases = new Map([
  ["आंध्र प्रदेश", "andhra pradesh"], ["अरुणाचल प्रदेश", "arunachal pradesh"], ["असम", "assam"],
  ["बिहार", "bihar"], ["छत्तीसगढ़", "chhattisgarh"], ["गोवा", "goa"], ["गुजरात", "gujarat"],
  ["हरियाणा", "haryana"], ["हिमाचल प्रदेश", "himachal pradesh"], ["झारखंड", "jharkhand"],
  ["कर्नाटक", "karnataka"], ["केरल", "kerala"], ["मध्य प्रदेश", "madhya pradesh"],
  ["महाराष्ट्र", "maharashtra"], ["मणिपुर", "manipur"], ["मेघालय", "meghalaya"],
  ["मिजोरम", "mizoram"], ["नागालैंड", "nagaland"], ["ओडिशा", "odisha"], ["पंजाब", "punjab"],
  ["राजस्थान", "rajasthan"], ["सिक्किम", "sikkim"], ["तमिलनाडु", "tamil nadu"],
  ["तेलंगाना", "telangana"], ["त्रिपुरा", "tripura"], ["उत्तर प्रदेश", "uttar pradesh"],
  ["उत्तराखंड", "uttarakhand"], ["पश्चिम बंगाल", "west bengal"], ["दिल्ली", "delhi"],
  ["चंडीगढ़", "chandigarh"], ["जम्मू और कश्मीर", "jammu and kashmir"], ["लद्दाख", "ladakh"],
  ["पुडुचेरी", "puducherry"], ["अंडमान और निकोबार", "andaman and nicobar islands"],
  ["लक्षद्वीप", "lakshadweep"], ["दादरा और नगर हवेली और दमन और दीव", "dadra and nagar haveli and daman and diu"]
]);

function normalizeRegionName(value) {
  const normalized = normalizePlaceName(value);
  return regionAliases.get(normalized) || normalized;
}

function describeWeatherCode(code) {
  if (code === 0) return "clear sky";
  if (code <= 3) return "partly cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "drizzle or rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain showers";
  if (code >= 85 && code <= 86) return "snow showers";
  if (code >= 95) return "thunderstorms";
  return "unavailable";
}

async function fetchWeatherForLocation(requestedLocation) {
  const parts = requestedLocation.split(",").map((part) => part.trim()).filter(Boolean);
  const placeName = parts[0] || requestedLocation;
  const qualifier = parts.slice(1).join(" ");
  const geocodingUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geocodingUrl.searchParams.set("name", placeName);
  geocodingUrl.searchParams.set("count", "10");
  geocodingUrl.searchParams.set("language", "en");
  geocodingUrl.searchParams.set("format", "json");

  const geocodingResponse = await fetch(geocodingUrl, { signal: AbortSignal.timeout(10000) });
  if (!geocodingResponse.ok) throw new Error(`Open-Meteo geocoding returned HTTP ${geocodingResponse.status}.`);
  const geocoding = await geocodingResponse.json();
  let candidates = geocoding.results || [];
  if (qualifier) {
    const normalizedQualifier = normalizePlaceName(qualifier);
    candidates = candidates.filter((place) =>
      normalizePlaceName(`${place.admin1 || ""} ${place.admin2 || ""} ${place.country || ""}`).includes(normalizedQualifier)
    );
  } else {
    const exactMatches = candidates.filter((place) => normalizePlaceName(place.name) === normalizePlaceName(placeName));
    if (exactMatches.length) candidates = exactMatches;
  }

  if (!candidates.length && /[^\u0000-\u007f]/.test(requestedLocation)) {
    const osmUrl = new URL("https://nominatim.openstreetmap.org/search");
    osmUrl.searchParams.set("q", requestedLocation);
    osmUrl.searchParams.set("format", "jsonv2");
    osmUrl.searchParams.set("addressdetails", "1");
    osmUrl.searchParams.set("limit", "10");
    const osmResponse = await fetch(osmUrl, {
      headers: { "User-Agent": "SmartCropCare/1.0", "Accept-Language": "en" },
      signal: AbortSignal.timeout(10000)
    });
    if (!osmResponse.ok) throw new Error(`OpenStreetMap geocoding returned HTTP ${osmResponse.status}.`);
    const osmResults = await osmResponse.json();
    candidates = osmResults.map((result) => ({
      name: result.name || result.address?.town || result.address?.city || result.address?.village || requestedLocation,
      admin1: result.address?.state || result.address?.region || "",
      admin2: result.address?.state_district || result.address?.county || "",
      country: result.address?.country || "",
      latitude: Number(result.lat),
      longitude: Number(result.lon),
      population: result.type === "city" ? 1000000 : result.type === "town" ? 100000 : result.importance || 0
    })).filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
    if (qualifier) {
      const normalizedQualifier = normalizeRegionName(qualifier);
      candidates = candidates.filter((place) =>
        [place.admin1, place.admin2, place.country]
          .some((value) => normalizeRegionName(value || "").includes(normalizedQualifier))
      );
    }
  }

  if (!candidates.length) return { kind: "not-found", requestedLocation };

  const distinctAreas = new Set(candidates.map((place) => `${place.admin1 || ""}, ${place.country || ""}`));
  if (!qualifier && distinctAreas.size > 1) {
    return {
      kind: "ambiguous",
      requestedLocation,
      choices: candidates.slice(0, 5).map((place) => `${place.name}, ${[place.admin1, place.country].filter(Boolean).join(", ")}`)
    };
  }

  const place = candidates.sort((a, b) => (b.population || 0) - (a.population || 0))[0];
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", String(place.latitude));
  weatherUrl.searchParams.set("longitude", String(place.longitude));
  weatherUrl.searchParams.set("current", "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m");
  weatherUrl.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max");
  weatherUrl.searchParams.set("timezone", "auto");
  weatherUrl.searchParams.set("forecast_days", "7");

  const weatherResponse = await fetch(weatherUrl, { signal: AbortSignal.timeout(12000) });
  if (!weatherResponse.ok) throw new Error(`Open-Meteo forecast returned HTTP ${weatherResponse.status}.`);
  const payload = await weatherResponse.json();
  if (!payload.current || !payload.daily?.time?.length) throw new Error("Open-Meteo returned incomplete weather data.");

  return {
    kind: "weather",
    location: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
    timezone: payload.timezone,
    current: {
      time: payload.current.time,
      temperature: Math.round(payload.current.temperature_2m),
      feelsLike: Math.round(payload.current.apparent_temperature),
      humidity: payload.current.relative_humidity_2m,
      wind: Math.round(payload.current.wind_speed_10m),
      condition: describeWeatherCode(payload.current.weather_code)
    },
    forecast: payload.daily.time.map((date, index) => ({
      date,
      condition: describeWeatherCode(payload.daily.weather_code[index]),
      high: Math.round(payload.daily.temperature_2m_max[index]),
      low: Math.round(payload.daily.temperature_2m_min[index]),
      rainChance: payload.daily.precipitation_probability_max[index] ?? 0
    }))
  };
}

function formatLiveWeatherAnswer(weather, language) {
  const today = weather.forecast[0];
  const days = weather.forecast.slice(1, 4)
    .map((day) => `${day.date}: ${day.condition}, ${day.high}/${day.low}°C, rain chance ${day.rainChance}%`)
    .join("; ");
  if (language === "Hindi") {
    return `${weather.location} का ताज़ा मौसम (Open-Meteo, ${weather.current.time} ${weather.timezone}): तापमान ${weather.current.temperature}°C, महसूस ${weather.current.feelsLike}°C, ${weather.current.condition}, नमी ${weather.current.humidity}%, हवा ${weather.current.wind} किमी/घंटा। आज अधिकतम ${today.high}°C, न्यूनतम ${today.low}°C और बारिश की संभावना ${today.rainChance}% है। अगले दिनों का पूर्वानुमान: ${days}.`;
  }
  if (language === "Marathi") {
    return `${weather.location} येथील ताजे हवामान (Open-Meteo, ${weather.current.time} ${weather.timezone}): तापमान ${weather.current.temperature}°C, जाणवणारे ${weather.current.feelsLike}°C, ${weather.current.condition}, आर्द्रता ${weather.current.humidity}%, वारा ${weather.current.wind} किमी/तास. आज कमाल ${today.high}°C, किमान ${today.low}°C आणि पावसाची शक्यता ${today.rainChance}% आहे. पुढील दिवसांचा अंदाज: ${days}.`;
  }
  return `Live weather for ${weather.location} (Open-Meteo, ${weather.current.time} ${weather.timezone}): ${weather.current.temperature}°C, feels like ${weather.current.feelsLike}°C, ${weather.current.condition}, humidity ${weather.current.humidity}%, wind ${weather.current.wind} km/h. Today: high ${today.high}°C, low ${today.low}°C, rain chance ${today.rainChance}%. Forecast: ${days}.`;
}

app.post("/api/advisor", async (req, res) => {
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  const language = ["Hindi", "Marathi"].includes(req.body?.language) ? req.body.language : "English";
  if (!question) return res.status(400).json({ error: "Please enter a question." });
  if (question.length > 1000) return res.status(413).json({ error: "Question must be under 1,000 characters." });
  let weatherContext = "";
  if (isWeatherQuestion(question)) {
    const requestedLocation = extractWeatherLocation(question, req.body?.location);
    if (!requestedLocation) {
      const answer = language === "Hindi"
        ? "किस जगह का मौसम चाहिए? कृपया शहर और राज्य बताएं।"
        : language === "Marathi"
          ? "कोणत्या ठिकाणचे हवामान हवे आहे? कृपया शहर आणि राज्य सांगा."
          : "Which location should I check? Please include a town or city and state.";
      return res.json({ answer, source: "location" });
    }
    try {
      const weather = await fetchWeatherForLocation(requestedLocation);
      if (weather.kind === "not-found") {
        const answer = language === "Hindi"
          ? `${requestedLocation} नहीं मिला। कृपया शहर और राज्य का नाम जांचें।`
          : language === "Marathi"
            ? `${requestedLocation} सापडले नाही. कृपया शहर आणि राज्याचे नाव तपासा.`
            : `I couldn't find ${requestedLocation}. Please check the spelling or include the state or country.`;
        return res.json({ answer, source: "location" });
      }
      if (weather.kind === "ambiguous") {
        const answer = language === "Hindi"
          ? `${requestedLocation} नाम के कई स्थान मिले: ${weather.choices.join("; ")}। कृपया राज्य बताएं।`
          : language === "Marathi"
            ? `${requestedLocation} नावाची अनेक ठिकाणे सापडली: ${weather.choices.join("; ")}. कृपया राज्य सांगा.`
            : `I found several places called ${requestedLocation}: ${weather.choices.join("; ")}. Which state or country do you mean?`;
        return res.json({ answer, source: "location" });
      }
      weatherContext = `\n\nVerified live weather data from Open-Meteo (location: ${weather.location}; local time: ${weather.current.time} ${weather.timezone}): current ${weather.current.temperature}°C, feels like ${weather.current.feelsLike}°C, ${weather.current.condition}, humidity ${weather.current.humidity}%, wind ${weather.current.wind} km/h. Forecast: ${weather.forecast.map((day) => `${day.date}: ${day.condition}, high ${day.high}°C, low ${day.low}°C, rain chance ${day.rainChance}%`).join("; ")}. Use these live values to answer. Do not say you lack live weather access and do not invent weather values. Cite Open-Meteo as the source.`;
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ answer: formatLiveWeatherAnswer(weather, language), source: "live-weather" });
      }
    } catch (error) {
      console.error("Live weather lookup for assistant failed:", error);
      return res.status(502).json({ error: "I couldn't retrieve live weather for that location. Please try again shortly." });
    }
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    const answers = {
      English: "Check your local weather before spraying or irrigating, and confirm crop treatments with your nearest KVK or agriculture officer.",
      Hindi: "छिड़काव या सिंचाई से पहले स्थानीय मौसम जांचें और उपचार के लिए नजदीकी कृषि विज्ञान केंद्र या कृषि अधिकारी से सलाह लें।",
      Marathi: "फवारणी किंवा सिंचनापूर्वी स्थानिक हवामान तपासा आणि उपचारांसाठी जवळच्या कृषी विज्ञान केंद्राचा किंवा कृषी अधिकाऱ्यांचा सल्ला घ्या."
    };
    return res.json({ answer: answers[language], source: "sample" });
  }
  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const fallbackModel = "gemini-3.5-flash-lite";
    const requestModel = (modelName) => fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a helpful general-purpose assistant. Answer questions on any topic; do not refuse just because a question is unrelated to farming. Respond exclusively in ${language}, clearly and concisely, and acknowledge uncertainty when needed. For questions about farming, do not invent pesticide dosages or guarantee diagnoses; recommend a local KVK or agriculture officer for important local decisions.${weatherContext}\n\nQuestion: ${question}` }] }]
        }),
        signal: AbortSignal.timeout(12000)
      }
    );
    let activeModel = model;
    let response;
    try {
      response = await requestModel(activeModel);
    } catch (error) {
      if (
        activeModel === fallbackModel ||
        (error?.name !== "TimeoutError" && error?.name !== "AbortError")
      ) {
        throw error;
      }
      console.warn(`Gemini model ${activeModel} timed out; retrying with ${fallbackModel}.`);
      activeModel = fallbackModel;
      response = await requestModel(activeModel);
    }
    if (response.status === 503 && activeModel !== fallbackModel) {
      console.warn(`Gemini model ${activeModel} is busy; retrying with ${fallbackModel}.`);
      activeModel = fallbackModel;
      response = await requestModel(activeModel);
    }
    if (!response.ok) {
      const errorBody = await response.text();
      let providerMessage = "";
      try {
        providerMessage = JSON.parse(errorBody).error?.message || "";
      } catch {
        providerMessage = errorBody.slice(0, 500);
      }
      console.error("Gemini agronomist assistant request was rejected:", {
        status: response.status,
        model: activeModel,
        details: providerMessage
      });

      if (response.status === 400 || response.status === 401 || response.status === 403) {
        return res.status(503).json({
          error: "Gemini rejected the API key or model. Check GEMINI_API_KEY and GEMINI_MODEL in .env, then restart the server."
        });
      }
      if (response.status === 429) {
        return res.status(503).json({
          error: "Gemini's request limit has been reached. Check your Google AI Studio quota and try again later."
        });
      }
      return res.status(503).json({ error: "Gemini is temporarily unavailable. Please try again shortly." });
    }
    const payload = await response.json();
    const answer = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!answer) throw new Error("Empty Gemini answer");
    res.json({ answer, source: "gemini" });
  } catch (error) {
    console.error("Agronomist assistant failed:", error);
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      return res.status(504).json({ error: "Gemini and its backup model both timed out. Please try again shortly." });
    }
    res.status(502).json({ error: "Could not connect to Gemini. Check the server's internet connection and try again." });
  }
});

app.post("/api/diagnose", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in before checking your crop." });
  const crop = typeof req.body?.crop === "string" && req.body.crop.trim() ? req.body.crop.trim() : "Unknown";
  if (crop.length > 80) return res.status(400).json({ error: "Crop name must be 80 characters or fewer." });
  const language = ["Hindi", "Marathi"].includes(req.body?.language) ? req.body.language : "English";
  if (req.body?.saveHistory !== undefined && typeof req.body.saveHistory !== "boolean") {
    return res.status(400).json({ error: "Choose a valid diagnosis history preference." });
  }
  let diagnosis;
  let source = "sample";
  const image = typeof req.body?.image === "string" ? req.body.image : "";
  if (!process.env.GEMINI_API_KEY) {
    diagnosis = {
      disease: "Possible early blight",
      confidence: 82,
      severity: "Moderate",
      symptoms: "Brown spots with concentric rings can appear on older leaves.",
      organic: "Remove affected leaves and apply a locally approved neem-based product.",
      chemical: "Ask a local agriculture officer to recommend a registered fungicide.",
      prevention: "Rotate crops, keep leaves dry, and leave enough space for airflow.",
      note: "This is a screening result, not a laboratory diagnosis."
    };
  } else {
    const match = image.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return res.status(400).json({ error: "Upload a JPG, PNG, or WebP image to continue." });
    const imageBytes = Buffer.from(match[2], "base64");
    if (imageBytes.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: "Image must be smaller than 10 MB." });
    }
    try {
      const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
      const fallbackModel = "gemini-3.5-flash-lite";
      const requestDiagnosis = (modelName) => fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
          body: JSON.stringify({
            contents: [{ parts: [
              { text: `Carefully screen this plant image for visible crop health issues. Crop: ${crop}. Return only a JSON object in ${language} with disease, confidence (0-100), severity, symptoms, organic, chemical, prevention, and note. If the image is unclear or the diagnosis is uncertain, say so and use low confidence. Do not invent pesticide dosages. Advise local confirmation before any chemical treatment.` },
              { inline_data: { mime_type: `image/${match[1]}`, data: match[2] } }
            ] }],
            generationConfig: { responseMimeType: "application/json" }
          }),
          signal: AbortSignal.timeout(20000)
        }
      );
      let activeModel = model;
      let response;
      try {
        response = await requestDiagnosis(activeModel);
      } catch (error) {
        if (
          activeModel === fallbackModel ||
          (error?.name !== "TimeoutError" && error?.name !== "AbortError")
        ) {
          throw error;
        }
        console.warn(`Gemini diagnosis model ${activeModel} timed out; retrying with ${fallbackModel}.`);
        activeModel = fallbackModel;
        response = await requestDiagnosis(activeModel);
      }
      if ([429, 503].includes(response.status) && activeModel !== fallbackModel) {
        console.warn(`Gemini diagnosis model ${activeModel} returned HTTP ${response.status}; retrying with ${fallbackModel}.`);
        activeModel = fallbackModel;
        response = await requestDiagnosis(activeModel);
      }
      if (!response.ok) {
        const errorBody = await response.text();
        let providerMessage = "";
        try {
          providerMessage = JSON.parse(errorBody).error?.message || "";
        } catch {
          providerMessage = errorBody.slice(0, 500);
        }
        console.error("Gemini crop diagnosis request was rejected:", {
          status: response.status,
          model: activeModel,
          details: providerMessage
        });
        if ([429, 503].includes(response.status)) {
          return res.status(503).json({
            error: response.status === 429
              ? "Gemini diagnosis quota is exhausted for both models. Check your Google AI Studio quota and try again later."
              : "Gemini is temporarily overloaded. Please try the crop scan again shortly."
          });
        }
        if ([400, 401, 403].includes(response.status)) {
          return res.status(503).json({
            error: "Gemini rejected the diagnosis request. Check the API key, model access, and image format."
          });
        }
        return res.status(502).json({ error: "Gemini could not process this image. Please try another clear crop photo." });
      }
      const payload = await response.json();
      const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
      if (!text) throw new Error("Gemini returned an empty crop diagnosis.");
      diagnosis = JSON.parse(text);
      const textFields = ["disease", "severity", "symptoms", "organic", "chemical", "prevention", "note"];
      if (
        !diagnosis ||
        typeof diagnosis !== "object" ||
        textFields.some((field) => typeof diagnosis[field] !== "string" || !diagnosis[field].trim()) ||
        typeof diagnosis.confidence !== "number" ||
        !Number.isFinite(diagnosis.confidence) ||
        diagnosis.confidence < 0 ||
        diagnosis.confidence > 100
      ) {
        throw new Error("Gemini returned an incomplete or invalid crop diagnosis.");
      }
      source = "gemini";
    } catch (error) {
      console.error("Crop diagnosis failed:", error);
      if (error?.name === "TimeoutError" || error?.name === "AbortError") {
        return res.status(504).json({ error: "Gemini and its backup model both timed out. Please try the crop scan again." });
      }
      return res.status(502).json({ error: "Gemini could not complete the crop diagnosis. Please try another clear photo." });
    }
  }
  diagnosis.source = source;
  const prisma = getPrismaClient();
  if (req.body?.saveHistory !== false && prisma) {
    try {
      const record = await prisma.cropScanRecord.create({
        data: {
          userId: user.id,
          crop,
          disease: diagnosis.disease,
          confidence: diagnosis.confidence,
          severity: diagnosis.severity,
          symptoms: diagnosis.symptoms,
          remedies: [diagnosis.organic, diagnosis.chemical, diagnosis.prevention, diagnosis.note].join("\n\n")
        }
      });
      return res.json({ diagnosis, record: { ...record, createdAt: record.createdAt.toISOString() } });
    } catch (error) {
      console.error("Diagnosis history save failed:", error);
    }
  }
  res.json({ diagnosis });
});

app.get("/api/diagnoses", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to view scan history." });
  const prisma = getPrismaClient();
  const records = await prisma?.cropScanRecord.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json({ records: (records || []).map((record) => ({
    id: record.id,
    crop: record.crop,
    disease: record.disease,
    confidence: record.confidence,
    severity: record.severity,
    symptoms: record.symptoms,
    remedies: record.remedies,
    createdAt: record.createdAt.toISOString()
  })) });
});

app.get("/api/locations", async (req, res) => {
  const query = String(req.query.q || "").trim();
  const state = String(req.query.state || "").trim();
  const district = String(req.query.district || "").trim();
  if (query.length < 2 || query.length > 80) {
    return res.status(400).json({ error: "Enter a location search between 2 and 80 characters." });
  }
  if (!state) return res.status(400).json({ error: "Choose a valid Indian state or union territory." });
  try {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", query);
    url.searchParams.set("count", "100");
    url.searchParams.set("language", "en");
    url.searchParams.set("countryCode", "IN");
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Location provider HTTP ${response.status}`);
    const payload = await response.json();
    const results = (payload.results || [])
      .filter((place) =>
        place.country_code === "IN" &&
        place.admin1?.toLowerCase() === state.toLowerCase() &&
        (!district || place.admin2?.toLowerCase().includes(district.toLowerCase()))
      )
      .map((place) => ({
        name: place.name,
        district: place.admin2 || "",
        state: place.admin1,
        latitude: place.latitude,
        longitude: place.longitude
      }));
    res.json({ results });
  } catch (error) {
    console.error("Location search failed:", error);
    res.status(502).json({ error: "Location search is unavailable right now." });
  }
});

app.get("/api/labs", async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const radius = Number(req.query.radius || 25000);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return res.status(400).json({ error: "A valid farm latitude and longitude are required." });
  }
  if (![10000, 25000, 50000].includes(radius)) {
    return res.status(400).json({ error: "Choose a search radius of 10, 25, or 50 kilometres." });
  }
  const overpassQuery = `[out:json][timeout:8];nwr(around:${radius},${lat},${lon})[name~"soil|agricultur|krishi|laborator|testing lab|farm science|extension|KVK",i];out center tags;`;
  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({ data: overpassQuery })
    });
    if (!response.ok) throw new Error(`Map directory HTTP ${response.status}`);
    const payload = await response.json();
    const distanceKm = (toLat, toLon) => {
      const radians = (degrees) => degrees * Math.PI / 180;
      const dLat = radians(toLat - lat);
      const dLon = radians(toLon - lon);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(lat)) * Math.cos(radians(toLat)) * Math.sin(dLon / 2) ** 2;
      return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    const results = (payload.elements || [])
      .map((element) => {
        const placeLat = element.lat ?? element.center?.lat;
        const placeLon = element.lon ?? element.center?.lon;
        const name = element.tags?.name?.trim();
        if (!name || placeLat === undefined || placeLon === undefined) return null;
        const distance = distanceKm(placeLat, placeLon);
        const tags = element.tags || {};
        return {
          id: `${element.type}-${element.id}`,
          name,
          address: [tags["addr:street"], tags["addr:suburb"], tags["addr:city"] || tags["addr:town"] || tags["addr:village"], tags["addr:state"]].filter(Boolean).join(", "),
          distanceKm: Math.round(distance * 10) / 10,
          latitude: placeLat,
          longitude: placeLon,
          phone: tags.phone || tags["contact:phone"] || "",
          website: tags.website || tags["contact:website"] || "",
          mapUrl: `https://www.openstreetmap.org/?mlat=${placeLat}&mlon=${placeLon}#map=16/${placeLat}/${placeLon}`,
          directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLon}`,
          source: "OpenStreetMap"
        };
      })
      .filter((lab) => lab && lab.distanceKm <= radius / 1000)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 20);
    res.json({ results, radiusKm: radius / 1000, source: "OpenStreetMap", directoryUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`soil testing lab agricultural laboratory near ${lat},${lon}`)}` });
  } catch (error) {
    console.error("Nearby lab directory failed:", error);
    res.status(502).json({ error: "The nearby lab directory is temporarily unavailable." });
  }
});

app.post("/api/appointments", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in before requesting an appointment." });
  const { name = "", phone = "", crop = "", date = "", slot = "", lab = "", visitType = "lab" } = req.body || {};
  const validSlots = ["09:00-11:00", "11:00-13:00", "14:00-16:00"];
  if (!String(name).trim() || !/^[6-9]\d{9}$/.test(String(phone)) || !crop || !date || !validSlots.includes(slot) || !lab) {
    return res.status(400).json({ error: "Enter your name, valid mobile number, crop, date, time slot, and lab." });
  }
  if (user.phone !== phone) return res.status(400).json({ error: "Use the mobile number saved with your account." });
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured." });
  try {
    const token = `SC-${Date.now().toString().slice(-7)}`;
    const appointment = await prisma.soilTestBooking.create({
      data: {
        userId: user.id,
        crop,
        visitType: visitType === "pickup" ? "PICKUP" : "LAB_VISIT",
        date: new Date(`${date}T${slot.slice(0, 2)}:00:00`),
        lab,
        token
      }
    });
    res.status(201).json({ token: appointment.token, status: "confirmed", slot, persisted: true });
  } catch (error) {
    console.error("Appointment save failed:", error);
    res.status(500).json({ error: "We couldn't save your appointment. Please try again." });
  }
});

app.get("/api/mandi/alerts", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to view your price alerts." });
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured." });
  const alerts = await prisma.mandiPriceAlert.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ alerts });
});

app.post("/api/mandi/alerts", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to create a price alert." });
  const { crop, variety, state, district = "", market, direction, targetPrice } = req.body || {};
  if (!crop || !variety || !state || !market || !["ABOVE", "BELOW"].includes(direction) ||
      !Number.isInteger(targetPrice) || targetPrice < 1 || targetPrice > 10000000) {
    return res.status(400).json({ error: "Choose a mandi record, alert direction, and whole-number target price." });
  }
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured." });
  if (await prisma.mandiPriceAlert.count({ where: { userId: user.id } }) >= 50) {
    return res.status(409).json({ error: "You can save up to 50 price alerts." });
  }
  const existing = await prisma.mandiPriceAlert.findFirst({
    where: { userId: user.id, crop, variety, state, district, market, direction, targetPrice }
  });
  if (existing) return res.status(409).json({ error: "This price alert already exists." });
  const alert = await prisma.mandiPriceAlert.create({
    data: { userId: user.id, crop, variety, state, district, market, direction, targetPrice }
  });
  res.status(201).json({ alert });
});

app.delete("/api/mandi/alerts", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to delete a price alert." });
  const prisma = getPrismaClient();
  if (!prisma) return res.status(503).json({ error: "The database is not configured." });
  const result = await prisma.mandiPriceAlert.deleteMany({ where: { id: req.body?.id, userId: user.id } });
  if (!result.count) return res.status(404).json({ error: "Price alert not found." });
  res.json({ deleted: true });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(root, "dist")));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api/")) {
      return res.sendFile(path.join(root, "dist", "index.html"));
    }
    return next();
  });
}

app.listen(port, () => {
  console.log(`Express API listening on http://localhost:${port}`);
});
