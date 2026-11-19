import { NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth";
import { getPrismaClient } from "@/backend/db";

const activities = ["Sowing", "Irrigation", "Fertilizing", "Spraying", "Weeding", "Harvest", "Other"];

function formatEntry(entry: {
  id: string;
  crop: string;
  activity: string;
  date: Date;
  notes: string;
  createdAt: Date;
}) {
  return {
    id: entry.id,
    crop: entry.crop,
    activity: entry.activity,
    date: entry.date.toISOString().slice(0, 10),
    notes: entry.notes,
    createdAt: entry.createdAt.toISOString()
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to view your crop diary." }, { status: 401 });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const entries = await prisma.cropDiaryEntry.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 100
    });
    return NextResponse.json({ entries: entries.map(formatEntry) });
  } catch (error) {
    console.error("Crop diary entries could not be loaded:", error);
    return NextResponse.json({ error: "We couldn't load your crop diary. Please try again." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid crop diary details." }, { status: 400 });
  }
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return NextResponse.json({ error: "Enter valid crop diary details." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const crop = typeof body.crop === "string" ? body.crop.trim() : "";
  const activity = typeof body.activity === "string" ? body.activity : "";
  const date = typeof body.date === "string" ? body.date : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  const entryDate = new Date(`${date}T00:00:00.000Z`);

  if (
    !crop ||
    crop.length > 80 ||
    !activities.includes(activity) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(entryDate.getTime()) ||
    entryDate.toISOString().slice(0, 10) !== date ||
    (body.notes !== undefined && typeof body.notes !== "string") ||
    notes.length > 1000
  ) {
    return NextResponse.json(
      { error: "Enter a crop, valid activity, date, and notes under 1,000 characters." },
      { status: 400 }
    );
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to save a crop diary entry." }, { status: 401 });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const entry = await prisma.cropDiaryEntry.create({
      data: { userId: user.id, crop, activity, date: entryDate, notes }
    });
    return NextResponse.json({ entry: formatEntry(entry) }, { status: 201 });
  } catch (error) {
    console.error("Crop diary entry could not be saved:", error);
    return NextResponse.json({ error: "We couldn't save your crop diary entry. Please try again." }, { status: 500 });
  }
}
