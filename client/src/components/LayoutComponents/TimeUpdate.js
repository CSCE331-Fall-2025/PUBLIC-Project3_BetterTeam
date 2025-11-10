setInterval(() => {
  const now = new Date();
  document.getElementById("Time").textContent = now.toLocaleTimeString();
}, 1000);
//idk how you like connect this or whatever