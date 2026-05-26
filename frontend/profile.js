/* ============================================
   stylo — Profile page logic
   ============================================ */
(function () {
  const { ME, OUTFITS, ITEMS, PALETTE } = window.STYLO;
  const { itemCardHTML } = window.STYLO_UI;

  // Populate identity
  document.getElementById("avatar-initials").textContent = ME.initials;
  document.getElementById("avatar-caption").textContent = "@" + ME.username;
  document.getElementById("profile-name").textContent = ME.displayName;
  document.getElementById("profile-handle").textContent = "@" + ME.username;
  document.getElementById("profile-bio").textContent = `"${ME.bio}"`;

  // Stats
  document.getElementById("profile-stats").innerHTML = [
    { num: OUTFITS.length, label: "outfits" },
    { num: ME.followers,   label: "followers" },
    { num: ME.following,   label: "following" },
  ].map((s) => `
    <div>
      <div class="profile-stat-num">${s.num.toLocaleString()}</div>
      <div class="profile-stat-label">${s.label}</div>
    </div>
  `).join("");

  // Tab counts
  const myOutfits = OUTFITS.slice(0, 4);         // pretend the first 4 are mine
  const myRemixes = OUTFITS.slice(4);            // and the rest are remixes
  document.getElementById("count-outfits").textContent = myOutfits.length;
  document.getElementById("count-remixes").textContent = myRemixes.length;
  document.getElementById("count-closet").textContent = ITEMS.length;

  // Render tab
  function renderTab(tab) {
    const root = document.getElementById("tab-content");
    if (tab === "closet") {
      root.innerHTML = `<div class="closet-grid">${
        ITEMS.map((it) => itemCardHTML(it)).join("")
      }</div>`;
      return;
    }
    const outfits = tab === "outfits" ? myOutfits : myRemixes;
    if (outfits.length === 0) {
      root.innerHTML = `<div class="closet-empty">nothing here yet.</div>`;
      return;
    }
    root.innerHTML = `<div class="outfit-grid">${outfits.map(outfitCardHTML).join("")}</div>`;
  }

  function outfitCardHTML(o) {
    return `
      <article class="outfit-card">
        <img src="${o.cover}" alt="${o.title}" />
        <div class="outfit-meta">
          <div class="outfit-title">${o.title}</div>
          <div class="outfit-sub">
            <span><span class="material-symbols-outlined" style="font-size:14px;">favorite</span>${o.likes}</span>
            <span><span class="material-symbols-outlined" style="font-size:14px;">360</span>${o.remixes}</span>
            <span><span class="material-symbols-outlined" style="font-size:14px;">comment</span>${o.comments}</span>
          </div>
        </div>
      </article>`;
  }

  document.getElementById("profile-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".profile-tab");
    if (!btn) return;
    document.querySelectorAll(".profile-tab").forEach((t) => t.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderTab(btn.dataset.tab);
  });

  renderTab("outfits");
})();
