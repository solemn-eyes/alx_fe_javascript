let quotes = [];

// === Load quotes from localStorage or use defaults ===
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [
    { text: "Be yourself; everyone else is already taken.", category: "Wisdom" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Tech" },
    { text: "Success is not final, failure is not fatal.", category: "Motivation" }
  ];
}

// === Save updated quotes to localStorage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Extract unique categories and populate dropdown ===
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("selectedCategory") || "all";

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore previously selected category
  categoryFilter.value = selected;
}

// === Display one random quote from the current filter ===
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filtered = quotes;

  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    document.getElementById("quote-display").innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quote-display").innerHTML = `
    <blockquote>"${random.text}"</blockquote>
    <p><em>Category: ${random.category}</em></p>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// === Filter quotes when dropdown is changed ===
function filterQuotes() {
  const quoteDisplay = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", quoteDisplay);
  showRandomQuote(); // Show one matching quote
}

// === Add quote form with category update ===
function createAddQuoteForm() {
  const container = document.getElementById("form-container");

  const form = document.createElement("form");

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Quote text";
  textInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Category";
  categoryInput.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);
  container.appendChild(form);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newQuote = {
      text: textInput.value.trim(),
      category: categoryInput.value.trim()
    };

    quotes.push(newQuote);
    saveQuotes();
    populateCategories(); // Update dropdown
    showRandomQuote(); // Optionally show new quote
    form.reset();
    alert("Quote added!");
  });
}

// === Load last viewed quote on page load ===
function loadLastViewedQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quote-display").innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <p><em>Category: ${quote.category}</em></p>
    `;
  }
}

// === Run everything on load ===
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  loadLastViewedQuote();


function showNotification(message) {
  const note = document.getElementById("notification");
  note.textContent = message;
  note.style.display = "block";

  setTimeout(() => {
    note.style.display = "none";
  }, 4000);
}

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL)
    if (!response.ok) throw new Error("Failed to  fetch server quotes");

    const serverQuotes = await response.json();
    let update = false;

    // Conflict resolution: replace local qoute if exact text exits
    serverQuotes.forEach(serverQuote => {
      const exits = quotes.find(q => q.text === serverQuote.text);
      if (!exits) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      showNotification("Qoutes synced with server.");

    }
  } catch (error) {
    showNotification("Failed to sync with server.");
    console.error(error);
  }
}

// Simulating periodic server sync
setInterval(fetchQuotesFromServer, 60000); // does for every 60 seconds



});

