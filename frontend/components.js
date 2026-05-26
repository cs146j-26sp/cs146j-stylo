/* ============================================
   stylo — shared UI helpers (vanilla JS)
   ============================================ */

// HTML for a small item card — used in studio sidebar + closet grid.
// Uses the cut-out PNG (no SVG silhouettes).
function itemCardHTML(item, opts = {}) {
  const rot = opts.rotation != null
    ? opts.rotation
    : ((item.id.charCodeAt(0) % 5) - 2);
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

// Compose a "shared" header. Mirrors feed's header so navigation/typography
// is consistent.
function renderHeader(activePage = "") {
  return `
    <header>
      <img class="menu-img" src="media/paper1.png" alt="">
      <a href="index.html" class="logo">STYLO</a>
      <menu>
        <a href="studio.html"  class="menu-item ${activePage === 'studio' ? 'menu-item--active' : ''}"><h2>Studio</h2></a>
        <a href="index.html"   class="menu-item ${activePage === 'feed'   ? 'menu-item--active' : ''}"><h2>Feed</h2></a>
        <a href="closet.html"  class="menu-item ${activePage === 'closet' ? 'menu-item--active' : ''}"><h2>Closet</h2></a>
      </menu>
      <a href="profile.html" class="account" aria-label="Profile">
        <span class="material-symbols-outlined" style="font-size: 36px; color: var(--text);">account_circle</span>
      </a>
    </header>`;
}

window.STYLO_UI = { itemCardHTML, renderHeader };
