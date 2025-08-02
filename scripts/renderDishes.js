import { addToCart } from "./cart.js";

fetch("./data/dishes.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to load dishes.json");
    return res.json();
  })
  .then(dishes => {
    const dishList = document.getElementById("dishList");
    if (!dishList) return;

    dishList.innerHTML = dishes.map((dish, i) => `
      <section class="dish-card" data-index="${i}">
        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='fallback.jpg'" />
        <div class="dish-info">
          <h2>${dish.name}</h2>
          <p class="description">${dish.description}</p>
          <div class="tags">
            ${dish.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <button class="order-btn">🍽️ Add to Order</button>
        </div>
      </section>
    `).join("");

    // Attach event listeners after rendering
    const cards = dishList.querySelectorAll(".dish-card");
    cards.forEach((card, i) => {
      const button = card.querySelector(".order-btn");
      button.addEventListener("click", () => addToCart(dishes[i]));
    });
  })
  .catch(err => {
    console.error("Error loading dishes:", err);
    document.getElementById("dishList").innerHTML = "<p>Failed to load dishes.</p>";
  });
