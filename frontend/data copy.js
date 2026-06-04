
// demo user (current "you")
const ME = {
  id: "u1",
  username: "janestanford",
  displayName: "Jane Stanford",
  bio: "hi! welcome to my digital closet :)",
  followers: 142,
  following: 89,
  initials: "JS",
};

// outfits: use the pre-rendered post images for cover art
const OUTFITS = [
    {
id: "outfit1", title: "saturday market outfit",
    occasion: "weekend",
    cover: "media/post1tall.png",
    overlayUrl: "media/items/mint-cami.png",
    aspect: "tall", likes: 124, comments: 12, remixes: 8,
    items: ["mint-cami", "wash-shorts", "tan-flats", "brown-bag"],
    tags: ["staples", "ootd"],
    aesthetic: "cottagecore"
  },

  {
     id: "outfit2", title: "office fit", occasion: "work", cover: "media/post2wide.png", aspect: "wide", likes: 89, comments: 6, remixes: 14,
    overlayUrl: "media/items/wash-shorts.png",
    items: ["puff-blouse", "wide-jeans", "beige-flats"],
    tags: ["inspo"],
    aesthetic: "grunge"
  },

  {
    id: "outfit3", title: "flowers and rain", occasion: "everyday",
    cover: "media/post3tall.png", aspect: "tall", likes: 312, comments: 28, remixes: 22,
    overlayUrl: "media/items/puff-blouse.png",
    items: ["rose-cami", "wide-denim", "black-bag"],
    tags: ["staples", "accessories"],
    aesthetic: ["y2k", "grunge"]
  },

  {
    id: "outfit4", title: "this outfit was inspired by my mom #shoutout mom", occasion: "everyday", 
    cover: "media/post4wide.png", aspect: "wide", likes: 540, comments: 41, remixes: 36,
    overlayUrl: "media/items/red-cap.png",
    items: ["valentin-tee", "wide-jeans", "tan-flats"],
    tags: ["accessories", "ootd"],
    aesthetic: "dark-academia"
  },

  {
    id: "outfit5", title: "sunday garden", occasion: "weekend", 
    cover: "media/post2tall.png", aspect: "tall", likes: 201, comments: 9, remixes: 5,
    overlayUrl: "media/items/rose-cami.png",
    items: ["mint-cami", "wide-denim", "beige-flats", "red-cap"],
    tags: ["inspo"],
    aesthetic: "cottagecore"
  },

  {
id: "outfit6", title: "cold weather", occasion: "weekend", 
    cover: "media/post4tall.png", aspect: "tall", likes: 178, comments: 11, remixes: 9,
    overlayUrl: "media/items/valentin-tee.png",
    items: ["valentin-tee", "wide-jeans", "olive-bag"],
    tags: ["staples", "ootd"],
    aesthetic: "grunge"
  },

  {
    id: "outfit7",
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
    id: "outfit8",
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
    id: "outfit9",
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
    id: "outfit10",
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
    id: "outfit11",
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
    id: "outfit12",
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
    id: "outfit13",
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
    id: "outfit14",
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
    id: "outfit15",
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
    id: "outfit16",
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

