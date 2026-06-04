/* ============================================
   stylo — Profile page logic
   ============================================ */
(function () {
  const { ME, OUTFITS, ITEMS } = window.STYLO;
  const { itemCardHTML } = window.STYLO_UI;

  // Populate identity
  document.getElementById("avatar-initials").textContent = ME.initials;
  document.getElementById("avatar-caption").textContent  = "@" + ME.username;
  document.getElementById("profile-name").textContent    = ME.displayName;
  document.getElementById("profile-handle").textContent  = "@" + ME.username;
  document.getElementById("profile-bio").textContent     = `${ME.bio}`;

  // Stats
  document.getElementById("profile-stats").innerHTML = [
    { num: OUTFITS.length, label: "outfits" },
    { num: ME.followers,   label: "followers", id: "stat-followers" },
    { num: ME.following,   label: "following" },
  ].map(s => `
    <div ${s.id ? `id="${s.id}"` : ""}>
      <div class="profile-stat-num">${s.num.toLocaleString()}</div>
      <div class="profile-stat-label">${s.label}</div>
    </div>
  `).join("");

  // Tab counts
  const myOutfits = OUTFITS.slice(0, 4);
  const myRemixes = OUTFITS.slice(4);
  document.getElementById("count-outfits").textContent = myOutfits.length;
  document.getElementById("count-remixes").textContent = myRemixes.length;
  document.getElementById("count-closet").textContent  = ITEMS.length;

  // ── Follow / unfollow ──────────────────────────────────────
  let followers  = ME.followers;
  let isFollowed = false;
  const btnFollow = document.getElementById("btn-follow");

  btnFollow.addEventListener("click", () => {
    isFollowed = !isFollowed;
    followers += isFollowed ? 1 : -1;
    btnFollow.textContent = isFollowed ? "Following" : "Follow";
    btnFollow.classList.toggle("btn-following", isFollowed);
    document.querySelector("#stat-followers .profile-stat-num").textContent = followers.toLocaleString();
  });

  // ── Edit profile modal ─────────────────────────────────────
  const modal = document.getElementById("edit-modal");

  document.getElementById("btn-edit-profile").addEventListener("click", () => {
    document.getElementById("edit-name").value = document.getElementById("profile-name").textContent;
    document.getElementById("edit-bio").value  = ME.bio;
    modal.hidden = false;
  });

  document.getElementById("modal-close").addEventListener("click",  () => { modal.hidden = true; });
  document.getElementById("modal-cancel").addEventListener("click", () => { modal.hidden = true; });
  modal.addEventListener("click", e => { if (e.target === modal) modal.hidden = true; });

  document.getElementById("edit-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("edit-name").value.trim();
    const bio  = document.getElementById("edit-bio").value.trim();
    if (name) {
      document.getElementById("profile-name").textContent    = name;
      document.getElementById("avatar-initials").textContent = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    }
    if (bio) document.getElementById("profile-bio").textContent = `"${bio}"`;
    modal.hidden = true;
  });

  // ── Tabs ───────────────────────────────────────────────────
  let closetFilter = "all";

  function renderTab(tab) {
    const root = document.getElementById("tab-content");

    if (tab === "closet") {
      const visible = closetFilter === "all" ? ITEMS : ITEMS.filter(it => it.status === closetFilter);
      root.innerHTML = `
        <div class="profile-closet-filters">
          <div class="status-tabs">
            <button class="status-tab ${closetFilter === "all"      ? "is-active" : ""}" data-filter="all">all</button>
            <button class="status-tab ${closetFilter === "owned"    ? "is-active" : ""}" data-filter="owned">owned</button>
            <button class="status-tab ${closetFilter === "wishlist" ? "is-active" : ""}" data-filter="wishlist">wishlist</button>
          </div>
        </div>
        <div class="closet-grid">${visible.map(it => itemCardHTML(it)).join("")}</div>
      `;
      root.querySelector(".status-tabs").addEventListener("click", e => {
        const btn = e.target.closest(".status-tab");
        if (!btn) return;
        closetFilter = btn.dataset.filter;
        renderTab("closet");
      });
      return;
    }

    const outfits = tab === "outfits" ? myOutfits : myRemixes;
    if (!outfits.length) { root.innerHTML = `<div class="closet-empty">nothing here yet.</div>`; return; }
    root.innerHTML = `<div class="outfit-grid">${outfits.map(outfitCardHTML).join("")}</div>`;
  }

  function outfitCardHTML(o) {
    return `
      <article class="outfit-card">
        <img src="${o.cover}" alt="${o.id}" />
        <div class="outfit-meta">
          <div class="outfit-title">
          ${o.title}</div>
          <div class="outfit-sub">
            <span><span class="material-symbols-outlined" style="font-size:14px;">favorite</span>${o.likes}</span>
            <span><span class="material-symbols-outlined" style="font-size:14px;">360</span>${o.remixes}</span>
            <span><span class="material-symbols-outlined" style="font-size:14px;">comment</span>${o.comments}</span>
          </div>
        </div>
      </article>`;
  }

  document.getElementById("profile-tabs").addEventListener("click", e => {
    const btn = e.target.closest(".profile-tab");
    if (!btn) return;
    document.querySelectorAll(".profile-tab").forEach(t => t.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderTab(btn.dataset.tab);
  });

  renderTab("outfits");
})();
