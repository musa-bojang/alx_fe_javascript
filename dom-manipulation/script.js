document.addEventListener("DOMContentLoaded", () => {

  
  let quotes =  JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];

  //   create elements
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
  
  function saveQuotes(){
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // show random quotes

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = ` "${randomQuote.text}" <div class="category">-${randomQuote.category}</div>`
  }

  // poplate categories
  // ✅ Step 2.1: Populate categories dynamically
  function populateCategories() {
    let categories = [...new Set(quotes.map(q => q.category))];

    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      let option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    // ✅ Restore saved filter from localStorage
    let savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory && [...categoryFilter.options].some(opt => opt.value === savedCategory)) {
      categoryFilter.value = savedCategory;
    }
  }
  // ✅ Step 2.2: Filter quotes by category
  function filterQuotes() {
    let selectedCategory = categoryFilter.value;

    localStorage.setItem("selectedCategory", selectedCategory); // save choice

    let filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = `<em>No quotes in this category.</em>`;
      return;
    }

    // Show a random quote from filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" <div class="category">— ${randomQuote.category}</div>`;
  }

  //  create new quotes
  function createAddQuoteForm() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();
  
    if (newText && newCategory) {
      // Add new quote
      quotes.push({ text: newText, category: newCategory });
      saveQuotes();
  
      // ✅ Refresh category dropdown if a new category was added
      populateCategories();
  
      // Show the newly added quote immediately
      quoteDisplay.innerHTML = `
        "${newText}"
        <div class="category">— ${newCategory}</div>
      `;
  
      // ✅ Auto-select the new category in the filter
      categoryFilter.value = newCategory;
      localStorage.setItem("selectedCategory", newCategory);
  
      // Reset fields
      textInput.value = "";
      categoryInput.value = "";
    } else {
      alert("Please enter both a quote and a category!");
    }
  }
  

  function exportJsonBtn(){
    let jsonStr = JSON.stringify(quotes, null, 2);

    // Create a downloadable file
    let blob = new Blob([jsonStr], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    // Create a temporary link
    let a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    // Cleanup
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
    };
    fileReader.readAsText(e.target.files[0]);
  });
  

  // Event listeners
  newQuoteBtn.addEventListener("click", filterQuotes);
  addBtn.addEventListener("click", createAddQuoteForm);
  exportBtn.addEventListener("click", exportJsonBtn);

  // --- Initialize
  populateCategories();
  filterQuotes(); // Show first quote based on saved filter
  
});


