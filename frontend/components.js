/****** shared helper functions for header + card design ******/

// small item card (studio sidebar, closet grid) for cut-out PNG 
function itemCardHTML(item, opts = {}) {
  const rot = opts.rotation != null
    ? opts.rotation
    : ((item.id.charCodeAt(0) % 5) - 2);

    // add clothing item to wishlist
  const wishBadge = item.status === "wishlist"
    ? `<span class="wishlist-badge">wish</span>` : "";
  return `
    <article class="item-card" data-item-id="${item.id}" style="--rot:${rot}deg;">
      <div class="item-photo">
        <img src="${item.image}" alt="${item.name}" draggable="false" />
      </div>
      <div class="item-caption">${item.name}</div>
      ${wishBadge}
    </article>`;
}

// shared header/menu design
// use basePath to fill in filepath, icons from google
function renderHeader(activePage = "", basePath = "../") {
  return `
    <header>
      <img class="menu-img" src="${basePath}uploads/paper1.png" alt="strip of paper">
      <a href="${basePath}stylo-studio/studio.html" class="logo">STYLO</a>
      <menu>
        <a href="${basePath}stylo-studio/studio.html"  class="menu-item ${activePage === 'studio' ? 'menu-item--active' : ''}"><h2>Studio</h2></a>
        <a href="${basePath}stylo-feed/feed.html"     class="menu-item ${activePage === 'feed'   ? 'menu-item--active' : ''}"><h2>Feed</h2></a>
        <a href="${basePath}stylo-closet/closet.html" class="menu-item ${activePage === 'closet' ? 'menu-item--active' : ''}"><h2>Closet</h2></a>
      </menu>
      <a href="${basePath}stylo-profile/profile.html" class="account" aria-label="Profile">
        <span class="material-symbols-outlined" style="font-size: 36px; color: var(--text);">account_circle</span>
      </a>
    </header>`;
}


// scrolling header animation
let origScrollY = 0; // track height of scroll

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY; // track current scroll height
// must init header query selector AFTER scroll event, 
// since header isn't initialized when pg first loads
  const headerElem = document.querySelector("header")

  if (currentScrollY > 60 && currentScrollY > origScrollY) {
      headerElem.classList.add("header-hidden");
  } else {
    // scrolling up → show
    headerElem.classList.remove("header-hidden");
  }

  // reset scroll relative to current scroll height on pg
  origScrollY = currentScrollY;
});

// add these to overall app UI
window.STYLO_UI = { itemCardHTML, renderHeader };
