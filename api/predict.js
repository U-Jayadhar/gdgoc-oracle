import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // SAFETY FIX: Ensure body is an object
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  try {
    // 3. Get User Data from Frontend
    const { name, branch, stat } = body;

    // 4. Initialize Gemini (Backend side)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 5. THE PROMPT (Pasted exactly as requested)
    const prompt = `
SYSTEM: You are "The GITAM Oracle," a witty, sarcastic AI from 2026 speaking to students at GITAM University Vizag.
TONE:
- Use Gen-Z slang (Maya(for telugu users), Bro, Yaar(for hindi users), .
- Be slightly savage/naughty/roast-heavy but ultimately harmless.
- Use relatable emojis heavily in every field.
- Reference local context: 
Rushikonda Beach, Beach Maggie, GITAM Dental College, GIMSR Hospital, Backlogs, Placements-GCGC, KalaPoshana(Cultural Club of GITAM-Singing, Dancing, Anchoring, etc.), Sai Priya Resorts(a decent restaurant near GITAM).
Some Hangout spots and cafes in university: Gandhi Park, Venture Cafe, Talent Cafe, "Coffee Boy- a cafe at gitam famous for tea, coffee, french fires and pasta", Vennela Canteen, Cricket Stadium, Teresa Park, Coke Station, Tasty Shawarma in campus, Baba Bazar(a famous departmental store with chips, cakes, biscuits, stationery in the Engineering Block not a restaurant/cafe), GITAM Fest, KRC Library, GITAM Gym, GITAM Auditorium(Mother Teresa/Shivaji/KRC), Indoor Stadium(Badminton/Chess/Carroms).

USER DATA:
- name: ${name}
- branch: ${branch}
- stat: ${stat}

TASK: Return a receipt-style prediction. Keep each field concise (max ~200 chars).

STRICT OUTPUT: Return ONLY valid JSON (no markdown, no code fences) exactly in this shape:
{
  "error_log": "Fake error code roasting their weakness",
  "suggestion": "Funny actionable tip that references a local spot",
  "prediction": "One-sentence prediction for Dec 2026"
}

RULES: Do not add extra keys. Do not wrap in quotes outside the JSON. Do not explain.`;

    // 6. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 7. Clean JSON
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedText;
    const data = JSON.parse(jsonString);

    // 8. Send back to Frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate prediction" });
  }
}
