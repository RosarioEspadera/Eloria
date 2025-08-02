let cart = [];

export function addToCart(dish) {
  if (typeof dish.price !== "number" || typeof dish.quantity !== "number") {
    console.warn("Invalid dish format:", dish);
    return;
  }
  cart.push(dish);
  renderCart();
}

function renderCart() {
  const cartPreview = document.getElementById("cartPreview");
  if (!cartPreview) return;

  if (cart.length === 0) {
    cartPreview.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

 const itemsHTML = cart.map((item, index) => `
  <div class="cart-item">
    <span>${item.quantity} × ${item.name} – ₱${(item.price * item.quantity).toFixed(2)}</span>
    <button onclick="removeFromCart(${index})">✖</button>
  </div>
`).join("");

const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);


  cartPreview.innerHTML = `
    <h2>Cart Preview</h2>
    ${itemsHTML}
    <div class="cart-total">Total: ₱${total}</div>
  `;
}

// Optional: allow item removal
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  renderCart();
};

// Optional: expose cart for email.js or orderForm
export function getCart() {
  return cart;
}
