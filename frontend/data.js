/* ============================================
   stylo — shared data
   Real clothing items with rembg-style cutouts.
   ============================================ */

// Items — using cut-out PNGs in media/items/
// Each: { id, name, category, status, image, brand? }
const ITEMS = [
  // tops
  { id: "mint-cami",      name: "mint cami",         category: "top",       status: "owned",    image: "media/items/mint-cami.png",     brand: "anyonemore" },
  { id: "rose-cami",      name: "rose floral cami",  category: "top",       status: "owned",    image: "media/items/rose-cami.png",     brand: "Dayroze" },
  { id: "valentin-tee",   name: "valentin tee",      category: "top",       status: "owned",    image: "media/items/valentin-tee.png",  brand: "BEIDELLI" },
  { id: "puff-blouse",    name: "puff blouse",       category: "top",       status: "wishlist", image: "media/items/puff-blouse.png",   brand: "peachmode" },

  // bottoms
  { id: "wash-shorts",    name: "washed shorts",     category: "bottom",    status: "owned",    image: "media/items/wash-shorts.png",   brand: "anyonemore" },
  { id: "wide-denim",     name: "wide denim shorts", category: "bottom",    status: "owned",    image: "media/items/wide-denim.png",    brand: "peachmode" },
  { id: "wide-jeans",     name: "wide leg jeans",    category: "bottom",    status: "wishlist", image: "media/items/wide-jeans.png",    brand: "J-BLIN" },

  // shoes
  { id: "tan-flats",      name: "tan ballet flats",  category: "shoes",     status: "owned",    image: "media/items/tan-flats.png" },
  { id: "beige-flats",    name: "beige ballet flats",category: "shoes",     status: "owned",    image: "media/items/beige-flats.png" },

  // bags
  { id: "brown-bag",      name: "brown shoulder bag",category: "accessory", status: "owned",    image: "media/items/brown-bag.png",     brand: "wonderwonder" },
  { id: "black-bag",      name: "black shoulder bag",category: "accessory", status: "owned",    image: "media/items/black-bag.png",     brand: "JASMINBELL" },
  { id: "olive-bag",      name: "olive bag",         category: "accessory", status: "wishlist", image: "media/items/olive-bag.png" },

  // accessories
  { id: "red-cap",        name: "red cap",           category: "accessory", status: "owned",    image: "media/items/red-cap.png",       brand: "BEIDELLI" },
  { id: "plaid-scrunchie",name: "plaid scrunchie",   category: "accessory", status: "owned",    image: "media/items/plaid-scrunchie.png" },
];

// Demo user (current "you")
const ME = {
  id: "u1",
  username: "iris.m",
  displayName: "Iris Morgan",
  bio: "Writing my closet onto paper.",
  followers: 142,
  following: 89,
  initials: "IM",
};

// Outfits — use the pre-rendered post images for cover art
const OUTFITS = [
  { id: "o1", title: "saturday market",     occasion: "weekend",  cover: "media/post1tall.png", aspect: "tall", likes: 124, comments: 12, remixes: 8,
    items: ["mint-cami","wash-shorts","tan-flats","brown-bag"] },
  { id: "o2", title: "office, quietly",     occasion: "work",     cover: "media/post2wide.png", aspect: "wide", likes: 89,  comments: 6,  remixes: 14,
    items: ["puff-blouse","wide-jeans","beige-flats"] },
  { id: "o3", title: "warm rain",           occasion: "everyday", cover: "media/post3tall.png", aspect: "tall", likes: 312, comments: 28, remixes: 22,
    items: ["rose-cami","wide-denim","black-bag"] },
  { id: "o4", title: "uniform 03",          occasion: "everyday", cover: "media/post4wide.png", aspect: "wide", likes: 540, comments: 41, remixes: 36,
    items: ["valentin-tee","wide-jeans","tan-flats"] },
  { id: "o5", title: "sunday garden",       occasion: "weekend",  cover: "media/post2tall.png", aspect: "tall", likes: 201, comments: 9,  remixes: 5,
    items: ["mint-cami","wide-denim","beige-flats","red-cap"] },
  { id: "o6", title: "cold walk",           occasion: "weekend",  cover: "media/post4tall.png", aspect: "tall", likes: 178, comments: 11, remixes: 9,
    items: ["valentin-tee","wide-jeans","olive-bag"] },
];

window.STYLO = { ITEMS, OUTFITS, ME };
