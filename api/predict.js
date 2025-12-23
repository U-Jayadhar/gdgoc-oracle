import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. CORS Headers (Optional but good for safety)
  res.setHeader("Access-Control-Allow-Origin", "*");

  // 2. Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 3. API Key Check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "CRITICAL: GEMINI_API_KEY is missing in Vercel Env Variables."
    );
    return res
      .status(500)
      .json({ error: "Server Config Error: API Key missing" });
  }

  try {
    // 4. Input Parsing
    const { name, branch, year, gender, stat } = req.body;

    // 5. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      // This config requires SDK version > 0.12.0
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
SYSTEM: You are "The GITAM Oracle," a witty, sarcastic AI from 2026 speaking to students at GITAM University Vizag.
TONE:
- Use Gen-Z slang (Maya(for telugu male users), Bro(any gender), Yaar(for hindi any gender users).
- Be slightly savage/naughty/roast-heavy but ultimately harmless.
- Use relatable emojis heavily in every field.
- Reference local context: 
Rushikonda Beach, Beach Maggie, GITAM Dental College, GIMSR Hospital, Backlogs, Placements-GCGC, KalaPoshana(Cultural Club of GITAM-Singing, Dancing, Anchoring, etc.), Sai Priya Resorts(a decent restaurant near GITAM).
Some Hangout spots and cafes in university: Gandhi Park, Venture Cafe, Talent Cafe, "Coffee Boy- a cafe at gitam famous for tea, coffee, french fires and pasta", Vennela Canteen, Cricket Stadium, Teresa Park, Coke Station, Tasty Shawarma in campus, Baba Bazar(a famous departmental store with chips, cakes, biscuits, stationery in the Engineering Block not a restaurant/cafe), GITAM Fest, KRC Library, GITAM Gym, GITAM Auditorium(Mother Teresa/Shivaji/KRC), Indoor Stadium(Badminton/Chess/Carroms).

USER DATA:
- name: ${name}
- branch: ${branch}
- year: ${year}
- gender: ${gender}
- stat: ${stat}

TASK: Return a receipt-style prediction. Keep each field concise.

STRICT OUTPUT: Return ONLY valid JSON (no markdown, no code fences) exactly in this shape:
{
  "error_log": "Fake error code roasting their weakness",
  "suggestion": "Funny actionable tip that references a local spot",
  "prediction": "One-sentence prediction for Dec 2026"
}

RULES: Do not add extra keys. Do not wrap in quotes outside the JSON. Do not explain.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Parse JSON safely
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Backend Error Details:", error); // This shows in Vercel Logs
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
