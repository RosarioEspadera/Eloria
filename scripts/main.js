import { renderDishes } from "./renderDishes.js";

fetch("./data/dishes.json")
  .then(res => res.ok ? res.json() : Promise.reject("Failed to load"))
  .then(dishes => renderDishes(dishes))
  .catch(err => console.error("Error loading dishes:", err));

window.toggleCart = function() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.getElementById('mainContent');

  const isOpen = sidebar.classList.toggle('open');
  mainContent.classList.toggle('shifted', isOpen);
};

document.querySelector('.view-cart-button').addEventListener('click', window.toggleCart);

