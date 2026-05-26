const BASE_URL = "http://localhost:3000/jokes";

const output = document.querySelector("#output");

// Populate type filter from /jokes/categories
async function loadCategories() {
  const typeFilter = document.querySelector("#typeFilter");
  // Keep only the "All types" option, remove the rest
  while (typeFilter.options.length > 1) {
    typeFilter.remove(1);
  }
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    const categories = await res.json();
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat[0].toUpperCase() + cat.slice(1);
      typeFilter.appendChild(option);
    });
  } catch {
    // Fallback if the categories endpoint is not available
    ["programming", "general"].forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat[0].toUpperCase() + cat.slice(1);
      typeFilter.appendChild(option);
    });
  }
}
loadCategories();

// ??change filter button
document.querySelector("#filter-button").addEventListener("click", async () => {
  const res = await fetch(`${BASE_URL}/random`);
  const joke = await res.json();
  output.value = joke.setup + "\n" + joke.punchline;
});

// Get all jokes or by category
document.querySelector("#allButton").addEventListener("click", async () => {
  const type = document.querySelector("#typeFilter").value;
  const url = type ? `${BASE_URL}?type=${type}` : BASE_URL;
  const res = await fetch(url);
  const jokes = await res.json();
  output.value = jokes
    .map((j) => `#${j.id} [${j.type}] ${j.setup} / ${j.punchline}`)
    .join("\n");
});

// Get joke by ID
document.querySelector("#idButton").addEventListener("click", async () => {
  const id = document.querySelector("#jokeIdInput").value;
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await res.json();
  output.value = data.error
    ? data.error
    : data.setup + "\n" + data.punchline;
});

// Toggle custom type input visibility
const addForm = document.querySelector("#addForm");
const newTypeSelect = document.querySelector("#newType");
const customTypeInput = document.querySelector("#customType");

customTypeInput.hidden = newTypeSelect.value !== "__custom";

newTypeSelect.addEventListener("change", () => {
  customTypeInput.hidden = newTypeSelect.value !== "__custom";
});

// Add new joke using FormData
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(addForm);

  // Replace "__custom" sentinel with the actual custom value
  if (formData.get("type") === "__custom") {
    formData.set("type", customTypeInput.value);
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    body: new URLSearchParams(formData),
  });

  const data = await res.json();
  output.value = data.error
    ? data.error
    : `Added #${data.id}: ${data.setup} / ${data.punchline}`;

  // Reload categories so the new type appears in the filter
  if (!data.error) {
    addForm.reset();
    loadCategories();
  }
});
