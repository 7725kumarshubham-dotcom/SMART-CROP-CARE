import { NextResponse } from "next/server";
import { getGeminiModel, getGeminiProviderError, getGeminiText } from "@/backend/gemini";

const sampleReply =
  "I can help with that. Check your local weather before spraying or irrigating, and confirm crop treatments with your nearest Krishi Vigyan Kendra (KVK) or agriculture officer.";

export async function POST(request: Request) {
  let question: string;
  let language = "English";
  try {
    const body = await request.json();
    question = typeof body.question === "string" ? body.question.trim() : "";
    if (body.language === "Hindi" || body.language === "Marathi") language = body.language;
  } catch {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }
  if (!question) return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  if (question.length > 1000) return NextResponse.json({ error: "Question must be under 1,000 characters." }, { status: 413 });
  if (!process.env.GEMINI_API_KEY && language !== "English") {
    const sampleReply = language === "Hindi"
      ? "मैं आपकी मदद कर सकता हूँ। छिड़काव या सिंचाई से पहले स्थानीय मौसम जांचें और फसल उपचार के लिए नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से सलाह लें।"
      : "मी तुम्हाला मदत करू शकतो. फवारणी किंवा सिंचनापूर्वी स्थानिक हवामान तपासा आणि पीक उपचारांसाठी जवळच्या कृषी विज्ञान केंद्राचा (KVK) किंवा कृषी अधिकाऱ्यांचा सल्ला घ्या.";
    return NextResponse.json({ answer: sampleReply, source: "sample" });
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ answer: sampleReply, source: "sample" });

  try {
    const model = getGeminiModel();
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a careful agricultural information assistant for Indian farmers. Respond exclusively in ${language}, regardless of the language used in the question. Answer simply and concisely. Do not invent pesticide dosage or guarantee diagnoses; recommend a local KVK or agriculture officer when appropriate. Question: ${question}` }] }]
        })
      }
    );
    if (!response.ok) {
      console.error(`Gemini agronomist assistant request failed with HTTP ${response.status}.`);
      return NextResponse.json({ error: getGeminiProviderError(response.status) }, { status: 503 });
    }
    const answer = getGeminiText(await response.json());
    if (typeof answer !== "string" || !answer.trim()) throw new Error("The AI provider returned an empty answer.");
    return NextResponse.json({ answer, source: "gemini" });
  } catch (error) {
    console.error("Agronomist assistant request failed:", error);
    return NextResponse.json({ error: "The agronomist assistant is unavailable right now." }, { status: 502 });
  }
}
