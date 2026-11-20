# Kisan Care 360

A mobile-friendly Smart Crop Care and Market Insights demo built with Next.js 16, TypeScript, Tailwind CSS 4, Prisma, Recharts, and Lucide icons.

## Project layout

- `frontend/`: reusable screens, dashboard UI, and client-safe location data.
- `backend/`: authentication/database helpers, backend sample data, and Mandi sync job.
- `database/`: Prisma schema and seed script.
- `app/`: Next.js route pages, styles, and API route handlers. These entry points stay here because Next.js discovers routes from `app/`.
- `public/`: static assets.

## Run locally

1. Install Node.js 20.9 or newer.
2. Create a PostgreSQL database (for example, on Neon), then copy `.env.example` to `.env` and set `DATABASE_URL` to its pooled connection URL and `DIRECT_URL` to its direct connection URL. Keep both values private.
3. In the VS Code terminal, run:

   ```powershell
   npm install
   npm run db:generate
   npm run db:push
   npm run dev
   ```

4. Open `http://localhost:3000`.

The first visit opens a welcome screen. Create an email/password account or sign in to open the dashboard. Authentication does not use confirmation emails or SMTP.

## Authentication

Accounts and session-token hashes are stored in PostgreSQL. Passwords are hashed with bcrypt, and the random session token is sent in an HTTP-only, same-site cookie. Sessions last seven days. The dashboard and appointment endpoint require a valid session.

Create-account requires a full name, 10-digit Indian mobile number, email, and a password of at least eight characters containing a letter and a number. No email verification is sent. The forgot-password screen explains that accounts cannot use email recovery; ask the database administrator to reset the account if needed.

## Optional live services

- Weather is fetched live from [Open-Meteo](https://open-meteo.com/) without an API key. To use OpenWeatherMap instead, set `OPENWEATHER_API_KEY` and enable One Call 3.0 access. The dashboard asks for your browser location when you choose **Use my location**; without that permission, it uses the Nashik default coordinates.
- `GEMINI_API_KEY`: create a key in [Google AI Studio](https://aistudio.google.com/apikey). It enables image screening and the agronomist assistant. `GEMINI_MODEL` selects the Gemini model used by both features. Without a key, the screening and assistant return clearly marked demo responses. Confirm diagnoses with a qualified local agriculture professional before treatment.
- `DATA_GOV_IN_API_KEY` and `DATA_GOV_IN_RESOURCE_ID`: create an API key at [Data.gov.in](https://data.gov.in/) and use the resource ID for an Agmarknet/mandi-price dataset available to your key. Without both values, the app uses sample prices.
- `DATABASE_URL`: pooled PostgreSQL connection URL used by the app.
- `DIRECT_URL`: unpooled PostgreSQL connection URL used by Prisma schema commands.

## Deploying on Vercel

Create a PostgreSQL database with Neon, then add `DATABASE_URL` (the pooled URL) and `DIRECT_URL` (the direct URL) in the Vercel project's environment variables for each environment you deploy. Run `npm run db:push` locally with those values in `.env` to create the tables in the database, then redeploy on Vercel. Do not expose either URL in client-side code or commit them to the repository.

The app's prior local SQLite database is not copied to PostgreSQL automatically. Existing local accounts and records remain in the SQLite files and require a separate migration if they need to be retained.

Provider errors are shown to the user rather than silently replaced with sample responses. The bundled Nashik sample weather is used only if a live forecast was saved in the browser and a later request cannot reach its provider.

## Database

The Prisma schema in `database/schema.prisma` targets PostgreSQL and includes users/sessions, farmer profiles, crop diary entries, farm reminders, Mandi price alerts, soil bookings, crop scan records, Mandi price history, official quotes, and procurement items. Running `npm run db:push` creates or updates these tables in the database configured by `DIRECT_URL`.

Soil appointment requests, crop diary entries, reminders, price alerts, and crop scan records are stored in PostgreSQL. The seed command is optional and only adds missing sample records; it leaves existing Mandi history and procurement items unchanged.

## Included modules

- Dashboard with weather, farming forecast, advisory, and browser speech synthesis.
- State, district, and village/town farm location selection using Open-Meteo geocoding, with live weather at the selected coordinates.
- Installable PWA shell with offline page/static-asset caching and last-fetched weather saved in the browser.
- Crop photo screening with file validation, optional Gemini vision, and per-account diagnosis history. Uploaded photos are not stored in history.
- Personal crop diary for recording dated field activities and notes.
- Per-account farm reminders with due dates, overdue status, completion, and deletion.
- Government scheme finder with searchable central agriculture programs and official links, plus the myScheme portal for state-specific discovery. The app does not determine eligibility or submit applications; users should verify current terms and deadlines with official sources.
- Soil lab appointment requests and farm-location-based nearby facility search using OpenStreetMap, with map directions and a direct Google Maps search link.
- Mandi rates with crop, state, district, mandi, and text filters plus 50-record pagination, and per-account price alerts checked against matching prices currently loaded in the market view. Alerts do not send background or phone notifications. The no-key demo directory contains 288 clearly labelled sample rows (16 crops across 18 market locations); configure `DATA_GOV_IN_API_KEY` and `DATA_GOV_IN_RESOURCE_ID` in `.env` for records from the selected official Data.gov.in mandi resource.
- Acreage-based input calculator and field checklist.
- Demo farm-supplies catalog and text/voice agronomist assistant.

Farmers sign in with email/password authentication. Farm details continue to work with the existing browser profile and are kept separately per signed-in email. Nearby lab search depends on public OpenStreetMap service availability and mapping coverage; listings are not accreditation-verified, so call a facility before visiting. If the public directory is unavailable, use the location-specific Google Maps search link. Lab availability, marketplace checkout, and soil health cards require verified provider integrations before real-world use.

## Daily Mandi history

Use the PostgreSQL URLs from `.env`, then create the tables and collect the first day of official Mandi records:

```powershell
npm run db:push
npm run mandi:sync
```

Run `npm run mandi:sync` once each day using Windows Task Scheduler. The trend chart uses saved daily records once at least two dates have been collected. `MANDI_SYNC_LIMIT` controls how many current official records are saved per run (default 1000).
Deployment update for SMART-CROP-CARE
