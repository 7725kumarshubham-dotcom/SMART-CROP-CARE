import { NextResponse } from "next/server";

const demoDiagnosis = {
  disease: "Possible early blight",
  confidence: 82,
  severity: "Moderate",
  symptoms: "Brown spots with concentric rings can appear on older leaves, often with a yellow halo.",
  organic: "Remove affected leaves, avoid wetting foliage, and apply a locally approved neem-based product.",
  chemical: "Ask a local agriculture officer to confirm the diagnosis and recommend a registered fungicide for your crop.",
  prevention: "Rotate crops, keep leaves dry, and leave enough space for air to circulate.",
  note: "This is a screening result, not a laboratory diagnosis. Confirm before applying any treatment."
};

export async function POST(request: Request) {
  let body: { image?: string; crop?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please upload a valid crop image." }, { status: 400 });
  }

  const match = body.image?.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    return NextResponse.json({ error: "Upload a JPG, PNG, or WebP image to continue." }, { status: 400 });
  }
  const imageBytes = Buffer.from(match[2], "base64");
  if (imageBytes.byteLength > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be smaller than 10 MB." }, { status: 413 });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ ...demoDiagnosis, source: "sample" });

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Inspect this plant image for crop health. Crop: ${body.crop || "unknown"}. Return only JSON with disease, confidence (0-100), severity, symptoms, organic, chemical, prevention, and note. If uncertain, say so. Always advise local confirmation before chemical use.`
                },
                { inline_data: { mime_type: `image/${match[1]}`, data: match[2] } }
              ]
            }
          ],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );
    if (!response.ok) throw new Error("The vision provider returned an unsuccessful response.");
    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("The vision provider returned an empty diagnosis.");
    return NextResponse.json({ ...JSON.parse(text), source: "gemini" });
  } catch (error) {
    console.error("Crop diagnosis request failed:", error);
    return NextResponse.json({ error: "Crop diagnosis is unavailable right now. Please try again later." }, { status: 502 });
  }
}
