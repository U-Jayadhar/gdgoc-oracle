# 🔮 The GDGoC Oracle 

![GDGoc Vizag](https://img.shields.io/badge/GDGoC-Vizag-4285F4?style=for-the-badge&logo=google-developers&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Powered_by-Gemini_Flash_Latest-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)

**"Scan the QR, get roasted by AI."**

This web application was built for the **GDGoC (Google Developer Group on Campus) Vizag** Christmas Event. It interacts with students, takes their branch/habits as input, and uses **Google Gemini Flash Latest** to generate a witty "Roast" and a "2026 Prediction" printed on a digital thermal receipt.

🔗 **Live Demo:** [https://gdgoc-oracle.ujayadhar.dev](https://gdgoc-oracle.ujayadhar.dev)

---

## ✨ Features

- **⚡ Powered by Gemini Flash Latest:** Uses the latest lightweight model for sub-2-second responses.
- **📍 Hyper-Local Context:** The AI is prompted with specific GITAM Vizag references (Rushikonda, Maggi, Backlogs, Baba Bazar, Coffee Boy).
- **🧾 Dynamic Receipt UI:** Generates a realistic thermal receipt layout with jagged edges and typewriter fonts.
- **🎭 Gen-Z Persona:** The AI acts as a "Savage Senior," using slang like _Maya, Bro, Cap,_ and _Sus_.
- **🔒 Client-Side Security:** API usage is secured via Google Cloud HTTP Referrer restrictions (no backend required).
- **🎨 Cyberpunk Aesthetic:** A neon-green on black terminal theme for the input phase.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Flexbox/Animations), Vanilla JavaScript (ES6+).
- **AI Integration:** Google Generative AI JavaScript SDK (`@google/generative-ai`).
- **Hosting:** Firebase Hosting (or GitHub Pages).
- **Model:** `gemini-flash-latest` with JSON enforcement.

---

## 🚀 How to Run Locally

This project uses a client-side API call, so you don't need a Node.js backend. However, you need a local server to handle ES6 modules.

1.  **Clone the Repository**

    ```bash
    git clone [https://github.com/ujayadhar/gitam-oracle.git](https://github.com/ujayadhar/gitam-oracle.git)
    cd gitam-oracle
    ```

2.  **Set up API Key**

    - Open `index.html`.
    - Find the line: `const API_KEY = "PASTE_YOUR_API_KEY_HERE";`
    - Replace it with your Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

3.  **Run with Live Server**
    - If using **VS Code**, install the "Live Server" extension.
    - Right-click `index.html` and select **"Open with Live Server"**.
    - The app should launch at `http://127.0.0.1:3000`.

---

## 🔐 Security Note

Since the API key is exposed in the client-side JavaScript, **Domain Restriction is mandatory** to prevent misuse.

1.  Go to **Google Cloud Console** > **APIs & Services** > **Credentials**.
2.  Edit your API Key.
3.  Set **Application Restrictions** to **Websites**.
4.  Add your domains:
    - `http://localhost:3000/*` (For testing)
    - `https://gdgoc-oracle.production.dev/*` (Production)

---

## 🧠 The Prompt Engineering

The magic lies in the system instruction passed to Gemini. We force the model to output **pure JSON** to ensure the receipt UI never breaks.


