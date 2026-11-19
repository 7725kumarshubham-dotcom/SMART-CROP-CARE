import { NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth";
import { getPrismaClient } from "@/backend/db";

function formatReminder(reminder: {
  id: string;
  title: string;
  crop: string | null;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}) {
  return {
    id: reminder.id,
    title: reminder.title,
    crop: reminder.crop,
    dueDate: reminder.dueDate.toISOString().slice(0, 10),
    completed: reminder.completed,
    createdAt: reminder.createdAt.toISOString()
  };
}

function parseBody(payload: unknown): Record<string, unknown> | null {
  return typeof payload === "object" && payload !== null && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : null;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to view your reminders." }, { status: 401 });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const reminders = await prisma.farmReminder.findMany({
      where: { userId: user.id },
      orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      take: 200
    });
    return NextResponse.json({ reminders: reminders.map(formatReminder) });
  } catch (error) {
    console.error("Farm reminders could not be loaded:", error);
    return NextResponse.json({ error: "We couldn't load your reminders. Please try again." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid reminder details." }, { status: 400 });
  }
  const body = parseBody(payload);
  if (!body) return NextResponse.json({ error: "Enter valid reminder details." }, { status: 400 });

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const crop = typeof body.crop === "string" ? body.crop.trim() : null;
  const dueDate = parseDate(body.dueDate);
  if (
    !title ||
    title.length > 120 ||
    (body.crop !== undefined && body.crop !== null && typeof body.crop !== "string") ||
    (crop !== null && (!crop || crop.length > 80)) ||
    !dueDate
  ) {
    return NextResponse.json(
      { error: "Enter a task, a valid due date, and an optional crop under 80 characters." },
      { status: 400 }
    );
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to save a reminder." }, { status: 401 });
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const reminder = await prisma.farmReminder.create({
      data: { userId: user.id, title, crop, dueDate }
    });
    return NextResponse.json({ reminder: formatReminder(reminder) }, { status: 201 });
  } catch (error) {
    console.error("Farm reminder could not be saved:", error);
    return NextResponse.json({ error: "We couldn't save your reminder. Please try again." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid reminder details." }, { status: 400 });
  }
  const body = parseBody(payload);
  if (!body || typeof body.id !== "string" || !body.id || typeof body.completed !== "boolean") {
    return NextResponse.json({ error: "Choose a reminder and its completion status." }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to update a reminder." }, { status: 401 });
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const result = await prisma.farmReminder.updateMany({
      where: { id: body.id, userId: user.id },
      data: { completed: body.completed }
    });
    if (result.count === 0) return NextResponse.json({ error: "Reminder not found." }, { status: 404 });
    return NextResponse.json({ id: body.id, completed: body.completed });
  } catch (error) {
    console.error("Farm reminder could not be updated:", error);
    return NextResponse.json({ error: "We couldn't update your reminder. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Choose a reminder to delete." }, { status: 400 });
  }
  const body = parseBody(payload);
  if (!body || typeof body.id !== "string" || !body.id) {
    return NextResponse.json({ error: "Choose a reminder to delete." }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to delete a reminder." }, { status: 401 });
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const result = await prisma.farmReminder.deleteMany({ where: { id: body.id, userId: user.id } });
    if (result.count === 0) return NextResponse.json({ error: "Reminder not found." }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Farm reminder could not be deleted:", error);
    return NextResponse.json({ error: "We couldn't delete your reminder. Please try again." }, { status: 500 });
  }
}
