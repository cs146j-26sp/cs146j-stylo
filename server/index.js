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
    image_url TEXT,       
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
// remix columns. is_remix puts it on the profile "remixes" tab, remix_of /
// remix_of_username point back at the original, layout is the canvas json
ensureColumn("ALTER TABLE outfits ADD COLUMN is_remix INTEGER DEFAULT 0");
ensureColumn("ALTER TABLE outfits ADD COLUMN remix_of TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN remix_of_username TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN layout TEXT");
// extra fields the feed needs now that it reads outfits from the db. code is a
// stable id like "outfit1" so the mock comments still line up; is_seed keeps the
// demo posts off real profiles.
ensureColumn("ALTER TABLE outfits ADD COLUMN username TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN overlay_url TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN aspect TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN likes INTEGER DEFAULT 0");
ensureColumn("ALTER TABLE outfits ADD COLUMN comments INTEGER DEFAULT 0");
ensureColumn("ALTER TABLE outfits ADD COLUMN remix_count INTEGER DEFAULT 0");
ensureColumn("ALTER TABLE outfits ADD COLUMN tags TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN aesthetic TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN items_json TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN code TEXT");
ensureColumn("ALTER TABLE outfits ADD COLUMN is_seed INTEGER DEFAULT 0");

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

// the demo discover/following posts, seeded into the outfits table so the feed
// can pull them from the api. same data as the old OUTFITS list in data.js —
// items are catalog slugs.
const FEED_SEED = [
  { code: "outfit1",  username: "angela",     name: "saturday market outfit #cottagecore #staples #ootd",       cover: "media/talloutfit1.png", overlay: "",                    aspect: "tall", likes: 124, comments: 12, remixes: 8,  tags: ["staples", "ootd"],          aesthetic: "cottagecore",   items: ["mint-cami", "wash-shorts", "tan-flats", "brown-bag"] },
  { code: "outfit2",  username: "hannah",      name: "florals for spring #grunge #inspo #accessories",          cover: "media/post2wide.png",  overlay: "media/wideoutfit1.png", aspect: "wide", likes: 89,  comments: 6,  remixes: 14, tags: ["inspo", "accessories"],     aesthetic: "grunge",        items: ["rose-cami", "wide-jeans"] },
  { code: "outfit3",  username: "kaycee",      name: "I wore this to the art museum! #y2k #staples #accessories", cover: "media/talloutfit2.png", overlay: "",                    aspect: "tall", likes: 312, comments: 5,  remixes: 22, tags: ["staples", "accessories"],   aesthetic: "y2k",           items: ["rose-cami", "wide-denim", "black-bag"] },
  { code: "outfit4",  username: "vivian",      name: "my mom picked this outfit #darkacademia #ootd #accessories", cover: "media/post4wide.png", overlay: "media/wideoutfit2.png", aspect: "wide", likes: 540, comments: 41, remixes: 36, tags: ["accessories", "ootd"],      aesthetic: "dark-academia", items: ["valentin-tee", "wide-jeans", "tan-flats"] },
  { code: "outfit5",  username: "gudetama",    name: "my favorite band #grunge #inspo",                          cover: "media/post3wide.png",  overlay: "media/wideoutfit3.png", aspect: "wide", likes: 201, comments: 9,  remixes: 5,  tags: ["inspo"],                    aesthetic: "grunge",        items: ["mint-cami", "wide-denim", "beige-flats", "red-cap"] },
  { code: "outfit6",  username: "my_melody",   name: "yes, chef #grunge #staples #ootd",                         cover: "media/talloutfit3.png", overlay: "",                    aspect: "tall", likes: 178, comments: 11, remixes: 9,  tags: ["staples", "ootd"],          aesthetic: "grunge",        items: ["valentin-tee", "wide-jeans", "olive-bag"] },
  { code: "outfit7",  username: "keroppi",     name: "seasonal wardrobe staples #cottagecore #inspo #accessories", cover: "media/post1wide.png", overlay: "media/wideoutfit4.png", aspect: "wide", likes: 700, comments: 4,  remixes: 2,  tags: ["inspo", "accessories"],     aesthetic: "cottagecore",   items: ["valentin-tee", "puff-blouse", "olive-bag"] },
  { code: "outfit8",  username: "pompompurin", name: "walking on sunshine #y2k #ootd",                           cover: "media/talloutfit4.png", overlay: "",                    aspect: "tall", likes: 800, comments: 4,  remixes: 2,  tags: ["ootd"],                     aesthetic: "y2k",           items: ["mint-cami", "wash-shorts", "olive-bag"] },
  { code: "outfit9",  username: "cinnamoroll", name: "pastel pink and green <3 #cottagecore #staples",           cover: "media/talloutfit5.png", overlay: "",                    aspect: "tall", likes: 800, comments: 4,  remixes: 2,  tags: ["staples"],                  aesthetic: "cottagecore",   items: ["rose-cami", "wide-denim", "tan-flats"] },
  { code: "outfit10", username: "pochacco",    name: "fall outfit! #darkacademia #staples",                      cover: "media/post2wide.png",  overlay: "media/wideoutfit5.png", aspect: "wide", likes: 800, comments: 4,  remixes: 2,  tags: ["staples"],                  aesthetic: "dark-academia", items: ["valentin-tee", "wide-jeans", "brown-bag"] },
  { code: "outfit11", username: "hello_kitty", name: "can you hear the ocean? #y2k #ootd",                        cover: "media/talloutfit6.png", overlay: "",                    aspect: "tall", likes: 800, comments: 4,  remixes: 2,  tags: ["ootd"],                     aesthetic: "y2k",           items: ["mint-cami", "wide-jeans", "beige-flats"] },
  { code: "outfit12", username: "kuromi",      name: "art deco #y2k #accessories",                               cover: "media/post4wide.png",  overlay: "media/wideoutfit6.png", aspect: "wide", likes: 800, comments: 4,  remixes: 2,  tags: ["accessories"],              aesthetic: "y2k",           items: ["puff-blouse", "wide-denim", "brown-bag", "red-cap"] },
  { code: "outfit13", username: "chococat",    name: "having a good time #grunge #ootd",                         cover: "media/post3wide.png",  overlay: "media/wideoutfit7.png", aspect: "wide", likes: 800, comments: 4,  remixes: 2,  tags: ["ootd"],                     aesthetic: "grunge",        items: ["mint-cami", "wash-shorts", "beige-flats"] },
  { code: "outfit14", username: "aggretsuko",  name: "outfit for when you want to feel like a butterfly #y2k #accessories", cover: "media/talloutfit7.png", overlay: "",          aspect: "tall", likes: 800, comments: 4,  remixes: 2,  tags: ["accessories"],              aesthetic: "y2k",           items: ["rose-cami", "wide-jeans", "olive-bag"] },
  { code: "outfit15", username: "hangyodon",   name: "frolicking in san francisco #y2k #accessories",            cover: "media/post1wide.png",  overlay: "media/wideoutfit8.png", aspect: "wide", likes: 800, comments: 4,  remixes: 2,  tags: ["accessories"],              aesthetic: "y2k",           items: ["valentin-tee", "wide-denim", "plaid-scrunchie"] },
  { code: "outfit16", username: "tuxedosam",   name: "bumblebee inspired color scheme #darkacademia #staples",   cover: "media/talloutfit8.png", overlay: "",                    aspect: "tall", likes: 800, comments: 4,  remixes: 2,  tags: ["staples"],                  aesthetic: "dark-academia", items: ["puff-blouse", "wide-jeans", "tan-flats"] },
  // extra remix-friendly looks built from other users' closets
  { code: "outfit17", username: "angela",      name: "brunch with friends #cottagecore #ootd",                   cover: "media/talloutfit5.png", overlay: "",                    aspect: "tall", likes: 156, comments: 8,  remixes: 11, tags: ["ootd"],                     aesthetic: "cottagecore",   items: ["rose-cami", "wide-denim", "beige-flats", "plaid-scrunchie"] },
  { code: "outfit18", username: "hannah",      name: "lazy sunday layers #grunge #staples",                      cover: "media/talloutfit6.png", overlay: "",                    aspect: "tall", likes: 203, comments: 14, remixes: 7,  tags: ["staples"],                  aesthetic: "grunge",        items: ["puff-blouse", "wash-shorts", "tan-flats", "brown-bag"] },
];

// catalog metadata keyed by slug — same pieces as data.js FALLBACK_ITEMS
const CATALOG_BY_SLUG = {
  "mint-cami": { name: "mint cami", category: "top", status: "owned", image_url: "/stylo-feed/media/items/mint-cami.png" },
  "rose-cami": { name: "rose floral cami", category: "top", status: "owned", image_url: "/stylo-feed/media/items/rose-cami.png" },
  "valentin-tee": { name: "valentin tee", category: "top", status: "owned", image_url: "/stylo-feed/media/items/valentin-tee.png" },
  "puff-blouse": { name: "puff blouse", category: "top", status: "wishlist", image_url: "/stylo-feed/media/items/puff-blouse.png" },
  "wash-shorts": { name: "washed shorts", category: "bottom", status: "owned", image_url: "/stylo-feed/media/items/wash-shorts.png" },
  "wide-denim": { name: "wide denim shorts", category: "bottom", status: "owned", image_url: "/stylo-feed/media/items/wide-denim.png" },
  "wide-jeans": { name: "wide leg jeans", category: "bottom", status: "wishlist", image_url: "/stylo-feed/media/items/wide-jeans.png" },
  "tan-flats": { name: "tan ballet flats", category: "shoes", status: "owned", image_url: "/stylo-feed/media/items/tan-flats.png" },
  "beige-flats": { name: "beige ballet flats", category: "shoes", status: "owned", image_url: "/stylo-feed/media/items/beige-flats.png" },
  "brown-bag": { name: "brown shoulder bag", category: "accessory", status: "owned", image_url: "/stylo-feed/media/items/brown-bag.png" },
  "black-bag": { name: "black shoulder bag", category: "accessory", status: "owned", image_url: "/stylo-feed/media/items/black-bag.png" },
  "olive-bag": { name: "olive bag", category: "accessory", status: "wishlist", image_url: "/stylo-feed/media/items/olive-bag.png" },
  "red-cap": { name: "red cap", category: "accessory", status: "owned", image_url: "/stylo-feed/media/items/red-cap.png" },
  "plaid-scrunchie": { name: "plaid scrunchie", category: "accessory", status: "owned", image_url: "/stylo-feed/media/items/plaid-scrunchie.png" },
};

// seed the demo feed. matches on code so each post only gets added once, even
// if the server restarts and this runs again
(function seedFeed() {
  const owner = db.prepare("SELECT id FROM users ORDER BY id LIMIT 1").get();
  if (!owner) return; // no users to attach the demo posts to yet
  const exists = db.prepare("SELECT 1 FROM outfits WHERE code = ?");
  const insert = db.prepare(`
    INSERT INTO outfits
      (user_id, code, name, username, image_url, overlay_url, aspect,
       likes, comments, remix_count, tags, aesthetic, items_json, is_seed)
    VALUES
      (@user_id, @code, @name, @username, @image_url, @overlay_url, @aspect,
       @likes, @comments, @remix_count, @tags, @aesthetic, @items_json, 1)
  `);
  const seedAll = db.transaction(() => {
    for (const o of FEED_SEED) {
      if (exists.get(o.code)) continue;
      insert.run({
        user_id: owner.id,
        code: o.code,
        name: o.name,
        username: o.username,
        image_url: o.cover,
        overlay_url: o.overlay || null,
        aspect: o.aspect,
        likes: o.likes,
        comments: o.comments,
        remix_count: o.remixes,
        tags: JSON.stringify(o.tags),
        aesthetic: o.aesthetic,
        items_json: JSON.stringify(o.items),
      });
    }
  });
  seedAll();
})();

// give each feed author their own closet and link outfit_items so remix can
// resolve every piece from real uploaded rows (not just catalog slugs)
(function seedFeedClosets() {
  const getUser = db.prepare("SELECT id FROM users WHERE username = ?");
  const insertUser = db.prepare(
    "INSERT INTO users (username, display_name, bio) VALUES (?, ?, ?)"
  );
  const getItem = db.prepare(
    "SELECT id FROM clothing_items WHERE user_id = ? AND image_url = ?"
  );
  const insertItem = db.prepare(
    "INSERT INTO clothing_items (user_id, name, category, status, image_url) VALUES (?, ?, ?, ?, ?)"
  );
  const getOutfit = db.prepare("SELECT id FROM outfits WHERE code = ?");
  const setOutfitOwner = db.prepare("UPDATE outfits SET user_id = ? WHERE code = ?");
  const linkItem = db.prepare(
    "INSERT OR IGNORE INTO outfit_items (outfit_id, clothing_item_id) VALUES (?, ?)"
  );

  const displayName = (username) =>
    username
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const ensureUser = (username) => {
    let row = getUser.get(username);
    if (row) return row.id;
    insertUser.run(username, displayName(username), "feed demo closet");
    return getUser.get(username).id;
  };

  const ensureItem = (userId, slug) => {
    const meta = CATALOG_BY_SLUG[slug];
    if (!meta) return null;
    let row = getItem.get(userId, meta.image_url);
    if (!row) {
      insertItem.run(userId, meta.name, meta.category, meta.status, meta.image_url);
      row = getItem.get(userId, meta.image_url);
    }
    return row?.id ?? null;
  };

  const seedAll = db.transaction(() => {
    for (const o of FEED_SEED) {
      const userId = ensureUser(o.username);
      const outfit = getOutfit.get(o.code);
      if (!outfit) continue;

      setOutfitOwner.run(userId, o.code);
      for (const slug of o.items) {
        const itemId = ensureItem(userId, slug);
        if (itemId) linkItem.run(outfit.id, itemId);
      }
    }
  });
  seedAll();
})();

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

// turn an image path into its catalog slug ("/…/mint-cami.png" -> "mint-cami")
function slugFromImage(url) {
  return (url || "").split("/").pop().replace(/\.[^.]+$/, "");
}

// the catalog slugs that make up an outfit: prefer the stored seed list, else
// derive them from the linked clothing_items (image filename == catalog slug)
function outfitSlugs(outfit) {
  if (outfit.items_json) {
    try { return JSON.parse(outfit.items_json); } catch (_) { /* fall through */ }
  }
  return db
    .prepare(`
      SELECT ci.image_url FROM clothing_items ci
      JOIN outfit_items oi ON ci.id = oi.clothing_item_id
      WHERE oi.outfit_id = ?
    `)
    .all(outfit.id)
    .map((r) => slugFromImage(r.image_url))
    .filter(Boolean);
}

// shape a db outfit row into the post object the feed expects (same field names
// as the old hardcoded OUTFITS in data.js, so the feed mapping is unchanged)
function toFeedPost(o) {
  const author =
    o.username ||
    db.prepare("SELECT username FROM users WHERE id = ?").get(o.user_id)?.username ||
    "";
  let tags = [];
  if (o.tags) { try { tags = JSON.parse(o.tags); } catch (_) { /* leave [] */ } }
  let layout = null;
  if (o.layout) { try { layout = JSON.parse(o.layout); } catch (_) { /* leave null */ } }
  return {
    id: o.code || String(o.id),
    title: o.name,
    username: author,
    cover: o.image_url,
    overlayUrl: o.overlay_url || "",
    aspect: o.aspect || "tall",
    likes: o.likes || 0,
    comments: o.comments || 0,
    remixes: o.remix_count || 0,
    tags,
    aesthetic: o.aesthetic || "",
    items: outfitSlugs(o),
    layout,
    is_remix: !!o.is_remix,
    remixedFrom: o.remix_of_username || null,
  };
}

// GET /api/outfits — all outfits for the feed. user posts go first (newest
// first), then the demo posts, so a new look lands at the top of discover.
app.get("/api/outfits", (req, res) => {
  const rows = db
    .prepare(
      "SELECT * FROM outfits ORDER BY is_seed ASC, (CASE WHEN is_seed = 1 THEN id ELSE -id END) ASC"
    )
    .all();
  res.json(rows.map(toFeedPost));
});

// an outfit row plus the clothing items linked to it (or null if not found)
function getOutfitWithItems(id) {
  const outfit = db.prepare("SELECT * FROM outfits WHERE id = ?").get(id);
  if (!outfit) return null;
  outfit.items = db
    .prepare(`
      SELECT ci.*
      FROM clothing_items ci
      JOIN outfit_items oi ON ci.id = oi.clothing_item_id
      WHERE oi.outfit_id = ?
    `)
    .all(id);
  return outfit;
}

// POST /api/outfits — publish an outfit and link its items. occasion can come in
// as a string or an array (studio sends an array), and we only link item ids that
// actually belong to the user. remix fields are optional, set when it's a remix.
app.post("/api/outfits", (req, res) => {
  const body = req.body || {};
  const userId = Number(body.user_id);
  const name = String(body.name ?? body.title ?? "").trim() || "untitled";
  const notes = body.notes ?? null;
  const occasion = Array.isArray(body.occasion)
    ? body.occasion.join(", ")
    : body.occasion ?? null;
  const imageUrl = body.image_url ?? body.cover ?? null;
  const aspect = body.aspect === "wide" ? "wide" : "tall";

  const isRemix = body.is_remix ? 1 : 0;
  const remixOf = body.remix_of != null ? String(body.remix_of) : null;
  const remixOfUsername = body.remix_of_username ?? null;
  const layout =
    body.layout == null
      ? null
      : typeof body.layout === "string"
      ? body.layout
      : JSON.stringify(body.layout);

  const rawIds = body.item_ids ?? body.items ?? [];
  const itemIds = (Array.isArray(rawIds) ? rawIds : [])
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);

  // save the slugs too so the look can be remixed later, even for pieces the
  // user doesn't own (those never get an outfit_items link)
  let itemsJson = null;
  if (Array.isArray(body.layout)) {
    const slugs = body.layout
      .map((p) =>
        typeof p.item_id === "string" && /[a-z]/i.test(p.item_id)
          ? p.item_id
          : slugFromImage(p.image)
      )
      .filter(Boolean);
    if (slugs.length) itemsJson = JSON.stringify(slugs);
  }

  if (!Number.isInteger(userId) || userId <= 0)
    return res.status(400).json({ error: "user_id is required" });
  if (!db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId))
    return res.status(404).json({ error: "User not found" });

  // only link items that exist and belong to this user (ignore the rest)
  const ownsItem = db.prepare(
    "SELECT 1 FROM clothing_items WHERE id = ? AND user_id = ?"
  );
  const validIds = [...new Set(itemIds)].filter((id) => ownsItem.get(id, userId));

  // one transaction so a failed link can't leave a half-published outfit
  const publish = db.transaction(() => {
    const info = db
      .prepare(`
        INSERT INTO outfits
          (user_id, name, notes, occasion, image_url, aspect, is_remix, remix_of, remix_of_username, layout, items_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(userId, name, notes, occasion, imageUrl, aspect, isRemix, remixOf, remixOfUsername, layout, itemsJson);
    const outfitId = Number(info.lastInsertRowid);
    const link = db.prepare(
      "INSERT OR IGNORE INTO outfit_items (outfit_id, clothing_item_id) VALUES (?, ?)"
    );
    for (const itemId of validIds) link.run(outfitId, itemId);
    return outfitId;
  });

  res.status(201).json(getOutfitWithItems(publish()));
});

// GET /api/outfits/:id — a single outfit with its linked items
app.get("/api/outfits/:id", (req, res) => {
  const outfit = getOutfitWithItems(req.params.id);
  if (!outfit) return res.status(404).json({ error: "Outfit not found" });
  res.json(outfit);
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
  // drop the item links first — outfit_items has a FK to outfits, so deleting
  // the outfit while rows still reference it fails the constraint.
  const remove = db.transaction(() => {
    db.prepare("DELETE FROM outfit_items WHERE outfit_id = ?").run(id);
    db.prepare("DELETE FROM outfits WHERE id = ?").run(id);
  });
  remove();
  res.json({ message: "Outfit deleted" });
});

app.delete("/api/outfits", (req, res) => {
  const remove = db.transaction(() => {
    db.prepare(`
      DELETE FROM outfit_items WHERE outfit_id IN (
        SELECT id FROM outfits WHERE COALESCE(is_seed, 0) = 0
      )
    `).run();
    db.prepare("DELETE FROM outfits WHERE COALESCE(is_seed, 0) = 0").run();
  });
  remove();
  res.json({ message: "All user-published outfits deleted" });
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



app.get("/api/clothing-items", (req, res) => {
  try {
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

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
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

// ---- feed / posts routes ----

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

// GET /api/users/:id/outfits — their saved (non-remix) outfits (private-gated)
app.get("/api/users/:id/outfits", (req, res) => {
  const owner = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!owner) return res.status(404).json({ error: "User not found" });
  if (!canView(owner, getViewerId(req)))
    return res.status(403).json({ error: "This profile is private", private: true });

  const outfits = db
    .prepare(
      "SELECT * FROM outfits WHERE user_id = ? AND COALESCE(is_remix, 0) = 0 AND COALESCE(is_seed, 0) = 0 ORDER BY id DESC"
    )
    .all(owner.id);
  res.json(outfits);
});

// GET /api/users/:id/remixes — outfits this user remixed from others (private-gated)
app.get("/api/users/:id/remixes", (req, res) => {
  const owner = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!owner) return res.status(404).json({ error: "User not found" });
  if (!canView(owner, getViewerId(req)))
    return res.status(403).json({ error: "This profile is private", private: true });

  const remixes = db
    .prepare(
      "SELECT * FROM outfits WHERE user_id = ? AND is_remix = 1 AND COALESCE(is_seed, 0) = 0 ORDER BY id DESC"
    )
    .all(owner.id);
  res.json(remixes);
});

// DELETE /api/users/:id/outfits — wipe this user's published outfits + remixes
// (not the seed data). also clears their outfit_items and posts so nothing dangles.
app.delete("/api/users/:id/outfits", (req, res) => {
  const userId = Number(req.params.id);
  if (!db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId))
    return res.status(404).json({ error: "User not found" });

  const ids = db
    .prepare("SELECT id FROM outfits WHERE user_id = ? AND COALESCE(is_seed, 0) = 0")
    .all(userId)
    .map((r) => r.id);

  const wipe = db.transaction(() => {
    const delItems = db.prepare("DELETE FROM outfit_items WHERE outfit_id = ?");
    const delPosts = db.prepare("DELETE FROM posts WHERE outfit_id = ?");
    const delOutfit = db.prepare("DELETE FROM outfits WHERE id = ?");
    for (const id of ids) {
      delItems.run(id);
      delPosts.run(id);
      delOutfit.run(id);
    }
  });
  wipe();

  res.json({ deleted: ids.length });
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
// POST /api/users/:id/items — add a new clothing item to their wardrobe
app.post("/api/users/:id/items", (req, res) => {
  const userId = Number(req.params.id);
  const { name, category, status, color, image_url } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  const info = db.prepare(`
    INSERT INTO clothing_items (user_id, name, category, status, color, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, name, category || "top", status || "owned", color || null, image_url || null);

  const newItem = db.prepare("SELECT * FROM clothing_items WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(newItem);
});
// app.get("/api/admin/cleanup", (req, res) => {
//   const info = db.prepare("DELETE FROM clothing_items WHERE image_url IS NULL OR image_url = ''").run();
//   res.json({ deleted: info.changes });
// });
// app listen at bottom of file so everything is defined before
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});