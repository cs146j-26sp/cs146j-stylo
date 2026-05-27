// for frontend, load in placeholder data
const DISCOVER_POSTS = [
  {
    id: "1",
    username: "angela",
    avatarUrl: "",
    imageUrl: "media/post1tall.png",
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
    caption: "spring sprang sprung 🌸 #pollenallergies",
    likeCount: 200,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "3",
    username: "vivian",
    avatarUrl: "",
    imageUrl: "media/post3tall.png",
    caption: "you can never go wrong with layering #layeringtips",
    likeCount: 300,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "4",
    username: "kaycee",
    avatarUrl: "",
    imageUrl: "media/post4tall.png",
    caption: "farmer's market fit! #supportsmallbusinesses",
    likeCount: 400,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "5",
    username: "angelaaaa",
    avatarUrl: "",
    imageUrl: "media/post2wide.png",
    caption: "today's business casual outfit ✨ #powersuit #ootd",
    likeCount: 500,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "6",
    username: "hannahhh",
    avatarUrl: "",
    imageUrl: "media/post3tall.png",
    caption: "golden hour is my favorite time of the day #sunset",
    likeCount: 600,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "7",
    username: "viviannn",
    avatarUrl: "",
    imageUrl: "media/post4wide.png",
    caption: "pastel pink and green picnic #glinda&elphaba",
    likeCount: 700,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "8",
    username: "kayceeee",
    avatarUrl: "",
    imageUrl: "media/post1tall.png",
    caption: "who said airport outfits can't be cute? #zoommm",
    likeCount: 800,
    commentCount: 4,
    shareCount: 2,
  },
];

const FOLLOWING_POSTS = [
  {
    id: "9",
    username: "cinnamoroll",
    avatarUrl: "",
    imageUrl: "media/post2tall.png",
    caption: "not spelled cinnamonroll",
    likeCount: 100,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "10",
    username: "kuromi",
    avatarUrl: "",
    imageUrl: "media/post1wide.png",
    caption: "#blackandpink",
    likeCount: 200,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "11",
    username: "keroppi",
    avatarUrl: "",
    imageUrl: "media/post3tall.png",
    caption: "ribbit ribbit 💚",
    likeCount: 300,
    commentCount: 4,
    shareCount: 2,
  },
  {
    id: "12",
    username: "mymelody",
    avatarUrl: "",
    imageUrl: "media/post4wide.png",
    caption: "#pinkandwhite",
    likeCount: 400,
    commentCount: 4,
    shareCount: 2,
  },
];

// fake comments on post
const MOCK_COMMENTS = {
  "1": [
    { username: "angela", text: "i love this this palette" },
    { username: "hannah", text: "where is the top from??" },
  ],
  "2": [{ username: "vivian", text: "so cute!! 🌸" }],
  "3": [
    { username: "kaycee", text: "this is everything" },
    { username: "angela", text: "need those shoes immediately" },
  ],
  "9": [{ username: "hannah", text: "love love this coat on you" }],
  "11": [{ username: "vivian", text: "thrift goals" },
  { username: "kaycee", text: "ur my favorite influencer!!" }
  ],
};


// --------------state------------

const state = {
  currentPostId: null,
  currentTab: "discover",
  likedPosts: new Set(),
  sharedPosts: new Set(),
  postMap: new Map(),
  comments: structuredClone(MOCK_COMMENTS),
};


// -------------- feed functionality ------------

function loadPosts(tab = "discover") {
  const posts = tab === "following" ? FOLLOWING_POSTS : DISCOVER_POSTS;
  renderFeed(posts);
}

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

// -------------- indiv post functionality ------------

function createPostCard(post) {
  const card = document.createElement("div");
  card.className = "post-card";
  card.dataset.id = post.id;

  const avatar = 
  `<div class="avatar avatar-placeholder">${post.username[0].toUpperCase()}</div>`;

  card.innerHTML = `
    <div class="card-username">
      ${avatar} <strong>@${post.username}</strong>

    </div>
    <div class="card-img-wrapper">
      <img class="card-outfit-img" src="${post.imageUrl}" alt="outfit by ${post.username}" />
    </div>
    ${post.caption ? `<p class="card-caption">${post.caption}</p>` : ""}
    <div class="card-footer">
      <button class="action-btn like-btn ${state.likedPosts.has(post.id) ? "active" : ""}">
        <span class="material-symbols-outlined">favorite</span>
        <span class="action-count like-count">${post.likeCount}</span>
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

  card.querySelector(".like-btn").addEventListener("click", event => {
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
    post.likeCount = Math.max(0, post.likeCount - 1);
  } else {
    state.likedPosts.add(post.id);
    post.likeCount += 1;
  }

  card.querySelector(".like-btn").classList.toggle("active", !liked);
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
  syncModalCounts(post);
}

// -------------- popup modal functionality ------------

function openModal(post) {
  state.currentPostId = post.id;

  const avatar = post.avatarUrl
    ? `<img class="avatar" src="${post.avatarUrl}" alt="${post.username}" />`
    : `<div class="avatar avatar-placeholder">${post.username[0].toUpperCase()}</div>`;

  document.getElementById("post-username").innerHTML =
    `${avatar}<strong>@${post.username}</strong>`;

  document.getElementById("post-outfit-img").src = post.imageUrl;
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

// -------------- switching feed tabs functionality ------------

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
  loadPosts("discover");

  document.getElementById("discover-btn")
    .addEventListener("click", () => switchTab("discover"));
  document.getElementById("following-btn")
    .addEventListener("click", () => switchTab("following"));

  document.getElementById("post-close")
    .addEventListener("click", closeModal);
  document.getElementById("post-overlay")
    .addEventListener("click", event => {
      if (event.target.id === "post-overlay") closeModal();
    });

  document.getElementById("post-comment-btn")
    .addEventListener("click", postComment);
  document.getElementById("comment-input")
    .addEventListener("keydown", event => {
      if (event.key === "Enter") postComment();
    });

  document.getElementById("post-like-btn")
    .addEventListener("click", () => {
      const post = getPost(stat3e.currentPostId);
      const card = document.querySelector(`.post-card[data-id="${state.currentPostId}"]`);
      if (post && card) toggleLike(post, card);
    });

  document.getElementById("post-share-btn")
    .addEventListener("click", () => {
      const post = getPost(state.currentPostId);
      const card = document.querySelector(`.post-card[data-id="${state.currentPostId}"]`);
      if (post && card) toggleShare(post, card);
    });
});

