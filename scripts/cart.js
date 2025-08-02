let cart = [];

function addToCart(dish) {
  cart.push(dish);
  renderCart();
}

function renderCart() {
  const cartPreview = document.getElementById("cartPreview");
  cartPreview.innerHTML = cart.map(item => `
    <div>${item.name} – ₱${item.price}</div>
  `).join("");
}
