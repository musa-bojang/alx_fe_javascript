document.addEventListener("DOMContentLoaded", () => {
  // Quotes array
  let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const body = document.body;

  // Show random quote using innerHTML
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <div class="category">— ${randomQuote.category}</div>
    `;
  }

  // Create form dynamically with innerHTML
  function createAddQuoteForm() {
    const formDiv = document.createElement("div");
    formDiv.id = "addQuoteForm";

    formDiv.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteBtn">Add Quote</button>
    `;

    body.appendChild(formDiv);

    // Attach event after injecting innerHTML
    const addBtn = document.getElementById("addQuoteBtn");
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    addBtn.addEventListener("click", () => {
      const newText = textInput.value.trim();
      const newCategory = categoryInput.value.trim();

      if (newText && newCategory) {
        quotes.push({ text: newText, category: newCategory });

        // Show immediately
        quoteDisplay.innerHTML = `
          <p>"${newText}"</p>
          <div class="category">— ${newCategory}</div>
        `;

        textInput.value = "";
        categoryInput.value = "";
      } else {
        alert("Please enter both a quote and a category!");
      }
    });
  }

  // Event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Show one quote at start
  showRandomQuote();

  // Create the form dynamically on page load
  createAddQuoteForm();
});
