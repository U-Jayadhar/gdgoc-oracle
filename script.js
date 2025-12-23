window.generatePrediction = async function () {
  const name = document.getElementById("name").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const year = document.getElementById("year").value.trim();
  const gender = document.getElementById("gender").value;
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

  try {
    const response = await fetch("/api/predict", {
      // Relative path is correct for Vercel
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, branch, year, gender, stat }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Server Error");
    }

    const data = await response.json();

    // Normalize keys in case the model slightly changes names
    const roast = data.error_log || data.roast || "No roast generated.";
    const suggestion =
      data.suggestion || data.tip || "No suggestion generated.";
    const fortune =
      data.prediction || data.fortune || "No prediction generated.";

    // DISPLAY RESULTS
    document.getElementById("input-form").style.display = "none"; // Hide form
    resultArea.style.display = "block"; // Show results

    document.getElementById("roast-text").innerText = roast;
    document.getElementById("suggestion-text").innerText = suggestion;
    document.getElementById("fortune-text").innerText = fortune;
  } catch (error) {
    console.error("App Error:", error);
    alert("SYSTEM FAILURE: Santa's firewall blocked the request. Try again.");

    // Reset button
    btn.disabled = false;
    btn.innerText = "Initialize Scan";
  }
};
