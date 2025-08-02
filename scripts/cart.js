let cart = [];

export function addToCart(dish) {
  if (
    !dish ||
    typeof dish.id !== "string" ||
    typeof dish.name !== "string" ||
    typeof dish.price !== "number" ||
    typeof dish.description !== "string" ||
    !Array.isArray(dish.tags)
  ) {
    console.error("Invalid dish format:", dish);
    return;
  }

  // Add quantity if missing
  const existing = cart.find(item => item.id === dish.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...dish, quantity: 1 });
    showToast(`🛒 ${dish.name} added to cart.`);
  }

  renderCart();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
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
const totalFormatted = formatTotal(total);

cartPreview.innerHTML = `
  <h2>Cart Preview</h2>
  ${itemsHTML}
  <div class="cart-total">Total: ${totalFormatted}</div>
`;
  
function formatTotal(amount) {
  return `₱${amount.toFixed(2)}`;
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
