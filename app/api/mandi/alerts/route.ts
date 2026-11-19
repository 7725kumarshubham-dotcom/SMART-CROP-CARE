import { NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth";
import { getPrismaClient } from "@/backend/db";

function parseBody(payload: unknown): Record<string, unknown> | null {
  return typeof payload === "object" && payload !== null && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : null;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to view your price alerts." }, { status: 401 });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const alerts = await prisma.mandiPriceAlert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Mandi price alerts could not be loaded:", error);
    return NextResponse.json({ error: "We couldn't load your price alerts. Please try again." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid price alert details." }, { status: 400 });
  }
  const body = parseBody(payload);
  if (!body) return NextResponse.json({ error: "Enter valid price alert details." }, { status: 400 });

  const crop = typeof body.crop === "string" ? body.crop.trim() : "";
  const variety = typeof body.variety === "string" ? body.variety.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const district = typeof body.district === "string" ? body.district.trim() : "";
  const market = typeof body.market === "string" ? body.market.trim() : "";
  const direction = body.direction;
  const targetPrice = body.targetPrice;
  if (
    !crop || crop.length > 100 ||
    !variety || variety.length > 100 ||
    !state || state.length > 100 ||
    district.length > 100 ||
    !market || market.length > 100 ||
    (direction !== "ABOVE" && direction !== "BELOW") ||
    typeof targetPrice !== "number" ||
    !Number.isInteger(targetPrice) ||
    targetPrice < 1 ||
    targetPrice > 10000000
  ) {
    return NextResponse.json(
      { error: "Choose a mandi record, alert direction, and a whole-number target price." },
      { status: 400 }
    );
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to create a price alert." }, { status: 401 });
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const existingCount = await prisma.mandiPriceAlert.count({ where: { userId: user.id } });
    if (existingCount >= 50) {
      return NextResponse.json({ error: "You can save up to 50 price alerts." }, { status: 409 });
    }

    const existing = await prisma.mandiPriceAlert.findFirst({
      where: { userId: user.id, crop, variety, state, district, market, direction, targetPrice }
    });
    if (existing) return NextResponse.json({ error: "This price alert already exists." }, { status: 409 });

    const alert = await prisma.mandiPriceAlert.create({
      data: { userId: user.id, crop, variety, state, district, market, direction, targetPrice }
    });
    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error("Mandi price alert could not be saved:", error);
    return NextResponse.json({ error: "We couldn't save your price alert. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Choose a price alert to delete." }, { status: 400 });
  }
  const body = parseBody(payload);
  if (!body || typeof body.id !== "string" || !body.id) {
    return NextResponse.json({ error: "Choose a price alert to delete." }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to delete a price alert." }, { status: 401 });
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The local database is not configured." }, { status: 503 });

  try {
    const result = await prisma.mandiPriceAlert.deleteMany({
      where: { id: body.id, userId: user.id }
    });
    if (result.count === 0) return NextResponse.json({ error: "Price alert not found." }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Mandi price alert could not be deleted:", error);
    return NextResponse.json({ error: "We couldn't delete your price alert. Please try again." }, { status: 500 });
  }
}
