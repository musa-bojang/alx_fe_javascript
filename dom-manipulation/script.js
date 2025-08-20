document.addEventListener("DOMContentLoaded", () => {
  // ----- Storage keys -----
  const LS_KEY = "quotesList";
  const SS_LAST_INDEX = "lastViewedQuoteIndex";

  // ----- Default quotes (used if no localStorage yet) -----
  let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];

  // ----- Elements -----
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const exportBtn = document.getElementById("exportJson");
  const importBtn = document.getElementById("importJsonBtn");
  const importFileInput = document.getElementById("importFile");
  const clearStorageBtn = document.getElementById("clearStorage");

  // ===== Helpers =====
  function saveQuotes() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(quotes));
    } catch (e) {
      console.error("Failed to save quotes:", e);
      alert("Could not save to Local Storage (maybe it’s full or blocked).");
    }
  }

  function loadQuotes() {
    try {
      const data = localStorage.getItem(LS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) quotes = parsed;
      }
    } catch (e) {
      console.warn("Local Storage had invalid JSON; resetting.", e);
      localStorage.removeItem(LS_KEY);
    }
  }

  function setLastViewedIndex(i) {
    sessionStorage.setItem(SS_LAST_INDEX, String(i));
  }
  function getLastViewedIndex() {
    const v = sessionStorage.getItem(SS_LAST_INDEX);
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 && n < quotes.length ? n : null;
  }

  // ===== UI updates (using innerHTML as requested) =====
  function renderQuoteByIndex(index) {
    const q = quotes[index];
    quoteDisplay.innerHTML = `
      <p>"${q.text.replace(/"/g, "&quot;")}"</p>
      <div class="category">— ${q.category}</div>
    `;
    setLastViewedIndex(index);
  }

  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = `<p>No quotes yet. Add one below.</p>`;
      return;
    }
    const i = Math.floor(Math.random() * quotes.length);
    renderQuoteByIndex(i);
  }

  // Create the "Add Quote" form dynamically (innerHTML)
  function createAddQuoteForm() {
    const formDiv = document.createElement("div");
    formDiv.id = "addQuoteForm";
    formDiv.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteBtn">Add Quote</button>
    `;
    document.body.appendChild(formDiv);

    const addBtn = document.getElementById("addQuoteBtn");
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    addBtn.addEventListener("click", () => {
      const text = textInput.value.trim();
      const cat = categoryInput.value.trim();
      if (!text || !cat) {
        alert("Please enter both a quote and a category.");
        return;
      }
      quotes.push({ text, category: cat });
      saveQuotes();
      // show the just-added quote
      renderQuoteByIndex(quotes.length - 1);
      textInput.value = "";
      categoryInput.value = "";
    });
  }

  // ===== Export / Import (JSON) =====
  function exportToJson() {
    try {
      const json = JSON.stringify(quotes, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "quotes-export.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
      alert("Export failed. See console for details.");
    }
  }

  function validateImportedQuotes(arr) {
    return Array.isArray(arr) && arr.every(
      (q) => q && typeof q.text === "string" && typeof q.category === "string"
    );
  }

  function importFromJsonFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!validateImportedQuotes(imported)) {
          alert("Invalid JSON format. Expect an array of { text, category } objects.");
          return;
        }
        quotes.push(...imported);
        saveQuotes();
        // Show last imported quote
        renderQuoteByIndex(quotes.length - 1);
        alert("Quotes imported successfully!");
      } catch (err) {
        console.error("Import failed:", err);
        alert("Failed to parse JSON file.");
      } finally {
        // reset input value so the same file can be re-imported if needed
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  // Expose import function globally to match inline onchange handler in HTML
  window.importFromJsonFile = importFromJsonFile;

  // ===== Wire up events =====
  newQuoteBtn.addEventListener("click", showRandomQuote);
  exportBtn.addEventListener("click", exportToJson);
  importBtn.addEventListener("click", () => importFileInput.click());
  clearStorageBtn.addEventListener("click", () => {
    localStorage.removeItem(LS_KEY);
    alert("Local Storage cleared. Default quotes will load next time.");
  });

  // ===== Init =====
  loadQuotes();

  // Prefer last viewed quote (sessionStorage), otherwise random
  const lastIdx = getLastViewedIndex();
  if (lastIdx !== null) {
    renderQuoteByIndex(lastIdx);
  } else {
    showRandomQuote();
  }

  createAddQuoteForm(); // build the form dynamically
});
