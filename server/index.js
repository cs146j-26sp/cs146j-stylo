require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the frontend statically
app.use(express.static(path.join(__dirname, "../frontend")));

// Connect to SQLite
const db = new Database(process.env.DB_PATH || "./server/stylo.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    avatar TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS closet_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    source_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT,
    item_ids TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    outfit_id INTEGER,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (outfit_id) REFERENCES outfits(id)
  );
  CREATE TABLE IF NOT EXISTS clothing_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    status TEXT,
    color TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT,
    notes TEXT,
    occasion TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS outfit_items (
    outfit_id INTEGER NOT NULL,
    clothing_item_id INTEGER NOT NULL,
    PRIMARY KEY (outfit_id, clothing_item_id),
    FOREIGN KEY (outfit_id) REFERENCES outfits(id),
    FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id)
  ) STRICT;
  
`);

// Redirect root to studio
app.get("/", (req, res) => {
  res.redirect("/stylo-studio/studio.html");
});

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Stylo server is running" });
});

// Example: get all users
app.get("/api/users", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/clothing-items", (req, res) => {
  const items = db.prepare("SELECT * FROM clothing_items").all();
  res.json(items);
});

app.post("/api/clothing-items", (req, res) => {
  const { user_id, name, category, status, color } = req.body;
  const stmt = db.prepare(`
    INSERT INTO clothing_items (user_id, name, category, status, color)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(user_id, name, category, status, color);
  res.json({ id: info.lastInsertRowid });
});

app.get("/api/outfits", (req, res) => {
  const outfits = db.prepare("SELECT * FROM outfits").all();
  res.json(outfits);
});

app.post("/api/outfits", (req, res) => {
  const { user_id, name, notes, occasion, image_url } = req.body;
  const stmt = db.prepare(`
    INSERT INTO outfits (user_id, name, notes, occasion, image_url)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(user_id, name, notes, occasion, image_url);
  res.json({ id: info.lastInsertRowid });
});

app.get("/api/outfit-items", (req, res) => {
  const outfitItems = db.prepare("SELECT * FROM outfit_items").all();
  res.json(outfitItems);
});

app.post("/api/outfit-items", (req, res) => {
  const { outfit_id, clothing_item_id } = req.body;
  const stmt = db.prepare(`
    INSERT INTO outfit_items (outfit_id, clothing_item_id)
    VALUES (?, ?)
  `);
  stmt.run(outfit_id, clothing_item_id);
  res.json({ message: "Clothing item added to outfit" });
});

app.delete("/api/outfit-items", (req, res) => {
  const { outfit_id, clothing_item_id } = req.body;
  const stmt = db.prepare(`
    DELETE FROM outfit_items
    WHERE outfit_id = ? AND clothing_item_id = ?
  `);
  stmt.run(outfit_id, clothing_item_id);
  res.json({ message: "Clothing item removed from outfit" });
});
app.delete("/api/clothing-items/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare(`
    DELETE FROM clothing_items
    WHERE id = ?
  `);
  stmt.run(id);
  res.json({ message: "Clothing item deleted" });
});
app.delete("/api/outfits/:id", (req, res) => {    
  const { id } = req.params;
  const stmt = db.prepare(`
    DELETE FROM outfits
    WHERE id = ?
  `);
  stmt.run(id);
  res.json({ message: "Outfit deleted" });
});
app.get("GET /items?filter=wishlist", (req, res) => {
  const stmt = db.prepare(`
    SELECT *
    FROM clothing_items
    WHERE status = 'wishlist'
  `);
  const items = stmt.all();
  res.json(items);
});
app.get("GET /items?filter=owned", (req, res) => {
  const stmt = db.prepare(`
    SELECT *
    FROM clothing_items
    WHERE status = 'owned'
  `);
  const items = stmt.all();
  res.json(items);
});

app.get("GET /items?filter=tops", (req, res) => {
  const stmt = db.prepare(`
    SELECT *
    FROM clothing_items
    WHERE status = 'tops'
  `);
  const items = stmt.all();
  res.json(items);
});

app.get("GET /items?filter=bottoms", (req, res) => {
  const stmt = db.prepare(`
    SELECT *
    FROM clothing_items
    WHERE status = 'bottoms'
  `);
  const items = stmt.all();
  res.json(items);
});
app.get("GET /items?filter=accessories", (req, res) => {
  const stmt = db.prepare(`
    SELECT *
    FROM clothing_items
    WHERE status = 'accessories'
  `);
  const items = stmt.all();
  res.json(items);
});

app.get("GET /items?filter=shoes", (req, res) => {
  const stmt = db.prepare(`
    SELECT *
    FROM clothing_items
    WHERE status = 'wishlist'
  `);
  const items = stmt.all();
  res.json(items);
});

app.get("/api/outfits/:id/items", (req, res) => { 
  const { id } = req.params;
  const stmt = db.prepare(`
    SELECT ci.*
    FROM clothing_items ci
    JOIN outfit_items oi ON ci.id = oi.clothing_item_id
    WHERE oi.outfit_id = ?
  `);
  const items = stmt.all(id);
  res.json(items);
});