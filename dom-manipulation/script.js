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

  // Utility: clear children of a DOM node
  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // Show random quote using DOM methods
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Clear previous content
    clearElement(quoteDisplay);

    // Create <p> for quote text
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${randomQuote.text}"`;

    // Create <div> for category
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.textContent = `— ${randomQuote.category}`;

    // Append to display
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(categoryDiv);
  }

  // Create form dynamically
  function createAddQuoteForm() {
    const formDiv = document.createElement("div");
    formDiv.id = "addQuoteForm";

    // Input for quote text
    const textInput = document.createElement("input");
    textInput.id = "newQuoteText";
    textInput.type = "text";
    textInput.placeholder = "Enter a new quote";

    // Input for category
    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    // Add button
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Quote";

    // Event: add new quote
    addBtn.addEventListener("click", () => {
      const newText = textInput.value.trim();
      const newCategory = categoryInput.value.trim();

      if (newText && newCategory) {
        quotes.push({ text: newText, category: newCategory });

        // Show the new quote immediately
        clearElement(quoteDisplay);
        const newQuoteText = document.createElement("p");
        newQuoteText.textContent = `"${newText}"`;

        const newCategoryDiv = document.createElement("div");
        newCategoryDiv.classList.add("category");
        newCategoryDiv.textContent = `— ${newCategory}`;

        quoteDisplay.appendChild(newQuoteText);
        quoteDisplay.appendChild(newCategoryDiv);

        // Reset inputs
        textInput.value = "";
        categoryInput.value = "";
      } else {
        alert("Please enter both a quote and a category!");
      }
    });

    // Append all to formDiv
    formDiv.appendChild(textInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addBtn);

    // Append form to body
    body.appendChild(formDiv);
  }

  // Event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Show one quote at start
  showRandomQuote();

  // Create the form dynamically on page load
  createAddQuoteForm();
});
