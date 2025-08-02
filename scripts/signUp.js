import { supabase } from "./supabase.js";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value);
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  const { data, error } = await supabase.auth.signUp(
    { email, password },
    { data: { name, age, address } }
  );

  if (error) {
    errorMsg.textContent = error.message;
  } else {
    window.location.href = "login.html";
  }
});
