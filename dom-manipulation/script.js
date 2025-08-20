document.addEventListener("DOMContentLoaded", () => {
  // Quotes array with text and category
  let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn");

  // Show random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
      "${randomQuote.text}"
      <div class="category">— ${randomQuote.category}</div>
    `;
  }

  // Add a new quote dynamically
  function createAddQuoteForm() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText && newCategory) {
      quotes.push({ text: newText, category: newCategory });

      // Show confirmation by displaying the new quote
      quoteDisplay.innerHTML = `
        "${newText}"
        <div class="category">— ${newCategory}</div>
      `;

      // Reset fields
      textInput.value = "";
      categoryInput.value = "";
    } else {
      alert("Please enter both a quote and a category!");
    }
  }

  // Event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", createAddQuoteForm);

  // Show one quote on page load
  showRandomQuote();
});
