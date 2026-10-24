import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  let body: {
    name?: string;
    phone?: string;
    crop?: string;
    visitType?: string;
    date?: string;
    slot?: string;
    lab?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please complete the booking form." }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const phone = body.phone ?? "";
  const crop = body.crop ?? "";
  const date = body.date ?? "";
  const slot = body.slot ?? "";
  const lab = body.lab ?? "";
  const validSlots = ["09:00-11:00", "11:00-13:00", "14:00-16:00"];
  if (!name || !/^[6-9]\d{9}$/.test(phone) || !crop || !date || !validSlots.includes(slot) || !lab) {
    return NextResponse.json(
      { error: "Enter your name, a valid 10-digit Indian mobile number, crop, date, time slot, and lab." },
      { status: 400 }
    );
  }

  const token = `SC-${Date.now().toString().slice(-7)}`;
  if (process.env.DATABASE_URL) {
    try {
      const user = await prisma.user.upsert({
        where: { phone },
        update: { name },
        create: { phone, name }
      });
      const appointment = await prisma.soilTestBooking.create({
        data: {
          userId: user.id,
          crop,
          visitType: body.visitType === "pickup" ? "PICKUP" : "LAB_VISIT",
          date: new Date(`${date}T${slot.slice(0, 2)}:00:00`),
          lab,
          token
        }
      });
      return NextResponse.json({ token: appointment.token, status: "confirmed", slot, persisted: true });
    } catch (error) {
      console.error("Soil appointment could not be saved:", error);
      return NextResponse.json({ error: "We couldn't save your appointment. Please try again." }, { status: 500 });
    }
  }

  return NextResponse.json({ token, status: "confirmed", slot, persisted: false });
}
