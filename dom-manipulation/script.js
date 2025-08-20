document.addEventListener("DOMContentLoaded", () => {
  // Load quotes from localStorage or use defaults
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const body = document.body;

  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Show random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuote(quotes[randomIndex]);
  }

  // Display a quote (with innerHTML)
  function displayQuote(quote) {
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <div class="category">— ${quote.category}</div>
    `;
    // Save last viewed quote in sessionStorage
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  }

  // Populate categories in dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map(q => q.category))]; // <-- using map

    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  // Filter quotes by category
  function filterQuotes(category) {
    if (category === "all") {
      showRandomQuote();
    } else {
      const filtered = quotes.filter(q => q.category === category);
      if (filtered.length > 0) {
        displayQuote(filtered[Math.floor(Math.random() * filtered.length)]);
      } else {
        quoteDisplay.innerHTML = `<p>No quotes found in this category.</p>`;
      }
    }
  }

  // Create add quote form
  function createAddQuoteForm() {
    const formDiv = document.createElement("div");
    formDiv.id = "addQuoteForm";

    formDiv.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addBtn">Add Quote</button>
    `;

    body.appendChild(formDiv);

    const addBtn = document.getElementById("addBtn");
    addBtn.addEventListener("click", () => {
      const newText = document.getElementById("newQuoteText").value.trim();
      const newCategory = document.getElementById("newQuoteCategory").value.trim();

      if (newText && newCategory) {
        const newQuote = { text: newText, category: newCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        displayQuote(newQuote);

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
      } else {
        alert("Please enter both a quote and a category!");
      }
    });
  }

  // JSON Export
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // JSON Import
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Attach event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);

  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    filterQuotes(e.target.value);
  });

  // On load: restore last session quote or show random
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    displayQuote(JSON.parse(lastQuote));
  } else {
    showRandomQuote();
  }

  createAddQuoteForm();
  populateCategories();
});
