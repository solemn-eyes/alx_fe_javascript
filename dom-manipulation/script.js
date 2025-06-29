// Initial quote array

let quotes = [];
// Load quotes from localstorage (if any)
function loadQuotes(){
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [
    { text: "Do not mistaken education for intelligence, you can have a PHd but be an idiot", category: "Motivation"},
    { text: "Simplicity is the soul of efficiency", category: "Productivity"},
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts", category: "Inspiration"}
  ];
}

// Saving quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    const displayArea = document.getElementById('quote-display');
    displayArea.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>Category: ${quote.category}</em></p>
    `;
    // Storing last shown quote to sessionStorage
    sessionStorage.setItemt("lastQuote", JSON.stringify(quote));
}

// Populating dropdown from unique categories
function populateCategories() {
  const dropdown = document.getElementById("category-filter");
  dropdown.innerHTML = ""; // This clears old options

  const categories = ["All", ...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
  }
  );

    // Restore saved filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    dropdown.value = savedFilter;
    filterQuotes(savedFilter);
  }
}

// Filter quotes by selected category
function filterQuotes(selectedCategory) {
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}


// Function to create and display the form to add new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById('form-container');

  const form = document.createElement('form');
  form.id = 'add-quote-form';

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.placeholder = 'Quote text';
  textInput.required = true;

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Category';
  categoryInput.required = true;

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Add Quote';
  submitBtn.type = 'submit';

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);
  formContainer.appendChild(form);

  // Form submit handler
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const newQuote = {
      text: textInput.value.trim(),
      category: categoryInput.value.trim()
    };

    if (newQuote.text && newQuote.category) {
      quotes.push(newQuote);
      alert("Quote added successfully!");
      form.reset();
    }
  });
}

// Export quotes as JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

// Importing from JSON file
function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes = imported;
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Failed to read file.");
    }
  };
  reader.readAsText(file);

}
// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  showRandomQuote();
  createAddQuoteForm();
});


document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  loadLastViewedQuote();
  createAddQuoteForm();

  document.getElementById("random-btn").addEventListener("click", showRandomQuote);
  document.getElementById("export-btn").addEventListener("click", exportQuotes);
  document.getElementById("import-file").addEventListener("change", importQuotes);

  // Dropdown change listener
  document.getElementById("category-filter").addEventListener("change", (e) =>
  {
    filterQuotes(e.target.value);
  });
})