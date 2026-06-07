/******* stylo — shared data for all the pages ******/
// ITEMS come from the backend (clothing_items), ME gets refreshed from the
// api too. both fall back to hardcoded stuff if the server isn't up. once
// ITEMS are in we fire 'stylo:ready' so studio/closet/profile can render.
// OUTFITS stays hardcoded — the outfits table doesn't have cover/likes/etc yet.

// no auth yet so "me" is just user 1
const CURRENT_USER_ID = 1;

// keep ME defined right away (and only update it in place, never replace it)
// so feed.js can read window.STYLO.ME before the fetch finishes
const ME = {
  id: CURRENT_USER_ID,
  username: "janestanford",
  displayName: "Jane Stanford",
  bio: "hi! welcome to my digital closet :)",
  followers: 142,
  following: 89,
  initials: "JS",
};

// outfits: use the pre-rendered post images for cover art (hardcoded for now)
const OUTFITS = [
  { id: "outfit1", title: "saturday market outfit #cottagecore #staples #ootd", username: "angela", occasion: "weekend", cover: "media/talloutfit1.png", aspect: "tall", likes: 124, comments: 12, remixes: 8, items: ["mint-cami", "wash-shorts", "tan-flats", "brown-bag"], tags: ["staples", "ootd"], aesthetic: "cottagecore" },
  { id: "outfit2", title: "florals for spring #grunge #inspo #accessories", username: "hannah",occasion: "work", cover: "media/post2wide.png", aspect: "wide", likes: 89, comments: 6, remixes: 14, overlayUrl: "media/wideoutfit1.png", items: ["rose-cami", "wide-jeans"], tags: ["inspo", "accessories"], aesthetic: "grunge" },
  { id: "outfit3", title: "I wore this to the art museum! #y2k #staples #accessories", username: "kaycee",occasion: "everyday", cover: "media/talloutfit2.png", overlayUrl: "", aspect: "tall", likes: 312, comments: 5, remixes: 22, items: ["rose-cami", "wide-denim", "black-bag"], tags: ["staples", "accessories"], aesthetic: "y2k" },
  { id: "outfit4", title: "my mom picked this outfit #darkacademia #ootd #accessories", username: "vivian", occasion: "everyday", cover: "media/post4wide.png", aspect: "wide", likes: 540, comments: 41, remixes: 36, overlayUrl: "media/wideoutfit2.png", items: ["valentin-tee", "wide-jeans", "tan-flats"], tags: ["accessories", "ootd"], aesthetic: "dark-academia" },
  { id: "outfit5", title: "my favorite band #grunge #inspo", username: "gudetama", occasion: "weekend", cover: "media/post3wide.png", aspect: "wide", likes: 201, comments: 9, remixes: 5, overlayUrl: "media/wideoutfit3.png", items: ["mint-cami", "wide-denim", "beige-flats", "red-cap"], tags: ["inspo"], aesthetic: "grunge" },
  { id: "outfit6", title: "yes, chef #grunge #staples #ootd", username: "my_melody", occasion: "weekend", cover: "media/talloutfit3.png", overlayUrl: "", aspect: "tall", likes: 178, comments: 11, remixes: 9, items: ["valentin-tee", "wide-jeans", "olive-bag"], tags: ["staples", "ootd"], aesthetic: "grunge" },
  { id: "outfit7", title: "seasonal wardrobe staples #cottagecore #inspo #accessories", username: "keroppi", occasion: "weekend", cover: "media/post1wide.png", overlayUrl: "media/wideoutfit4.png", aspect: "wide", likes: 700, comments: 4, remixes: 2, items: ["valentin-tee"], tags: ["inspo", "accessories"], aesthetic: "cottagecore" },
  { id: "outfit8", title: "walking on sunshine #y2k #ootd", username: "pompompurin",  occasion: "travel", cover: "media/talloutfit4.png", overlayUrl: "", aspect: "tall", likes: 800, comments: 4, remixes: 2, items: ["olive-bag"], tags: ["ootd"], aesthetic: "y2k" },
  { id: "outfit9", title: "pastel pink and green <3 #cottagecore #staples", username: "cinnamoroll", occasion: "everyday", cover: "media/talloutfit5.png", overlayUrl: "", aspect: "tall", likes: 800, comments: 4, remixes: 2, items: ["wide-denim"], tags: ["staples"], aesthetic: "cottagecore" },
  { id: "outfit10", title: "fall outfit! #darkacademia #staples", username: "pochacco", occasion: "everyday", cover: "media/post2wide.png", overlayUrl: "media/wideoutfit5.png", aspect: "wide", likes: 800, comments: 4, remixes: 2, items: ["wide-jeans"], tags: ["staples"], aesthetic: "dark-academia" },
  { id: "outfit11", title: "can you hear the ocean? #y2k #ootd", username: "hello_kitty", occasion: "everyday", cover: "media/talloutfit6.png", overlayUrl: "", aspect: "tall", likes: 800, comments: 4, remixes: 2, items: ["beige-flats"], tags: ["ootd"], aesthetic: "y2k" },
  { id: "outfit12", title: "art deco #y2k #accessories", username: "kuromi", occasion: "everyday", cover: "media/post4wide.png", overlayUrl: "media/wideoutfit6.png", aspect: "wide", likes: 800, comments: 4, remixes: 2, items: ["brown-bag"], tags: ["accessories"], aesthetic: "y2k" },
  { id: "outfit13", title: "having a good time #grunge #ootd", username: "chococat", occasion: "everyday", cover: "media/post3wide.png", overlayUrl: "media/wideoutfit7.png", aspect: "wide", likes: 800, comments: 4, remixes: 2, items: ["mint-cami"], tags: ["ootd"], aesthetic: "grunge" },
  { id: "outfit14", title: "outfit for when you want to feel like a butterfly #y2k #accessories", username: "aggretsuko", occasion: "everyday", cover: "media/talloutfit7.png", overlayUrl: "", aspect: "tall", likes: 800, comments: 4, remixes: 2, items: ["olive-bag"], tags: ["accessories"], aesthetic: "y2k" },
  { id: "outfit15", title: "frolicking in san francisco #y2k #accessories", username: "hangyodon", occasion: "everyday", cover: "media/post1wide.png", overlayUrl: "media/wideoutfit8.png", aspect: "wide", likes: 800, comments: 4, remixes: 2, items: ["plaid-scrunchie"], tags: ["accessories"], aesthetic: "y2k" },
  { id: "outfit16", title: "bumblebee inspired color scheme #darkacademia #staples", username: "tuxedosam", occasion: "everyday", cover: "media/talloutfit8.png", overlayUrl: "", aspect: "tall", likes: 800, comments: 4, remixes: 2, items: ["puff-blouse"], tags: ["staples"], aesthetic: "dark-academia" },
];

// fallback wardrobe for when the api can't be reached
const FALLBACK_ITEMS = [
  { id: "mint-cami", name: "mint cami", category: "top", status: "owned", image: "/stylo-feed/media/items/mint-cami.png" },
  { id: "rose-cami", name: "rose floral cami", category: "top", status: "owned", image: "/stylo-feed/media/items/rose-cami.png" },
  { id: "valentin-tee", name: "valentin tee", category: "top", status: "owned", image: "/stylo-feed/media/items/valentin-tee.png" },
  { id: "puff-blouse", name: "puff blouse", category: "top", status: "wishlist", image: "/stylo-feed/media/items/puff-blouse.png" },
  { id: "wash-shorts", name: "washed shorts", category: "bottom", status: "owned", image: "/stylo-feed/media/items/wash-shorts.png" },
  { id: "wide-denim", name: "wide denim shorts", category: "bottom", status: "owned", image: "/stylo-feed/media/items/wide-denim.png" },
  { id: "wide-jeans", name: "wide leg jeans", category: "bottom", status: "wishlist", image: "/stylo-feed/media/items/wide-jeans.png" },
  { id: "tan-flats", name: "tan ballet flats", category: "shoes", status: "owned", image: "/stylo-feed/media/items/tan-flats.png" },
  { id: "beige-flats", name: "beige ballet flats", category: "shoes", status: "owned", image: "/stylo-feed/media/items/beige-flats.png" },
  { id: "brown-bag", name: "brown shoulder bag", category: "accessory", status: "owned", image: "/stylo-feed/media/items/brown-bag.png" },
  { id: "black-bag", name: "black shoulder bag", category: "accessory", status: "owned", image: "/stylo-feed/media/items/black-bag.png" },
  { id: "olive-bag", name: "olive bag", category: "accessory", status: "wishlist", image: "/stylo-feed/media/items/olive-bag.png" },
  { id: "red-cap", name: "red cap", category: "accessory", status: "owned", image: "/stylo-feed/media/items/red-cap.png" },
  { id: "plaid-scrunchie", name: "plaid scrunchie", category: "accessory", status: "owned", image: "/stylo-feed/media/items/plaid-scrunchie.png" },
];

// start empty — ITEMS gets filled below, ME/OUTFITS are ready now
// CATALOG keeps the whole item list around so studio can look up an outfit's
// pieces by slug ("mint-cami" etc) even for stuff the user doesn't own
window.STYLO = { ITEMS: [], OUTFITS, ME, CATALOG: FALLBACK_ITEMS };

function initialsFrom(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// grab the latest ME from the backend (counts, bio, etc), update in place
async function loadMe() {
  try {
    const res = await fetch(`/api/users/${CURRENT_USER_ID}`);
    if (!res.ok) return;
    const u = await res.json();
    ME.username = u.username ?? ME.username;
    ME.displayName = u.display_name ?? ME.displayName;
    ME.bio = u.bio ?? ME.bio;
    ME.followers = u.followers ?? ME.followers;
    ME.following = u.following ?? ME.following;
    ME.initials = initialsFrom(ME.displayName);
  } catch (_) {
    // keep the hardcoded ME
  }
}

// load my closet from the db. db calls it image_url, the ui wants image.
async function loadItems() {
  try {
    // identify ourselves as the viewer so the privacy gate lets us load our own
    // closet even when our profile is set to private (owner can always view).
    const res = await fetch(
      `/api/users/${CURRENT_USER_ID}/items?viewer_id=${CURRENT_USER_ID}`
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    const rows = await res.json();
    window.STYLO.ITEMS = rows.length
      ? rows.map((r) => ({
        id: String(r.id),
        name: r.name,
        category: r.category,
        status: r.status || "owned",
        image: r.image_url,
      }))
      : FALLBACK_ITEMS;
  } catch (err) {
    console.warn("api down, using fallback closet", err);
    window.STYLO.ITEMS = FALLBACK_ITEMS;
  }
}

// load everything then let the pages know they're good to go.
// the loaders catch their own errors so this always fires.
(async function boot() {
  await Promise.all([loadMe(), loadItems()]);
  window.dispatchEvent(new Event("stylo:ready"));
})();
