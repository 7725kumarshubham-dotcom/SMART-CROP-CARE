import { NextResponse } from "next/server";
import type { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/backend/auth";
import { getPrismaClient } from "@/backend/db";
import { getGeminiModel, getGeminiProviderError, getGeminiText } from "@/backend/gemini";

type Language = "English" | "Hindi" | "Marathi";
type DiagnosisData = {
  disease: string;
  confidence: number;
  severity: string;
  symptoms: string;
  organic: string;
  chemical: string;
  prevention: string;
  note: string;
};

const demoDiagnoses: Record<Language, DiagnosisData> = {
  English: {
    disease: "Possible early blight",
    confidence: 82,
    severity: "Moderate",
    symptoms: "Brown spots with concentric rings can appear on older leaves, often with a yellow halo.",
    organic: "Remove affected leaves, avoid wetting foliage, and apply a locally approved neem-based product.",
    chemical: "Ask a local agriculture officer to confirm the diagnosis and recommend a registered fungicide for your crop.",
    prevention: "Rotate crops, keep leaves dry, and leave enough space for air to circulate.",
    note: "This is a screening result, not a laboratory diagnosis. Confirm before applying any treatment."
  },
  Hindi: {
    disease: "अगेती झुलसा रोग होने की संभावना",
    confidence: 82,
    severity: "मध्यम",
    symptoms: "पुरानी पत्तियों पर पीले घेरे के साथ भूरे, गोलाकार छल्लों वाले धब्बे दिखाई दे सकते हैं।",
    organic: "प्रभावित पत्तियों को हटाएं, पत्तियों को गीला करने से बचें और स्थानीय रूप से स्वीकृत नीम-आधारित उत्पाद का उपयोग करें।",
    chemical: "निदान की पुष्टि के लिए स्थानीय कृषि अधिकारी से सलाह लें और अपनी फसल के लिए पंजीकृत फफूंदनाशक की सिफारिश पूछें।",
    prevention: "फसल चक्र अपनाएं, पत्तियों को सूखा रखें और हवा के आवागमन के लिए पौधों के बीच पर्याप्त जगह रखें।",
    note: "यह प्रारंभिक जांच का परिणाम है, प्रयोगशाला में किया गया निदान नहीं। कोई भी उपचार करने से पहले इसकी पुष्टि करें।"
  },
  Marathi: {
    disease: "अर्ली ब्लाइट रोगाची शक्यता",
    confidence: 82,
    severity: "मध्यम",
    symptoms: "जुन्या पानांवर पिवळ्या वलयासह तपकिरी, गोलाकार वलयांचे डाग दिसू शकतात.",
    organic: "बाधित पाने काढा, पानं ओली करणे टाळा आणि स्थानिक मान्यताप्राप्त कडुनिंब-आधारित उत्पादन वापरा.",
    chemical: "निदानाची खात्री करण्यासाठी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या आणि पिकासाठी नोंदणीकृत बुरशीनाशकाची शिफारस विचारा.",
    prevention: "पीक फेरपालट करा, पाने कोरडी ठेवा आणि हवा खेळती राहण्यासाठी रोपांमध्ये पुरेसे अंतर ठेवा.",
    note: "हा प्राथमिक तपासणीचा निकाल आहे, प्रयोगशाळेतील निदान नाही. कोणताही उपचार करण्यापूर्वी खात्री करा."
  }
};

function isDiagnosisData(value: unknown): value is DiagnosisData {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const diagnosis = value as Record<string, unknown>;
  const textFields = ["disease", "severity", "symptoms", "organic", "chemical", "prevention", "note"] as const;
  return !textFields.some((field) => typeof diagnosis[field] !== "string" || !diagnosis[field].trim()) &&
    typeof diagnosis.confidence === "number" &&
    Number.isFinite(diagnosis.confidence) &&
    diagnosis.confidence >= 0 &&
    diagnosis.confidence <= 100;
}

function parseDiagnosis(value: unknown): DiagnosisData {
  if (!isDiagnosisData(value)) throw new Error("The vision provider returned an invalid or incomplete diagnosis.");
  return value;
}

async function saveDiagnosis(
  prisma: PrismaClient,
  userId: string,
  crop: string,
  diagnosis: DiagnosisData
) {
  const record = await prisma.cropScanRecord.create({
    data: {
      userId,
      crop,
      disease: diagnosis.disease,
      confidence: diagnosis.confidence,
      severity: diagnosis.severity,
      symptoms: diagnosis.symptoms,
      remedies: [diagnosis.organic, diagnosis.chemical, diagnosis.prevention, diagnosis.note].join("\n\n")
    }
  });
  return {
    id: record.id,
    crop: record.crop,
    disease: record.disease,
    confidence: record.confidence,
    severity: record.severity,
    symptoms: record.symptoms,
    remedies: record.remedies,
    createdAt: record.createdAt.toISOString()
  };
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Please upload a valid crop image." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return NextResponse.json({ error: "Please upload a valid crop image." }, { status: 400 });
  }
  const body = payload as Record<string, unknown>;
  const image = typeof body.image === "string" ? body.image : "";
  const crop = typeof body.crop === "string" && body.crop.trim() ? body.crop.trim() : "Unknown";
  if (crop.length > 80 || (body.saveHistory !== undefined && typeof body.saveHistory !== "boolean")) {
    return NextResponse.json({ error: "Please provide a valid crop and history preference." }, { status: 400 });
  }
  const match = image.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    return NextResponse.json({ error: "Upload a JPG, PNG, or WebP image to continue." }, { status: 400 });
  }
  const imageBytes = Buffer.from(match[2], "base64");
  if (imageBytes.byteLength > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be smaller than 10 MB." }, { status: 413 });
  }
  const language =
    body.language === "Hindi" || body.language === "Marathi" ? body.language : "English";
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in before checking your crop." }, { status: 401 });
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "The database is not configured. Set DATABASE_URL and redeploy the app." }, { status: 503 });

  const apiKey = process.env.GEMINI_API_KEY;
  let diagnosis: DiagnosisData;
  let source: "sample" | "gemini";

  if (!apiKey) {
    diagnosis = demoDiagnoses[language];
    source = "sample";
  } else {
    try {
      const model = getGeminiModel();
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Inspect this plant image for crop health. Crop: ${crop}. Write every text value in the JSON in ${language} (including the disease name, severity, symptoms, recommendations, and note); do not use English unless ${language} is English. Return only JSON with disease, confidence (0-100), severity, symptoms, organic, chemical, prevention, and note. If uncertain, say so. Always advise local confirmation before chemical use.`
                  },
                  { inline_data: { mime_type: `image/${match[1]}`, data: match[2] } }
                ]
              }
            ],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      if (!response.ok) {
        const errorBody = await response.text();

        console.error("Gemini API error:", {
          status: response.status,
          model,
          details: errorBody.slice(0, 1500)
        });

        return NextResponse.json(
          { error: getGeminiProviderError(response.status) },
          { status: 503 }
        );
      }
      const text = getGeminiText(await response.json());
      if (!text) throw new Error("The vision provider returned an empty diagnosis.");
      diagnosis = parseDiagnosis(JSON.parse(text));
      source = "gemini";
    } catch (error) {
      console.error("Crop diagnosis request failed:", error);
      return NextResponse.json({ error: "Crop diagnosis is unavailable right now. Please try again later." }, { status: 502 });
    }
  }

  if (body.saveHistory === false) {
    return NextResponse.json({ diagnosis: { ...diagnosis, source } });
  }

  try {
    const record = await saveDiagnosis(prisma, user.id, crop, diagnosis);
    return NextResponse.json({ diagnosis: { ...diagnosis, source }, record });
  } catch (error) {
    console.error("Crop diagnosis history could not be saved:", error);
    return NextResponse.json({ error: "The diagnosis was generated, but could not be saved to your history." }, { status: 500 });
  }
}
