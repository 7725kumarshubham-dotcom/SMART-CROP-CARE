# Kisan Care 360

A mobile-friendly Smart Crop Care and Market Insights demo built with Next.js 16, TypeScript, Tailwind CSS 4, Prisma, Recharts, and Lucide icons.

## Run locally

1. Install Node.js 20.9 or newer.
2. Add your credentials to `.env` (a git-ignored local file). The app runs with sample data if optional API credentials are left blank.
3. Install dependencies and start the development server:

   ```powershell
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`.

The first visit opens a guest farm profile form. The profile is kept in browser local storage; no login or phone verification is performed in this demo.

## Optional live services

- Weather is fetched live from [Open-Meteo](https://open-meteo.com/) without an API key. To use OpenWeatherMap instead, set `OPENWEATHER_API_KEY` and enable One Call 3.0 access. The dashboard asks for your browser location when you choose **Use my location**; without that permission, it uses the Nashik default coordinates.
- `GEMINI_API_KEY`: create a key in [Google AI Studio](https://aistudio.google.com/apikey). It enables Gemini 2.5 Flash image screening and the agronomist assistant. Without a key, the screening and assistant return clearly marked demo responses. Confirm diagnoses with a qualified local agriculture professional before treatment.
- `DATA_GOV_IN_API_KEY` and `DATA_GOV_IN_RESOURCE_ID`: create an API key at [Data.gov.in](https://data.gov.in/) and use the resource ID for an Agmarknet/mandi-price dataset available to your key. Without both values, the app uses sample prices.
- `DATABASE_URL`: create a project in [Supabase](https://supabase.com/), then copy its PostgreSQL connection URI from **Project Settings → Database → Connection string → URI**. Replace any password placeholder locally. This enables persistent soil appointments and the Prisma database commands.

Provider errors are shown to the user rather than silently replaced with sample responses. The bundled Nashik sample weather is used only if a live forecast was saved in the browser and a later request cannot reach its provider.

## Database

The Prisma schema targets PostgreSQL and includes farmer profiles, soil bookings, crop scan records, mandi price history, and procurement items. Set `DATABASE_URL` in `.env`, then run:

```powershell
npm run db:generate
npm run db:push
npm run db:seed
```

Soil appointment requests are stored in PostgreSQL when `DATABASE_URL` is set. Without a database, the booking endpoint returns a demo confirmation token that is not persisted. For Vercel, add `DATABASE_URL` under the project's **Settings → Environment Variables** to enable persistent appointments; it can be omitted to use demo mode. The seed script adds 14 days of sample price history for wheat, rice, cotton, tomato, and potato.

## Included modules

- Dashboard with weather, farming forecast, advisory, and browser speech synthesis.
- State, district, and village/town farm location selection using Open-Meteo geocoding, with live weather at the selected coordinates.
- Installable PWA shell with offline page/static-asset caching and last-fetched weather saved in the browser.
- Crop photo screening with file validation and optional Gemini vision.
- Soil lab appointment requests and farm-location-based nearby facility search using OpenStreetMap, with map directions and a direct Google Maps search link.
- Mandi rates with crop, state, district, mandi, and text filters plus 50-record pagination. The no-key demo directory contains 288 clearly labelled sample rows (16 crops across 18 market locations); configure `DATA_GOV_IN_API_KEY` and `DATA_GOV_IN_RESOURCE_ID` in `.env` for records from the selected official Data.gov.in mandi resource.
- Acreage-based input calculator and field checklist.
- Demo farm-supplies catalog and text/voice agronomist assistant.

The application currently uses guest profiles rather than OTP/email authentication. Nearby lab search depends on public OpenStreetMap service availability and mapping coverage; listings are not accreditation-verified, so call a facility before visiting. If the public directory is unavailable, use the location-specific Google Maps search link. Lab availability, marketplace checkout, and soil health cards require verified provider integrations before real-world use.
