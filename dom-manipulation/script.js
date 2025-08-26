document.addEventListener("DOMContentLoaded", () => {
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];

  const body = document.body;
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const exportBtn = document.getElementById("exportBtn");
  const categoryFilter = document.getElementById("categoryFilter");
  const formDiv = document.createElement("div");
  formDiv.id = "addQuoteForm";
  formDiv.innerHTML = `
       <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
       <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
       <button id="addBtn">Add Quote</button>
     `;
  body.appendChild(formDiv);
  const addBtn = document.getElementById("addBtn");

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = `<em>No quotes available.</em>`;
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" <div class="category">— ${randomQuote.category}</div>`;
  }

  function populateCategories() {
    let categories = [...new Set(quotes.map(q => q.category))];

    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      let option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    let savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory && [...categoryFilter.options].some(opt => opt.value === savedCategory)) {
      categoryFilter.value = savedCategory;
    }
  }

  function filterQuotes() {
    let selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);

    let filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = `<em>No quotes in this category.</em>`;
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" <div class="category">— ${randomQuote.category}</div>`;
  }

  function createAddQuoteForm() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText && newCategory) {
      quotes.push({ text: newText, category: newCategory });
      saveQuotes();
      populateCategories();
      quoteDisplay.innerHTML = `"${newText}" <div class="category">— ${newCategory}</div>`;
      categoryFilter.value = newCategory;
      localStorage.setItem("selectedCategory", newCategory);
      textInput.value = "";
      categoryInput.value = "";
    } else {
      alert("Please enter both a quote and a category!");
    }
  }

  function exportJsonBtn() {
    let jsonStr = JSON.stringify(quotes, null, 2);
    let blob = new Blob([jsonStr], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const importFile = document.getElementById("importFile");
  importFile.addEventListener("change", (e) => {
    const fileReader = new FileReader();
    fileReader.onload = function(loadEvent) {
      const importedQuotes = JSON.parse(loadEvent.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      populateCategories();
    };
    fileReader.readAsText(e.target.files[0]);
  });

  // ✅ Step 1: Fetch quotes from server (required name)
  async function fetchQuotesFromServer() {
    try {
      let response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
      let serverData = await response.json();

      // Convert server posts to quotes format
      let serverQuotes = serverData.map(post => ({
        text: post.title,
        category: "Server"
      }));

      // Conflict resolution: server data overrides local duplicates
      serverQuotes.forEach(sq => {
        let exists = quotes.some(lq => lq.text === sq.text);
        if (!exists) {
          quotes.push(sq);
        }
      });

      saveQuotes();
      populateCategories();
      console.log("✅ Synced with server");
    } catch (error) {
      console.error("❌ Error fetching from server:", error);
    }
  }

  // Periodic sync (every 30s)
  setInterval(fetchQuotesFromServer, 30000);

  // Event listeners
  newQuoteBtn.addEventListener("click", filterQuotes);
  addBtn.addEventListener("click", createAddQuoteForm);
  exportBtn.addEventListener("click", exportJsonBtn);

  // --- Initialize
  populateCategories();
  filterQuotes();
  fetchQuotesFromServer(); // Initial fetch
});
