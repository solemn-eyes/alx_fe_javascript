// Initial quote array
const quotes = [
    { text: "Do not mistaken education for intelligence, you can have a PHd but be an idiot", category: "Motivation"},
    { text: "Simplicity is the soul of efficiency", category: "Productivity"},
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts", category: "Inspiration"}
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    const displayArea = document.getElementById('quote-display');
    displayArea.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>Category: ${quote.category}</em></p>
    `;
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

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  showRandomQuote();
  createAddQuoteForm();
});