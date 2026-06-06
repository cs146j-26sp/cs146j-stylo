
const DISCOVER_POSTS = [
  {
    id: "1",
    username: "angela",
    avatarUrl: "",
    //  overlayUrl: "media/items/mint-cami.png", // layer clothing on top
    imageUrl: "media/post1tall.png",
    overlayUrl: "media/items/mint-cami.png",
    caption: "check out my daily fit! #ootd",
    likeCount: 100,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "2",
    username: "hannah",
    avatarUrl: "",
    imageUrl: "media/post2wide.png",
    overlayUrl: "media/items/wash-shorts.png",
    caption: "spring sprang sprung 🌸 #cottagecore",
    likeCount: 200,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "3",
    username: "vivian",
    avatarUrl: "",
    imageUrl: "media/post3tall.png",
    overlayUrl: "media/items/puff-blouse.png",
    caption: "you can never go wrong with layering #darkacademia",
    likeCount: 300,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "4",
    username: "kaycee",
    avatarUrl: "",
    imageUrl: "media/post4wide.png",
    overlayUrl: "media/items/red-cap.png",
    caption: "farmer's market fit! #grunge",
    likeCount: 400,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "5",
    username: "angelaaaa",
    avatarUrl: "",
    imageUrl: "media/post3wide.png",
    overlayUrl: "media/items/tan-flats.png",
    caption: "today's business casual outfit ✨ #dark academia #ootd",
    likeCount: 500,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "6",
    username: "hannahhh",
    avatarUrl: "",
    imageUrl: "media/post4tall.png",
    overlayUrl: "media/items/rose-cami.png",
    caption: "golden hour is my favorite time of the day #Y2K",
    likeCount: 600,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "7",
    username: "viviannn",
    avatarUrl: "",
    imageUrl: "media/post1wide.png",
    overlayUrl: "media/items/valentin-tee.png",
    caption: "pastel pink and green picnic #cottagecore",
    likeCount: 700,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "8",
    username: "kayceeee",
    avatarUrl: "",
    imageUrl: "media/post2tall.png",
    overlayUrl: "media/items/olive-bag.png",
    caption: "who said airport outfits can't be cute? #grunge",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "9",
    username: "username",
    avatarUrl: "",
    imageUrl: "media/post1tall.png",
    overlayUrl: "media/items/wide-denim.png",
    caption: "caption here!",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "10",
    username: "username",
    avatarUrl: "",
    imageUrl: "media/post2wide.png",
    overlayUrl: "media/items/wide-jeans.png",
    caption: "caption here!",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "11",
    username: "username",
    avatarUrl: "",
    imageUrl: "media/post3tall.png",
    overlayUrl: "media/items/beige-flats.png",
    caption: "caption here!",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "12",
    username: "username",
    avatarUrl: "",
    imageUrl: "media/post4wide.png",
    overlayUrl: "media/items/brown-bag.png",
    caption: "caption here!",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "13",
    username: "username",
    avatarUrl: "",
    imageUrl: "media/post3wide.png",
    overlayUrl: "media/items/mint-cami.png",
    caption: "caption here!",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "14",
    username: "username",
    avatarUrl: "",
    imageUrl: "media/post4tall.png",
    overlayUrl: "media/items/olive-bag.png",
    caption: "caption here!",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "15",
    username: "username",
    avatarUrl: "",
    imageUrl: "media/post1wide.png",
    overlayUrl: "media/items/plaid-scrunchie.png",
    caption: "caption here!",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "16",
    username: "username",
    avatarUrl: "",
    imageUrl: "media/post2tall.png",
    overlayUrl: "media/items/puff-blouse.png",
    caption: "caption here!",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  }
];

const FOLLOWING_POSTS = [
  {
    id: "17",
    username: "cinnamoroll",
    avatarUrl: "",
    imageUrl: "media/post2tall.png",
    overlayUrl: "media/items/mint-cami.png",
    caption: "I love cinnamon rolls #Y2K",
    likeCount: 100,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "18",
    username: "kuromi",
    avatarUrl: "",
    imageUrl: "media/post1wide.png",
    overlayUrl: "media/items/mint-cami.png",
    caption: "black and pink #grunge",
    likeCount: 200,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "19",
    username: "keroppi",
    avatarUrl: "",
    imageUrl: "media/post3tall.png",
    overlayUrl: "media/items/mint-cami.png",
    caption: "ribbit ribbit #cottagecore 💚",
    likeCount: 300,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "20",
    username: "mymelody",
    avatarUrl: "",
    imageUrl: "media/post4wide.png",
    overlayUrl: "media/items/mint-cami.png",
    caption: "pink and white #ootd",
    likeCount: 400,
    commentCount: 4,
    shareCount: 2,
  },
];

// placeholder comments on post
const MOCK_COMMENTS = {
  "outfit1": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
  ],
  "outfit2": [{ username: "vivian", text: "so cute!! 🌸" },
        { username: "gudetama", text: "egg!" },
         { username: "kaycee", text: "my favorite influencer!" }
  ],
  "outfit3": [
    { username: "kaycee", text: "this is everything" },
    { username: "angela", text: "need those shoes immediately" },
        { username: "gudetama", text: "egg!" }
  ],
  "outfit4": [{ username: "vivian", text: "thrift goals" },
  { username: "kaycee", text: "my favorite influencer!" },
  { username: "hannah", text: "love love this coat on you" },
        { username: "gudetama", text: "egg!" }

  ],
  "outfit5": [{ username: "vivian", text: "thrift goals" },
  { username: "kaycee", text: "my favorite influencer!" },
  { username: "gudetama", text: "egg!" },
  { username: "gudetama", text: "egg!!" },
  { username: "gudetama", text: "egg!!!" }
  ],
  "outfit6": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
  ],
  "outfit7": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
    { username: "vivian", text: "thrift goals" },
  { username: "kaycee", text: "my favorite influencer!!" },
    { username: "gudetama", text: "egg!" }
  ],
  "outfit8": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
  ],
  "outfit9": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
      { username: "gudetama", text: "egg!" },
  { username: "gudetama", text: "egg!!" },
  { username: "gudetama", text: "egg!!!" }
  ],
  "outfit10": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
    { username: "vivian", text: "thrift goals" },
  { username: "kaycee", text: "my favorite influencer!!" }
  ],
  "outfit11": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
  ],
  "outfit12": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
  ],
  "outfit13": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
    { username: "vivian", text: "thrift goals" },
  { username: "kaycee", text: "my favorite influencer!!" },
      { username: "gudetama", text: "egg!" }

  ],
  "outfit14": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
  ],
  "outfit15": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
      { username: "gudetama", text: "egg!" },
  { username: "gudetama", text: "egg!!" },
  { username: "gudetama", text: "egg!!!" }
  ],
  "outfit16": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
    { username: "vivian", text: "thrift goals" },
  { username: "kaycee", text: "my favorite influencer!!" }
  ]
};

// -------------- update actual comment counts ------------
// helper func to count comments
function getCommentCount(post) {
  const comments = MOCK_COMMENTS[post];
  // ternary operator: return comments if there are any, otherwise 0
  return comments ? comments.length : 0;
}

// make the counts reflect actual # of comments
[...window.STYLO.OUTFITS].forEach(post => {
  // combine array using ...
  post.commentCount = getCommentCount(post.id);
});

// -------------- state ------------

const state = {
  currentPostId: null,
  currentTab: "discover",
  likedPosts: new Set(),
  sharedPosts: new Set(),
  postMap: new Map(),
  comments: structuredClone(MOCK_COMMENTS),
  // enable dropdown filters
  filters: {
    sortBy: "",
    aesthetic: "",
    category: "",
  }
};


// -------------- feed helper funcs ------------

function loadPosts(tab = "discover") {
  // if tab = following, change to following posts 
    const outfits = tab === "following"
  ? window.STYLO.OUTFITS.slice(8, 16)
  : window.STYLO.OUTFITS;

 // const outfits = window.STYLO.OUTFITS;
  const posts = outfits.map(outfit => ({
 
    // map all labels from data.js onto feed posts
    id: outfit.id, // must be id and NOT src to be able to find
    username: outfit.username ?? window.STYLO.ME.username,
    avatarUrl: outfit.avatarUrl ?? "",
    imageUrl: outfit.cover,
    overlayUrl: outfit.overlayUrl ?? "",
    caption: outfit.title,
    likeCount: outfit.likes,
    commentCount: MOCK_COMMENTS[outfit.id] 
    ? MOCK_COMMENTS[outfit.id].length : outfit.comments,
    shareCount: outfit.remixes,
    aspect: outfit.aspect,
    tags: outfit.tags ?? [],
    aesthetic: outfit.aesthetic ?? "",
    
  }));

  // filter posts by filter btns
  filteredPosts = filterPosts(posts);
  renderFeed(filteredPosts);
}

// helper func, returns array of filtered posts by dropdown btns
function filterPosts(posts) {
  // copy array to make edits to it
  let filtered = [...posts];

  // filter by aesthetic
  if (state.filters.aesthetic) {
    filtered = filtered.filter(post => {
  if (Array.isArray(post.aesthetic)) {
    return post.aesthetic.includes(state.filters.aesthetic);
  }
  return post.aesthetic === state.filters.aesthetic;
});
  }

  // filter by category/tag
  if (state.filters.category) {
    filtered = filtered.filter(post =>
      // check that post has tags at all
      post.tags && post.tags.includes(state.filters.category)
    );
  }

  // compare posts to apply dropdown filters
  if (state.filters.sortBy === "most-popular") { // sort by like count
    filtered.sort((firstPost, secondPost) => secondPost.likeCount - firstPost.likeCount);
  } else if (state.filters.sortBy === "oldest") {
    filtered.sort((firstPost, secondPost) => firstPost.id.localeCompare(secondPost.id));
  } else if (state.filters.sortBy === "most-recent") {
    filtered.sort((firstPost, secondPost) => secondPost.id.localeCompare(firstPost.id));
  }

  return filtered;
}

// helper func to load all posts in feed
function renderFeed(posts) {
  const container = document.getElementById("feed-container");
  container.innerHTML = "";
  state.postMap.clear();

  posts.forEach(post => state.postMap.set(post.id, post));

  const columns = [[], [], [], []];
  posts.forEach((post, i) => columns[i % 4].push(post));

  columns.forEach(colPosts => {
    const col = document.createElement("div");
    col.className = "feed-col";
    colPosts.forEach(post => col.appendChild(createPostCard(post)));
    container.appendChild(col);
  });
}

function getPost(postId) {
  return state.postMap.get(String(postId));
}

// -------------- infinite scroll helper funcs------------

const POSTS_PER_PAGE = 8;

// helper to append posts on load
function appendPosts(posts, page) {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = page * POSTS_PER_PAGE;
  const newPosts = posts.slice(start, end);

  const cols = document.querySelectorAll(".feed-col");

  newPosts.forEach((post, i) => {
    state.postMap.set(post.id, post);
    const col = cols[i % 4];
    if (col) col.appendChild(createPostCard(post));
  });
}

// // when user scrolls near bottom of screen div, this observer activates
// const infiniteScroll = document.querySelector("#infinite-scroll");

// const scrollObserver = new IntersectionObserver((entries) => {
//   // if sentinel is visible
//   if (entries[0].isIntersecting) {
//     // track current page status
//     const currentPosts
//       = state.currentTab === "following" ? FOLLOWING_POSTS : DISCOVER_POSTS;
//     const visible = state.currentPage * POSTS_PER_PAGE;
//     // if no more posts
//     if (visible >= currentPosts.length) return;

//     // only if we have 2+ pages?
//     state.currentPage += 1;
//     appendPosts(currentPosts, state.currentPage);
//   }
// }, { threshold: 0.1 }); // call observer when 10% of infiniteScroll is visible

// scrollObserver.observe(infiniteScroll);


// -------------- indiv post functionality ------------

function createPostCard(post) {
  const card = document.createElement("div");
  card.className = "post-card";
  card.dataset.id = post.id;

  const avatar =
    `<div class="avatar avatar-placeholder">${post.username[0].toUpperCase()}</div>`;

  // set up html for each post within JS to avoid hard coding
  card.innerHTML = `
        <div class="card-username">
      ${avatar} <strong>@${post.username}</strong>
    </div>
<div class="card-img-wrapper">
  <img class="card-outfit-img" src="${post.imageUrl}" alt="post frame bg" />
  ${
    post.overlayUrl
      ? `<img class="card-overlay-img" src="${post.overlayUrl}" alt="full outfit" />`
     
      : ""
  }
</div>
    ${post.caption ? `<p class="card-caption">${post.caption}</p>` : ""}
    <div class="card-footer">
      <button class="action-btn post-like-btn 
      ${state.likedPosts.has(post.id) ? "active" : ""}
      ">
        <span class="material-symbols-outlined">favorite</span>
        <span class="action-count like-count">
         ${post.likeCount}
        </span>
      </button>
      <button class="action-btn comment-btn">
        <span class="material-symbols-outlined">chat_bubble</span>
        <span class="action-count comment-count">${post.commentCount}</span>
      </button>
      <button class="action-btn share-btn ${state.sharedPosts.has(post.id) ? "active" : ""}">
        <span class="material-symbols-outlined">refresh</span>
        <span class="action-count share-count">${post.shareCount}</span>
      </button>
    </div>
  `;

  card.querySelector(".post-like-btn").addEventListener("click", event => {
    event.stopPropagation();
    toggleLike(post, card);
  });

  card.querySelector(".share-btn").addEventListener("click", event => {
    event.stopPropagation();
    toggleShare(post, card);
  });

  card.querySelector(".comment-btn").addEventListener("click", event => {
    event.stopPropagation();
    openModal(post);
  });

  card.addEventListener("click", () => openModal(post));

  return card;
}


// -------------- liking and sharing functionality ------------


function toggleLike(post, card) {
  const liked = state.likedPosts.has(post.id);

  if (liked) {
    state.likedPosts.delete(post.id);
    // decrease post like count, ensure likes don't < 0
    post.likeCount = Math.max(0, post.likeCount - 1);
  } else {
    state.likedPosts.add(post.id);
    post.likeCount += 1;
  }

  card.querySelector(".post-like-btn").classList.toggle("active", !liked);
  card.querySelector(".like-count").textContent = post.likeCount;

  syncModalCounts(post);
}

function toggleShare(post, card) {
  const shared = state.sharedPosts.has(post.id);

  if (shared) {
    state.sharedPosts.delete(post.id);
    post.shareCount = Math.max(0, post.shareCount - 1);
  } else {
    state.sharedPosts.add(post.id);
    post.shareCount += 1;
  }

  card.querySelector(".share-btn").classList.toggle("active", !shared);
  card.querySelector(".share-count").textContent = post.shareCount;

  // open up remix popup, add button functionality
  const sharePopup = document.querySelector(".share-popup");

  sharePopup.removeAttribute("hidden");


  syncModalCounts(post);
}


// -------------- overlay like count helper func ------------

function toggleLikeOverlay() {
const post = getPost(state.currentPostId);
  if (!post) return;

  const liked = state.likedPosts.has(post.id);

  if (liked) {
    state.likedPosts.delete(post.id);
    post.likeCount = Math.max(0, post.likeCount - 1);
  } else {
    state.likedPosts.add(post.id);
    post.likeCount += 1;
  }

  // update overlay button directly
  document.getElementById("post-like-btn")
    .classList.toggle("active", state.likedPosts.has(post.id));

  // sync the card in the feed too
  const card = document.querySelector(`.post-card[data-id="${post.id}"]`);
  if (card) {
    card.querySelector(".post-like-btn").classList.toggle("active", state.likedPosts.has(post.id));
    card.querySelector(".like-count").textContent = post.likeCount;
  }

  syncModalCounts(post);
}

// -------------- popup modal functionality ------------

function openModal(post) {
  state.currentPostId = post.id;
  const overlayCard = document.getElementById("post-overlay-card");

  // determine if image is tall
  const isTall = post.cover
    ? post.cover.includes("tall")
    : post.imageUrl?.includes("tall");
  // remove existing style classes, add the tall property back
  overlayCard.classList.remove("post-overlay-card--tall", "post-overlay-card--wide");
  overlayCard.classList.add(isTall ? "post-overlay-card--tall" : "post-overlay-card--wide");

  // set up profile placeholder
  const avatar = post.avatarUrl
    ? `<img class="avatar" src="${post.avatarUrl}" alt="${post.username}" />`
    : `<div class="avatar avatar-placeholder">${post.username[0].toUpperCase()}</div>`;

  document.getElementById("post-username").innerHTML =
    `${avatar}<strong>@${post.username}</strong>`;

  // load all images for post overlay
  document.getElementById("post-outfit-img").src = post.imageUrl;
  document.getElementById("post-overlay-img").src = post.overlayUrl ?? "";
  document.getElementById("post-caption").textContent = post.caption ?? "";

  syncModalCounts(post);

  document.getElementById("post-like-btn")
    .classList.toggle("active", state.likedPosts.has(post.id));
  document.getElementById("post-share-btn")
    .classList.toggle("active", state.sharedPosts.has(post.id));

  renderComments(state.comments[post.id] ?? []);

  document.getElementById("post-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("post-overlay").classList.remove("open");
  state.currentPostId = null;
}

function syncModalCounts(post) {
  if (state.currentPostId !== post.id) return;
  document.getElementById("post-like-count").textContent = post.likeCount;
  document.getElementById("post-comment-count").textContent = post.commentCount;
  document.getElementById("post-share-count").textContent = post.shareCount;
}


// -------------- comments functionality ------------

function renderComments(comments) {
  const list = document.getElementById("comments-list");

  if (!comments.length) {
    list.innerHTML = `<p class="empty-text">No comments yet. Be the first!</p>`;
    return;
  }

  list.innerHTML = comments.map(comment => `
    <div class="comment-item">
      <strong>@${comment.username}</strong>
      <span>${comment.text}</span>
    </div>
  `).join("");

  list.scrollTop = list.scrollHeight;
}

function postComment() {
  const input = document.getElementById("comment-input");
  const text = input.value.trim();
  if (!text || !state.currentPostId) return;

  const newComment = { username: "you", text };

  // save to local state so changes stay if reopening model
  if (!state.comments[state.currentPostId]) {
    state.comments[state.currentPostId] = [];
  }
  state.comments[state.currentPostId].push(newComment);

  // append to visible list in the feedd
  const list = document.getElementById("comments-list");
  const emptyMsg = list.querySelector(".empty-text");
  if (emptyMsg) {
    emptyMsg.remove();
  }

  const item = document.createElement("div");
  item.className = "comment-item";
  item.innerHTML = `<strong>@you</strong><span>${text}</span>`;
  list.appendChild(item);
  list.scrollTop = list.scrollHeight;

  // increment stat counts
  const post = getPost(state.currentPostId);
  if (post) {
    post.commentCount += 1;
    syncModalCounts(post);
    const cardCount = document.querySelector(
      `.post-card[data-id="${post.id}"] .comment-count`
    );
    if (cardCount) cardCount.textContent = post.commentCount;
  }

  input.value = "";
}

// -------------- switching feed tabs helper func ------------

function switchTab(tab) {
  state.currentTab = tab;
  document.getElementById("discover-btn")
    .classList.toggle("active-tab", tab === "discover");
  document.getElementById("following-btn")
    .classList.toggle("active-tab", tab === "following");
  loadPosts(tab);
}



// -------------- initialization functionality ------------

document.addEventListener("DOMContentLoaded", () => {
  // loadPosts("discover");
  if (window.STYLO && window.STYLO.OUTFITS) {
  loadPosts("discover");
} else {
  window.addEventListener("stylo:ready", () => loadPosts("discover"), { once: true });
}

  // clicking "create post" takes user to Studio page
  document.getElementById("post-btn")
    .addEventListener("click", () => {
      window.location.href = "../stylo-studio/studio.html";
    }); // ../ is to go up one level 

  // switch between feeds
  document.getElementById("discover-btn")
    .addEventListener("click", () => switchTab("discover"));
  document.getElementById("following-btn")
    .addEventListener("click", () => switchTab("following"));

  // open/close expanded post
  document.getElementById("post-close")
    .addEventListener("click", closeModal);
  document.getElementById("post-overlay")
    .addEventListener("click", event => {
      if (event.target.id === "post-overlay") closeModal();
    });

  // allow user to post comment 
  // can't do "submit" event listener since comments isn't a form element
  document.getElementById("submit-comment-btn")
    .addEventListener("click", postComment);
  document.getElementById("comment-input")
    .addEventListener("keydown", event => {
      if (event.key === "Enter") postComment();
    });

  // overlay- toggle like btn
  document.getElementById("post-like-btn").addEventListener("click", toggleLikeOverlay);

  // allow user to remix
  document.getElementById("post-share-btn")
    .addEventListener("click", () => {
      const post = getPost(state.currentPostId);
      const card = document.querySelector(`.post-card[data-id="${state.currentPostId}"]`);
      if (post && card) toggleShare(post, card);

    });

  // open remix pop-up
  const yesRemixBtn = document.querySelector(".share-btn-yes");
  const noRemixBtn = document.querySelector(".share-btn-close");

  yesRemixBtn.addEventListener("click", () => {
  const post = getPost(state.currentPostId);
  if (post) {
    // to remix, save post clothes to local storage
    localStorage.setItem("remixPost", JSON.stringify({
      id: post.id,
      imageUrl: post.imageUrl,
      overlayUrl: post.overlayUrl,
      caption: post.caption,
      username: post.username,
 
    }));
         console.log("remix worked");
  }
  window.location.href = "../stylo-studio/studio.html";
});

  noRemixBtn.addEventListener("click", () => {
    window.location.href = "../stylo-feed/feed.html";
    sharePopup.setAttribute("hidden");
  });

  noRemixBtn.addEventListener("click", () => {
  const sharePopup = document.getElementById("share-popup"); // add this
  sharePopup.setAttribute("hidden", "");
  // remove the window.location.href — this navigates away instead of just closing
});

  // add filter functionality
  document.getElementById("filter-sort").addEventListener("change", event => {
    state.filters.sortBy = event.target.value;
    loadPosts(state.currentTab);
  });

  document.getElementById("filter-aesthetic").addEventListener("change", event => {
    state.filters.aesthetic = event.target.value;
    loadPosts(state.currentTab);
  });

  document.getElementById("filter-category").addEventListener("change", event => {
    state.filters.category = event.target.value;
    loadPosts(state.currentTab);
  });

});

