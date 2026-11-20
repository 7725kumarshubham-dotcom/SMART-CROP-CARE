import { NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth";
import { getPrismaClient } from "@/backend/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to view your diagnosis history." }, { status: 401 });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The database is not configured. Set DATABASE_URL and redeploy the app." }, { status: 503 });

  try {
    const records = await prisma.cropScanRecord.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        crop: true,
        disease: true,
        confidence: true,
        severity: true,
        symptoms: true,
        remedies: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    return NextResponse.json({
      records: records.map((record) => ({ ...record, createdAt: record.createdAt.toISOString() }))
    });
  } catch (error) {
    console.error("Crop diagnosis history could not be loaded:", error);
    return NextResponse.json({ error: "We couldn't load your diagnosis history. Please try again." }, { status: 500 });
  }
}
