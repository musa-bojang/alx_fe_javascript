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
      const newQuote = { text: newText, category: newCategory };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      quoteDisplay.innerHTML = `"${newText}" <div class="category">— ${newCategory}</div>`;
      categoryFilter.value = newCategory;
      localStorage.setItem("selectedCategory", newCategory);
      textInput.value = "";
      categoryInput.value = "";
  
      // ✅ Post new quote to mock server
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newQuote)
      })
      .then(response => response.json())
      .then(data => {
        console.log("✅ Quote synced to server:", data);
      })
      .catch(error => {
        console.error("❌ Error posting to server:", error);
      });
  
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

  async function syncQuotes() {
    try {
      // 1. Fetch server quotes
      let response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
      let serverData = await response.json();
  
      let serverQuotes = serverData.map(post => ({
        text: post.title,
        category: "Server"
      }));
  
      // 2. Conflict resolution: avoid duplicates
      serverQuotes.forEach(sq => {
        let exists = quotes.some(lq => lq.text === sq.text);
        if (!exists) {
          quotes.push(sq);
        }
      });
  
      // 3. Push new local quotes to server (simulate)
      for (let localQuote of quotes) {
        let isOnServer = serverQuotes.some(sq => sq.text === localQuote.text);
        if (!isOnServer) {
          await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(localQuote)
          })
          .then(r => r.json())
          .then(data => console.log("✅ Pushed local quote to server:", data));
        }
      }
  
      // 4. Save updates
      saveQuotes();
      populateCategories();
      console.log("✅ Sync completed");
  
    } catch (error) {
      console.error("❌ Sync failed:", error);
    }
  }
  

  // ✅ Step 1: Fetch quotes from server (required name)
  async function fetchQuotesFromServer() {
    await syncQuotes();
  }
  

  // Periodic sync (every 30s)
  // Periodic sync (every 30s)
  setInterval(syncQuotes, 30000);
  
  // Initial sync
  syncQuotes();
  
  

  // Event listeners
  newQuoteBtn.addEventListener("click", filterQuotes);
  addBtn.addEventListener("click", createAddQuoteForm);
  exportBtn.addEventListener("click", exportJsonBtn);

  // --- Initialize
  populateCategories();
  filterQuotes();
  // fetchQuotesFromServer(); // Initial fetch
});
