import { dishes } from "../data/dishes.js"; // or fetch if needed
import { renderDishes } from "./renderDishes.js";

const tagFilters = document.getElementById("tagFilters");

const allTags = [...new Set(dishes.flatMap(dish => dish.tags))].sort();

function createTagButton(tag) {
  const button = document.createElement("button");
  button.className = "tag-button";
  button.textContent = tag;
  button.onclick = () => filterByTag(tag);
  return button;
}

function renderTagFilters() {
  tagFilters.innerHTML = "";

  allTags.forEach(tag => {
    tagFilters.appendChild(createTagButton(tag));
  });

  const clearBtn = document.createElement("button");
  clearBtn.className = "tag-button clear";
  clearBtn.textContent = "❌ Clear Filter";
  clearBtn.onclick = () => renderDishes(dishes);
  tagFilters.appendChild(clearBtn);
}

function filterByTag(tag) {
  const filtered = dishes.filter(dish => dish.tags.includes(tag));
  renderDishes(filtered);
}

renderTagFilters();
