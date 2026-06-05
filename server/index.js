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

// Serve the frontend statically. no-store so the browser always pulls the
// latest html/js/css during development instead of running a stale cached copy
// (otherwise edits like the wired-up buttons don't show up until a hard refresh).
app.use(
  express.static(path.join(__dirname, "../frontend"), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => res.setHeader("Cache-Control", "no-store"),
  })
);

// Connect to SQLite
const db = new Database(process.env.DB_PATH || "./server/stylo.db");

// removed 
/*   CREATE TABLE IF NOT EXISTS outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT,
    item_ids TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  ); */
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
    image_url TEXT,        -- ← add this
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

  -- who follows who (profile page)
  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER NOT NULL,
    followee_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followee_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followee_id) REFERENCES users(id)
  );
`);

// add columns to older DBs that don't have them yet.
// ADD COLUMN throws if it's already there, so just ignore that.
function ensureColumn(sql) {
  try {
    db.exec(sql);
  } catch (err) {
    if (!/duplicate column name/i.test(err.message)) throw err;
  }
}
ensureColumn("ALTER TABLE users ADD COLUMN display_name TEXT");
ensureColumn("ALTER TABLE users ADD COLUMN avatar TEXT");
ensureColumn("ALTER TABLE users ADD COLUMN is_private INTEGER DEFAULT 0");
// studio, closet and profile all read the wardrobe from clothing_items
ensureColumn("ALTER TABLE clothing_items ADD COLUMN image_url TEXT");
ensureColumn("ALTER TABLE clothing_items ADD COLUMN status TEXT DEFAULT 'owned'");

// seed some demo data on a fresh db so the pages aren't empty
if (db.prepare("SELECT COUNT(*) AS n FROM users").get().n === 0) {
  const insertUser = db.prepare(
    "INSERT INTO users (username, display_name, bio, is_private) VALUES (?, ?, ?, ?)"
  );
  const demoUsers = [
    ["janestanford", "Jane Stanford", "hi! welcome to my digital closet :)", 0],
    ["iris.m", "Iris Morgan", "Writing my closet onto paper.", 0],
    ["leo.k", "Leo Kim", "menswear + thrift finds.", 0],
    ["mara", "Mara Diaz", "private closet, ask to follow <3", 1],
  ];
  const userIds = demoUsers.map((u) => Number(insertUser.run(...u).lastInsertRowid));
  const [jane, iris, leo, mara] = userIds;

  // jane follows iris + leo, they follow her back, mara follows her too
  const follow = db.prepare(
    "INSERT OR IGNORE INTO follows (follower_id, followee_id) VALUES (?, ?)"
  );
  follow.run(jane, iris);
  follow.run(jane, leo);
  follow.run(iris, jane);
  follow.run(leo, jane);
  follow.run(mara, jane);

  // jane gets the full starter closet so the grids look full, the others
  // just get a couple items each for their profiles
  const insertItem = db.prepare(
    "INSERT INTO clothing_items (user_id, name, category, status, image_url) VALUES (?, ?, ?, ?, ?)"
  );
  const seedItems = [
    // jane — full closet
    [jane, "mint cami", "top", "owned", "/stylo-feed/media/items/mint-cami.png"],
    [jane, "rose floral cami", "top", "owned", "/stylo-feed/media/items/rose-cami.png"],
    [jane, "valentin tee", "top", "owned", "/stylo-feed/media/items/valentin-tee.png"],
    [jane, "puff blouse", "top", "wishlist", "/stylo-feed/media/items/puff-blouse.png"],
    [jane, "washed shorts", "bottom", "owned", "/stylo-feed/media/items/wash-shorts.png"],
    [jane, "wide denim shorts", "bottom", "owned", "/stylo-feed/media/items/wide-denim.png"],
    [jane, "wide leg jeans", "bottom", "wishlist", "/stylo-feed/media/items/wide-jeans.png"],
    [jane, "tan ballet flats", "shoes", "owned", "/stylo-feed/media/items/tan-flats.png"],
    [jane, "beige ballet flats", "shoes", "owned", "/stylo-feed/media/items/beige-flats.png"],
    [jane, "brown shoulder bag", "accessory", "owned", "/stylo-feed/media/items/brown-bag.png"],
    [jane, "black shoulder bag", "accessory", "owned", "/stylo-feed/media/items/black-bag.png"],
    [jane, "olive bag", "accessory", "wishlist", "/stylo-feed/media/items/olive-bag.png"],
    [jane, "red cap", "accessory", "owned", "/stylo-feed/media/items/red-cap.png"],
    [jane, "plaid scrunchie", "accessory", "owned", "/stylo-feed/media/items/plaid-scrunchie.png"],
    // the others
    [iris, "rose floral cami", "top", "owned", "/stylo-feed/media/items/rose-cami.png"],
    [iris, "olive bag", "accessory", "wishlist", "/stylo-feed/media/items/olive-bag.png"],
    [leo, "valentin tee", "top", "owned", "/stylo-feed/media/items/valentin-tee.png"],
  ];
  for (const it of seedItems) {
    try { insertItem.run(...it); } catch (_) {}
  }

  const insertOutfit = db.prepare(
    "INSERT INTO outfits (user_id, name, image_url) VALUES (?, ?, ?)"
  );
  const seedOutfits = [
    [jane, "saturday market outfit", "/stylo-feed/media/post1tall.png"],
    [jane, "office fit", "/stylo-feed/media/post2wide.png"],
    [iris, "flowers and rain", "/stylo-feed/media/post3tall.png"],
    [leo, "thrifted layers", "/stylo-feed/media/post4wide.png"],
  ];
  for (const o of seedOutfits) {
    try { insertOutfit.run(...o); } catch (_) {}
  }
}

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
// handle filters
app.get("/api/clothing-items", (req, res) => {
  const { status, category } = req.query;

  let query = "SELECT * FROM clothing_items WHERE 1=1";
  const params = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  const items = db.prepare(query).all(...params);
  res.json(items);
});


app.post("/api/clothing-items", (req, res) => {
  const { user_id, name, category, status, color, image_url } = req.body;  // ← add image_url
  const stmt = db.prepare(`
    INSERT INTO clothing_items (user_id, name, category, status, color, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(user_id, name, category, status, color, image_url);  // ← add image_url
  res.json({ id: info.lastInsertRowid });
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

// ---- profile page routes ----

// no real login yet, so the "current" user is whoever the client says it is
// (?viewer_id= on GETs, follower_id in the body when following)
function getViewerId(req) {
  const raw = req.query.viewer_id ?? req.header("x-user-id");
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
}

function isFollowing(followerId, followeeId) {
  if (!followerId) return false;
  return !!db
    .prepare("SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?")
    .get(followerId, followeeId);
}

// public profiles are open to everyone, private ones only to the owner + followers
function canView(owner, viewerId) {
  if (!owner.is_private) return true;
  if (viewerId && viewerId === owner.id) return true;
  return isFollowing(viewerId, owner.id);
}

function followerCount(id) {
  return db.prepare("SELECT COUNT(*) AS n FROM follows WHERE followee_id = ?").get(id).n;
}
function followingCount(id) {
  return db.prepare("SELECT COUNT(*) AS n FROM follows WHERE follower_id = ?").get(id).n;
}

// GET /api/users/:id — profile info + follower/following counts
app.get("/api/users/:id", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const viewerId = getViewerId(req);
  res.json({
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    bio: user.bio,
    avatar: user.avatar,
    is_private: !!user.is_private,
    followers: followerCount(user.id),
    following: followingCount(user.id),
    is_following: isFollowing(viewerId, user.id),
    is_self: viewerId === user.id,
  });
});

// PUT /api/users/:id — edit bio / display name / privacy (own profile only)
app.put("/api/users/:id", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { display_name, bio, is_private } = req.body;
  db.prepare(
    `UPDATE users
       SET display_name = COALESCE(?, display_name),
           bio          = COALESCE(?, bio),
           is_private   = COALESCE(?, is_private)
     WHERE id = ?`
  ).run(
    display_name ?? null,
    bio ?? null,
    is_private === undefined ? null : is_private ? 1 : 0,
    user.id
  );

  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id);
  res.json({
    id: updated.id,
    display_name: updated.display_name,
    bio: updated.bio,
    is_private: !!updated.is_private,
  });
});

// POST /api/follow/:id — follow user :id as body.follower_id
app.post("/api/follow/:id", (req, res) => {
  const followeeId = Number(req.params.id);
  const followerId = Number(req.body.follower_id ?? getViewerId(req));
  if (!followerId) return res.status(400).json({ error: "follower_id required" });
  if (followerId === followeeId)
    return res.status(400).json({ error: "Cannot follow yourself" });

  const followee = db.prepare("SELECT id FROM users WHERE id = ?").get(followeeId);
  if (!followee) return res.status(404).json({ error: "User not found" });

  db.prepare(
    "INSERT OR IGNORE INTO follows (follower_id, followee_id) VALUES (?, ?)"
  ).run(followerId, followeeId);

  res.json({ following: true, followers: followerCount(followeeId) });
});

// DELETE /api/follow/:id — unfollow user :id as body.follower_id
app.delete("/api/follow/:id", (req, res) => {
  const followeeId = Number(req.params.id);
  const followerId = Number(req.body.follower_id ?? getViewerId(req));
  if (!followerId) return res.status(400).json({ error: "follower_id required" });

  db.prepare(
    "DELETE FROM follows WHERE follower_id = ? AND followee_id = ?"
  ).run(followerId, followeeId);

  res.json({ following: false, followers: followerCount(followeeId) });
});

// GET /api/users/:id/outfits — their saved outfits (private-gated)
app.get("/api/users/:id/outfits", (req, res) => {
  const owner = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!owner) return res.status(404).json({ error: "User not found" });
  if (!canView(owner, getViewerId(req)))
    return res.status(403).json({ error: "This profile is private", private: true });

  const outfits = db
    .prepare("SELECT * FROM outfits WHERE user_id = ? ORDER BY id DESC")
    .all(owner.id);
  res.json(outfits);
});

// GET /api/users/:id/items — their wardrobe items (private-gated, owned/wishlist filter)
app.get("/api/users/:id/items", (req, res) => {
  const owner = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!owner) return res.status(404).json({ error: "User not found" });
  if (!canView(owner, getViewerId(req)))
    return res.status(403).json({ error: "This profile is private", private: true });

  let query = "SELECT * FROM clothing_items WHERE user_id = ?";
  const params = [owner.id];
  const { status } = req.query; // "owned" | "wishlist"
  if (status === "owned" || status === "wishlist") {
    query += " AND status = ?";
    params.push(status);
  }
  query += " ORDER BY id DESC";
  res.json(db.prepare(query).all(...params));
});

// app listen at bottom of file so everything is defined before
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});