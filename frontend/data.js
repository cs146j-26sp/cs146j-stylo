/* ============================================
   stylo shared data
   Real clothing items with rembg-style cutouts.
   ============================================ */

// using cut-out PNGs in media/items/
// Each: { id, name, category, status, image }
const ITEMS = [
  // tops
  { id: "mint-cami", name: "mint cami", category: "top", status: "owned", image: "/stylo-feed/media/items/mint-cami.png", brand: "anyonemore" },
  { id: "rose-cami", name: "rose floral cami", category: "top", status: "owned", image: "/stylo-feed/media/items/rose-cami.png", brand: "Dayroze" },
  { id: "valentin-tee", name: "valentin tee", category: "top", status: "owned", image: "/stylo-feed/media/items/valentin-tee.png", brand: "BEIDELLI" },
  { id: "puff-blouse", name: "puff blouse", category: "top", status: "wishlist", image: "/stylo-feed/media/items/puff-blouse.png", brand: "peachmode" },

  // bottoms
  { id: "wash-shorts", name: "washed shorts", category: "bottom", status: "owned", image: "/stylo-feed/media/items/wash-shorts.png", brand: "anyonemore" },
  { id: "wide-denim", name: "wide denim shorts", category: "bottom", status: "owned", image: "/stylo-feed/media/items/wide-denim.png", brand: "peachmode" },
  { id: "wide-jeans", name: "wide leg jeans", category: "bottom", status: "wishlist", image: "/stylo-feed/media/items/wide-jeans.png", brand: "J-BLIN" },

  // shoes
  { id: "tan-flats", name: "tan ballet flats", category: "shoes", status: "owned", image: "/stylo-feed/media/items/tan-flats.png" },
  { id: "beige-flats", name: "beige ballet flats", category: "shoes", status: "owned", image: "/stylo-feed/media/items/beige-flats.png" },

  // bags
  { id: "brown-bag", name: "brown shoulder bag", category: "accessory", status: "owned", image: "/stylo-feed/media/items/brown-bag.png", brand: "wonderwonder" },
  { id: "black-bag", name: "black shoulder bag", category: "accessory", status: "owned", image: "/stylo-feed/media/items/black-bag.png", brand: "JASMINBELL" },
  { id: "olive-bag", name: "olive bag", category: "accessory", status: "wishlist", image: "/stylo-feed/media/items/olive-bag.png" },

  // accessories
  { id: "red-cap", name: "red cap", category: "accessory", status: "owned", image: "/stylo-feed/media/items/red-cap.png", brand: "BEIDELLI" },
  { id: "plaid-scrunchie", name: "plaid scrunchie", category: "accessory", status: "owned", image: "/stylo-feed/media/items/plaid-scrunchie.png" },
];

// demo user (current "you")
const ME = {
  id: "u1",
  username: "iris.m",
  displayName: "Iris Morgan",
  bio: "Writing my closet onto paper.",
  followers: 142,
  following: 89,
  initials: "IM",
};

// outfits: use the pre-rendered post images for cover art
const OUTFITS = [
    {
id: "o1", title: "saturday market outfit",
    occasion: "weekend",
    cover: "media/post1tall.png",
    overlayUrl: "media/items/mint-cami.png",
    aspect: "tall", likes: 124, comments: 12, remixes: 8,
    items: ["mint-cami", "wash-shorts", "tan-flats", "brown-bag"],
    tags: ["staples", "ootd"],
    aesthetic: "cottagecore"
  },

  {
     id: "o2", title: "office fit", occasion: "work", cover: "media/post2wide.png", aspect: "wide", likes: 89, comments: 6, remixes: 14,
    overlayUrl: "media/items/wash-shorts.png",
    items: ["puff-blouse", "wide-jeans", "beige-flats"],
    tags: ["inspo"],
    aesthetic: "grunge"
  },

  {
    id: "o3", title: "flowers and rain", occasion: "everyday",
    cover: "media/post3tall.png", aspect: "tall", likes: 312, comments: 28, remixes: 22,
    overlayUrl: "media/items/puff-blouse.png",
    items: ["rose-cami", "wide-denim", "black-bag"],
    tags: ["staples", "accessories"],
    aesthetic: ["y2k", "grunge"]
  },

  {
    id: "o4", title: "this outfit was inspired by my mom #shoutout mom", occasion: "everyday", 
    cover: "media/post4wide.png", aspect: "wide", likes: 540, comments: 41, remixes: 36,
    overlayUrl: "media/items/red-cap.png",
    items: ["valentin-tee", "wide-jeans", "tan-flats"],
    tags: ["accessories", "ootd"],
    aesthetic: "dark-academia"
  },

  {
    id: "o5", title: "sunday garden", occasion: "weekend", 
    cover: "media/post2tall.png", aspect: "tall", likes: 201, comments: 9, remixes: 5,
    overlayUrl: "media/items/rose-cami.png",
    items: ["mint-cami", "wide-denim", "beige-flats", "red-cap"],
    tags: ["inspo"],
    aesthetic: "cottagecore"
  },

  {
id: "o6", title: "cold weather", occasion: "weekend", 
    cover: "media/post4tall.png", aspect: "tall", likes: 178, comments: 11, remixes: 9,
    overlayUrl: "media/items/valentin-tee.png",
    items: ["valentin-tee", "wide-jeans", "olive-bag"],
    tags: ["staples", "ootd"],
    aesthetic: "grunge"
  },

  {
    id: "o7",
    title: "pastel pink and green picnic",
    occasion: "weekend",
    cover: "media/post1wide.png",
    overlayUrl: "media/items/valentin-tee.png",
    aspect: "wide",
    likes: 700,
    comments: 4,
    remixes: 2,
    items: ["valentin-tee"],
    tags: ["inspo"],
    aesthetic: "cottagecore"
  },

  {
    id: "o8",
    title: "who said airport outfits can't be cute?",
    occasion: "travel",
    cover: "media/post2tall.png",
    overlayUrl: "media/items/olive-bag.png",
    aspect: "tall",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["olive-bag"],
    tags: ["ootd"],
    aesthetic: "grunge"
  },

  {
    id: "o9",
    title: "caption here!",
    occasion: "everyday",
    cover: "media/post1tall.png",
    overlayUrl: "media/items/wide-denim.png",
    aspect: "tall",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["wide-denim"],
    tags: ["staples"],
    aesthetic: "grunge"
  },

  {
    id: "o10",
    title: "caption here!",
    occasion: "everyday",
    cover: "media/post2wide.png",
    overlayUrl: "media/items/wide-jeans.png",
    aspect: "wide",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["wide-jeans"],
    tags: ["staples"],
    aesthetic: "dark-academia"
  },

  {
    id: "o11",
    title: "caption here!",
    occasion: "everyday",
    cover: "media/post3tall.png",
    overlayUrl: "media/items/beige-flats.png",
    aspect: "tall",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["beige-flats"],
    tags: ["ootd"],
    aesthetic: "y2k"
  },

  {
    id: "o12",
    title: "caption here!",
    occasion: "everyday",
    cover: "media/post4wide.png",
    overlayUrl: "media/items/brown-bag.png",
    aspect: "wide",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["brown-bag"],
    tags: ["accessories"],
    aesthetic: "cottagecore"
  },

  {
    id: "o13",
    title: "caption here!",
    occasion: "everyday",
    cover: "media/post3wide.png",
    overlayUrl: "media/items/mint-cami.png",
    aspect: "wide",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["mint-cami"],
    tags: ["ootd"],
    aesthetic: "cottagecore"
  },

  {
    id: "o14",
    title: "caption here!",
    occasion: "everyday",
    cover: "media/post4tall.png",
    overlayUrl: "media/items/olive-bag.png",
    aspect: "tall",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["olive-bag"],
    tags: ["accessories"],
    aesthetic: "grunge"
  },

  {
    id: "o15",
    title: "caption here!",
    occasion: "everyday",
    cover: "media/post1wide.png",
    overlayUrl: "media/items/plaid-scrunchie.png",
    aspect: "wide",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["plaid-scrunchie"],
    tags: ["accessories"],
    aesthetic: "y2k"
  },

  {
    id: "o16",
    title: "caption here!",
    occasion: "everyday",
    cover: "media/post2tall.png",
    overlayUrl: "media/items/puff-blouse.png",
    aspect: "tall",
    likes: 800,
    comments: 4,
    remixes: 2,
    items: ["puff-blouse"],
    tags: ["staples"],
    aesthetic: "dark-academia"
  }
];

window.STYLO = { ITEMS, OUTFITS, ME };
