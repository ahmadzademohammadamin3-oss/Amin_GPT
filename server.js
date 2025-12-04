import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

function loadUsers() {
  return JSON.parse(fs.readFileSync("users.json", "utf8"));
}

// ---------- ورود فقط برای کاربران تعیین‌شده ----------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = loadUsers();

  const found = users.find(
    u => u.username === username && u.password === password
  );

  if (!found) {
    return res.json({ ok: false, msg: "نام کاربری یا رمز اشتباه است" });
  }

  res.json({ ok: true });
});

// ---------- چت ----------
app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "تو یک دستیار با نام «امین» هستی. پاسخ‌ها را دوستانه، کوتاه و با لحن خودمانی بده."
        },
        { role: "user", content: userMsg }
      ]
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.listen(3000, () => console.log("Amin GPT running on http://localhost:3000"));
