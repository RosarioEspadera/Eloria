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

window.closeCart = function() {
  document.querySelector('.sidebar').classList.remove('visible');
  document.getElementById('mainContent').classList.remove('shifted');
};
