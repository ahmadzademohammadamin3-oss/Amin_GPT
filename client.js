async function sendMsg() {
  const message = msg.value;
  if (!message) return;

  add("شما", message);
  msg.value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  add("امین", data.reply);
}

function add(user, text) {
  const box = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "bubble";
  div.innerHTML = `<b>${user}:</b> ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
