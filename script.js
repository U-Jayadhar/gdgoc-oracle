// Helper function to create a delay
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

window.generatePrediction = async function () {
  const name = document.getElementById("name").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const year = document.getElementById("year").value.trim();
  const gender = document.getElementById("gender").value;
  const stat = document.getElementById("stat").value;

  const btn = document.getElementById("predict-btn");
  const resultArea = document.getElementById("result-area");

  // Basic Validation
  if (!name || !branch || !year) {
    alert("ERROR: Please fill in Name, Department, and Year.");
    return;
  }

  // UI Updates: Disable button & Show Loading
  btn.disabled = true;
  btn.innerHTML = `Decrypting Future <span class="loader"></span>`;

  // --- RETRY LOGIC VARIABLES ---
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, branch, year, gender, stat }),
      });

      // Specific check for Rate Limit (429) to trigger retry
      if (response.status === 429) {
        throw new Error("RATE_LIMIT");
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server Error");
      }

      const data = await response.json();

      // Normalize keys
      const roast = data.error_log || data.roast || "No roast generated.";
      const suggestion =
        data.suggestion || data.tip || "No suggestion generated.";
      const fortune =
        data.prediction || data.fortune || "No prediction generated.";

      // 1. DISPLAY SCREEN RESULTS (Cyberpunk UI)
      document.getElementById("input-form").style.display = "none";
      resultArea.style.display = "block";

      document.getElementById("roast-text").innerText = roast;
      document.getElementById("suggestion-text").innerText = suggestion;
      document.getElementById("fortune-text").innerText = fortune;

      // 2. POPULATE HIDDEN THERMAL RECEIPT (For Printing)
      document.getElementById("r-name").innerText = name
        .substring(0, 18)
        .toUpperCase();
      document.getElementById("r-dept").innerText = branch
        .substring(0, 6)
        .toUpperCase();
      document.getElementById("r-year").innerText = year.substring(0, 10);

      document.getElementById("r-roast").innerText = roast;
      document.getElementById("r-suggestion").innerText = suggestion;
      document.getElementById("r-fortune").innerText = fortune;

      // SUCCESS: Exit the function immediately
      return;
    } catch (error) {
      attempts++;
      console.warn(`Attempt ${attempts} failed: ${error.message}`);

      // If it's a Rate Limit error and we have attempts left, wait and retry
      if (error.message === "RATE_LIMIT" && attempts < maxAttempts) {
        btn.innerHTML = `Server Busy... Retrying (${attempts}/${maxAttempts})`;
        await wait(2000); // Wait 2 seconds
      } else {
        // FINAL FAILURE (After 3 tries or non-retriable error)
        console.error("Final App Error:", error);

        let errorMsg = "SYSTEM FAILURE: Santa's firewall blocked the request.";
        if (error.message === "RATE_LIMIT") {
          errorMsg =
            "Server is overloaded with too many requests! Please wait 10 seconds.";
        }

        alert(errorMsg);

        // Reset button
        btn.disabled = false;
        btn.innerText = "Initialize Scan";
        return; // Exit loop
      }
    }
  }
};

// --- NEW FUNCTION: DOWNLOAD RECEIPT IMAGE ---
window.downloadReceipt = function () {
  const receiptElement = document.getElementById("thermal-receipt");

  if (!receiptElement) {
    alert("Error: Receipt template not found!");
    return;
  }

  // Use html2canvas to capture the hidden div
  // We force scale: 1 to respect the 370px width limit
  html2canvas(receiptElement, {
    scale: 3, // higher scale for better clarity
    backgroundColor: "#ffffff",
    logging: false,
    useCORS: true,
  })
    .then((canvas) => {
      // Create download link
      const link = document.createElement("a");
      const name = document.getElementById("name").value.trim();
      //   date in filename as YYYY-MM-DD-HHMMSS
      const now = new Date();
      const formattedDate = now
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-");
      link.download = `ORACLE_${name}_${formattedDate}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    })
    .catch((err) => {
      console.error("Screenshot failed:", err);
      alert("Could not generate receipt image.");
    });
};
