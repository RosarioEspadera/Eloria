fetch("./data/dishes.json")
  .then(res => res.json())
  .then(dishes => {
    const dishList = document.getElementById("dishList");
    dishList.innerHTML = dishes.map(dish => `
      <section class="dish-card">
        <img src="${dish.image}" alt="${dish.name}" />
        <div class="dish-info">
          <h2>${dish.name}</h2>
          <p class="description">${dish.description}</p>
          <div class="tags">
            ${dish.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <button class="order-btn" onclick='addToCart(${JSON.stringify(dish)})'>
            🍽️ Add to Order
          </button>
        </div>
      </section>
    `).join("");
  });
