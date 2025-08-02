document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    to_name: form.name.value,
    reply_to: form.email.value,
    address: form.address.value,
    item_list: cart.map(item => item.name).join(", "),
    total: cart.reduce((sum, item) => sum + item.price, 0)
  };

  emailjs.send("service_id", "template_id", data)
    .then(() => alert("Order sent!"))
    .catch(err => console.error("EmailJS error:", err));
});
