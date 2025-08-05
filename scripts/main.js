import { renderDishes } from "./renderDishes.js";

fetch("./data/dishes.json")
  .then(res => res.ok ? res.json() : Promise.reject("Failed to load"))
  .then(dishes => renderDishes(dishes))
  .catch(err => console.error("Error loading dishes:", err));

window.toggleCart = function() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.getElementById('mainContent');

  sidebar.classList.toggle('visible');
  mainContent.classList.toggle('shifted');
};

document.querySelector('.view-cart-button').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
});
