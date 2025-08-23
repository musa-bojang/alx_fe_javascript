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
  // const addQuoteBtn = document.getElementById("addQuoteBtn");
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

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = ` "${randomQuote.text}" <div class="category">-${randomQuote.category}</div>`
  }


    function createAddQuoteForm() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText && newCategory) {
      quotes.push({ text: newText, category: newCategory });
      saveQuotes();
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
  function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}
  

  // Event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addBtn.addEventListener("click", createAddQuoteForm);
  exportBtn.addEventListener("click", exportJsonBtn);
  
});


