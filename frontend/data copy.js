/* ============================================
  data.js — loads from API instead of hardcoded
   ============================================ */

// Keep ME hardcoded (no users endpoint yet)
const ME = {
  id: "u1",
  username: "janestanford",
  displayName: "Jane Stanford",
  bio: "hi! welcome to my digital closet :)",
  followers: 142,
  following: 89,
  initials: "JS",
};

// Keep OUTFITS hardcoded (outfits table exists but has no cover/aspect/likes yet)
const OUTFITS = [
  
];

// Start empty — will be filled from DB
window.STYLO = { ITEMS: [], OUTFITS, ME };

// Fetch ITEMS from the backend
async function loadItems() {
  try {
    const res = await fetch('http://localhost:3000/api/clothing-items');
    const dbItems = await res.json();

    if (dbItems.length > 0) {
      // DB has items — use them
      window.STYLO.ITEMS = dbItems.map(item => ({
        ...item,
        image: item.image_url   // DB uses image_url, your UI uses image
      }));
    } else {
      // DB is empty — fall back to hardcoded items AND seed the DB
      window.STYLO.ITEMS = FALLBACK_ITEMS;
      seedDatabase(FALLBACK_ITEMS);
    }
  } catch (err) {
    console.warn('API unavailable, using fallback data', err);
    window.STYLO.ITEMS = FALLBACK_ITEMS;
  }

  window.dispatchEvent(new Event('stylo:ready'));
}

// Seed DB with your original hardcoded items (runs once if DB is empty)
async function seedDatabase(items) {
  for (const item of items) {
    await fetch('http://localhost:3000/api/clothing-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1,
        name: item.name,
        category: item.category,
        status: item.status,
        color: null,
        image_url: item.image   // map image → image_url for DB
      })
    });
  }
}

// Your original items as fallback
const FALLBACK_ITEMS = [
  { id: "mint-cami", name: "mint cami", category: "top", status: "owned", image: "/stylo-feed/media/items/mint-cami.png", brand: "anyonemore" },
  { id: "rose-cami", name: "rose floral cami", category: "top", status: "owned", image: "/stylo-feed/media/items/rose-cami.png", brand: "Dayroze" },
  { id: "valentin-tee", name: "valentin tee", category: "top", status: "owned", image: "/stylo-feed/media/items/valentin-tee.png", brand: "BEIDELLI" },
  { id: "puff-blouse", name: "puff blouse", category: "top", status: "wishlist", image: "/stylo-feed/media/items/puff-blouse.png", brand: "peachmode" },
  { id: "wash-shorts", name: "washed shorts", category: "bottom", status: "owned", image: "/stylo-feed/media/items/wash-shorts.png", brand: "anyonemore" },
  { id: "wide-denim", name: "wide denim shorts", category: "bottom", status: "owned", image: "/stylo-feed/media/items/wide-denim.png", brand: "peachmode" },
  { id: "wide-jeans", name: "wide leg jeans", category: "bottom", status: "wishlist", image: "/stylo-feed/media/items/wide-jeans.png", brand: "J-BLIN" },
  { id: "tan-flats", name: "tan ballet flats", category: "shoes", status: "owned", image: "/stylo-feed/media/items/tan-flats.png" },
  { id: "beige-flats", name: "beige ballet flats", category: "shoes", status: "owned", image: "/stylo-feed/media/items/beige-flats.png" },
  { id: "brown-bag", name: "brown shoulder bag", category: "accessory", status: "owned", image: "/stylo-feed/media/items/brown-bag.png", brand: "wonderwonder" },
  { id: "black-bag", name: "black shoulder bag", category: "accessory", status: "owned", image: "/stylo-feed/media/items/black-bag.png", brand: "JASMINBELL" },
  { id: "olive-bag", name: "olive bag", category: "accessory", status: "wishlist", image: "/stylo-feed/media/items/olive-bag.png" },
  { id: "red-cap", name: "red cap", category: "accessory", status: "owned", image: "/stylo-feed/media/items/red-cap.png", brand: "BEIDELLI" },
  { id: "plaid-scrunchie", name: "plaid scrunchie", category: "accessory", status: "owned", image: "/stylo-feed/media/items/plaid-scrunchie.png" },
];

loadItems(); // kick it off