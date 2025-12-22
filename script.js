// 1. Import Google AI SDK via CDN
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 2. CONFIGURATION
// REPLACE THIS STRING WITH YOUR ACTUAL KEY FROM STEP 1
const API_KEY = "AIzaSyCyczdNG0eI8mD85WIDp5K7MVYdTF7MxhM";

const genAI = new GoogleGenerativeAI(API_KEY);
// Using "flash" for speed. If you want the "Thinking" model, use "gemini-2.5-flash-preview"
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// 3. MAIN FUNCTION
window.generatePrediction = async function () {
  const name = document.getElementById("name").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const stat = document.getElementById("stat").value;
  const btn = document.getElementById("predict-btn");
  const resultArea = document.getElementById("result-area");

  // Basic Validation
  if (!name || !branch) {
    alert("ERROR: Input fields cannot be empty. Identity required.");
    return;
  }

  // UI Updates: Disable button & Show Loading
  btn.disabled = true;
  btn.innerHTML = `Decrypting Future <span class="loader"></span>`;

  // 4. THE PROMPT ENGINEERING
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

  try {
    // 5. CALL GEMINI API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. CLEAN & PARSE JSON
    // Sometimes AI adds '''json at start, we remove it
    const cleanedText = text.replace(/```json|```/g, "").trim();
    // Fallback: grab first JSON object if model adds text around it
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedText;
    const data = JSON.parse(jsonString);

    // Normalize keys in case the model slightly changes names
    const roast = data.error_log || data.roast || "No roast generated.";
    const suggestion = data.suggestion || data.tip || "No suggestion generated.";
    const fortune = data.prediction || data.fortune || "No prediction generated.";

    // 7. DISPLAY RESULTS
    document.getElementById("input-form").style.display = "none"; // Hide form
    resultArea.style.display = "block"; // Show results

    // Typing effect could go here, but simple text is faster for stalls
    document.getElementById("roast-text").innerText = roast;
    document.getElementById("suggestion-text").innerText = suggestion;
    document.getElementById("fortune-text").innerText = fortune;
  } catch (error) {
    console.error("API Error:", error);
    alert("SYSTEM FAILURE: Santa's firewall blocked the request. Try again.");
    // Reset button
    btn.disabled = false;
    btn.innerText = "Initialize Scan";
  }
};
