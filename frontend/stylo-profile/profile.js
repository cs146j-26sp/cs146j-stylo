/******* stylo — Profile page helper funcs ******/
// shows a user's profile + outfits + closet. own profile = edit/privacy,
// someone else's = follow button. pulls everything from /api/users/:id.
// if the server's down it just falls back to the demo data in data.js.

window.addEventListener('stylo:ready', () => {
  const { ME, OUTFITS, ITEMS } = window.STYLO;
  const { itemCardHTML } = window.STYLO_UI;

  // no auth yet so "me" is just user 1
  const CURRENT_USER_ID = 1;

  // ?user=<id> in the url, otherwise it's your own profile
  const params = new URLSearchParams(location.search);
  const requestedId = Number(params.get("user"));
  const profileId =
    Number.isInteger(requestedId) && requestedId > 0 ? requestedId : CURRENT_USER_ID;
  const isOwnProfile = profileId === CURRENT_USER_ID;

  // little fetch wrapper — throws a flagged error on 403 so we can show the
  // "this profile is private" state instead of just blowing up
  async function getJSON(url) {
    const res = await fetch(url);
    if (res.status === 403) {
      const err = new Error("private");
      err.private = true;
      throw err;
    }
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }
  const viewerQS = `viewer_id=${CURRENT_USER_ID}`;

  function initialsOf(name) {
    return (name || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  // filled in by load()
  let profile = null;
  let outfits = [];
  let remixes = [];   // no remix endpoint yet, only the mock fallback uses this
  let items = [];
  let locked = false; // private profile we can't see

  // db rows -> the shapes the existing card renderers want
  const mapItem = (row) => ({
    id: String(row.id),
    name: row.name,
    image: row.image_url,
    status: row.status || "owned",
    category: row.category,
  });
  const mapOutfit = (row) => ({
    id: String(row.id),
    title: row.name || "untitled outfit",
    cover: row.image_url,
    likes: row.likes || 0,
    comments: row.comments || 0,
    remixes: row.remixes || 0,
  });

  // server unreachable -> use the demo data so the page still shows something
  function useMockData() {
    profile = {
      id: ME.id,
      username: ME.username,
      display_name: ME.displayName,
      bio: ME.bio,
      is_private: false,
      followers: ME.followers,
      following: ME.following,
      is_following: false,
      is_self: isOwnProfile,
    };
    outfits = OUTFITS.slice(0, 4);
    remixes = OUTFITS.slice(4);
    items = ITEMS;
    locked = false;
  }

  async function load() {
    try {
      profile = await getJSON(`/api/users/${profileId}?${viewerQS}`);
    } catch (_) {
      useMockData();
      return;
    }

    try {
      const [outfitRows, remixRows, itemRows] = await Promise.all([
        getJSON(`/api/users/${profileId}/outfits?${viewerQS}`),
        getJSON(`/api/users/${profileId}/remixes?${viewerQS}`),
        getJSON(`/api/users/${profileId}/items?${viewerQS}`),
      ]);
      outfits = outfitRows.map(mapOutfit);
      remixes = remixRows.map((row) => ({
        ...mapOutfit(row),
        remixedFrom: row.remix_of_username || null,
      }));
      items = itemRows.map(mapItem);
    } catch (err) {
      if (err.private) locked = true;
      outfits = remixes = items = [];
    }
  }

  function renderIdentity() {
    const name = profile.display_name || profile.username;
    document.getElementById("avatar-initials").textContent = initialsOf(name);
    document.getElementById("avatar-caption").textContent = "@" + profile.username;
    document.getElementById("profile-name").innerHTML =
      name + (profile.is_private ? ` <span class="private-badge" title="private profile">🔒</span>` : "");
    document.getElementById("profile-handle").textContent = "@" + profile.username;
    document.getElementById("profile-bio").textContent = profile.bio || "";

    const totalOutfits = outfits.length + remixes.length;
    document.getElementById("profile-stats").innerHTML = [
      { num: totalOutfits, label: "outfits" },
      { num: profile.followers, label: "followers", id: "stat-followers" },
      { num: profile.following, label: "following" },
    ]
      .map(
        (s) => `
        <div ${s.id ? `id="${s.id}"` : ""}>
          <div class="profile-stat-num">${Number(s.num).toLocaleString()}</div>
          <div class="profile-stat-label">${s.label}</div>
        </div>`
      )
      .join("");
  }

  function renderActions() {
    const btnEdit = document.getElementById("btn-edit-profile");
    const btnFollow = document.getElementById("btn-follow");

    if (isOwnProfile) {
      // your own profile — hide follow, keep edit
      btnFollow.hidden = true;
      btnEdit.hidden = false;
    } else {
      // someone else — hide edit, show follow
      btnEdit.hidden = true;
      btnFollow.hidden = false;
      setFollowButton(profile.is_following);
    }
  }

  function setFollowButton(following) {
    const btn = document.getElementById("btn-follow");
    btn.textContent = following ? "Following" : "Follow";
    btn.classList.toggle("btn-following", following);
  }

  function wireFollow() {
    const btn = document.getElementById("btn-follow");
    btn.addEventListener("click", async () => {
      const willFollow = !profile.is_following;
      const method = willFollow ? "POST" : "DELETE";
      btn.disabled = true;
      try {
        const data = await fetch(`/api/follow/${profileId}`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ follower_id: CURRENT_USER_ID }),
        }).then((r) => r.json());
        profile.is_following = data.following;
        profile.followers = data.followers;
      } catch (_) {
        // offline — just toggle it locally
        profile.is_following = willFollow;
        profile.followers += willFollow ? 1 : -1;
      }
      setFollowButton(profile.is_following);
      const numEl = document.querySelector("#stat-followers .profile-stat-num");
      if (numEl) numEl.textContent = Number(profile.followers).toLocaleString();
      btn.disabled = false;
    });
  }

  // copy text to the clipboard. navigator.clipboard needs https/localhost so if
  // that's not around (file://, plain ip) we fall back to the old textarea trick
  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {} // fall back below
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (_) {
      return false;
    }
  }

  function wireShare() {
    const btn = document.getElementById("btn-share");
    btn.addEventListener("click", async () => {
      const url = `${location.origin}${location.pathname}?user=${profileId}`;
      const original = btn.textContent;
      btn.textContent = (await copyText(url)) ? "Copied!" : "Copy failed";
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  }

  // edit modal — own profile only
  function wireEditModal() {
    const modal = document.getElementById("edit-modal");
    const privateInput = document.getElementById("edit-private");

    document.getElementById("btn-edit-profile").addEventListener("click", () => {
      document.getElementById("edit-name").value = profile.display_name || profile.username;
      document.getElementById("edit-bio").value = profile.bio || "";
      privateInput.checked = !!profile.is_private;
      modal.hidden = false;
    });

    const close = () => { modal.hidden = true; };
    document.getElementById("modal-close").addEventListener("click", close);
    document.getElementById("modal-cancel").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    document.getElementById("edit-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("edit-name").value.trim();
      const bio = document.getElementById("edit-bio").value.trim();
      const isPrivate = privateInput.checked;

      try {
        await fetch(`/api/users/${profileId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_name: name || null, bio, is_private: isPrivate }),
        });
      } catch (_) { /* offline — update the view anyway */ }

      if (name) profile.display_name = name;
      profile.bio = bio;
      profile.is_private = isPrivate;
      renderIdentity();
      close();
    });
  }

  let closetFilter = "all";

  function outfitCardHTML(o) {
    // show a badge on remixes so you can tell whose look it came from
    const remixBadge = o.remixedFrom
      ? `<span class="remix-tag"><span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle;">refresh</span> remix · @${o.remixedFrom}</span>`
      : "";
    return `
      <article class="outfit-card">
        <div class="outfit-cover">
          <img src="${o.cover}" alt="${o.title}" />
          ${remixBadge}
        </div>
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

  function renderTab(tab) {
    const root = document.getElementById("tab-content");

    if (locked) {
      root.innerHTML = `
        <div class="closet-empty profile-locked">
          🔒 this profile is private.<br />follow @${profile.username} to see their outfits and closet.
        </div>`;
      return;
    }

    if (tab === "closet") {
      const visible = closetFilter === "all" ? items : items.filter((it) => it.status === closetFilter);
      root.innerHTML = `
        <div class="profile-closet-filters">
          <div class="status-tabs">
            <button class="status-tab ${closetFilter === "all" ? "is-active" : ""}" data-filter="all">all</button>
            <button class="status-tab ${closetFilter === "owned" ? "is-active" : ""}" data-filter="owned">owned</button>
            <button class="status-tab ${closetFilter === "wishlist" ? "is-active" : ""}" data-filter="wishlist">wishlist</button>
          </div>
        </div>
        <div class="closet-grid">${visible.map((it) => itemCardHTML(it)).join("")}</div>
      `;
      root.querySelector(".status-tabs").addEventListener("click", (e) => {
        const btn = e.target.closest(".status-tab");
        if (!btn) return;
        closetFilter = btn.dataset.filter;
        renderTab("closet");
      });
      return;
    }

    const list = tab === "outfits" ? outfits : remixes;
    if (!list.length) { root.innerHTML = `<div class="closet-empty">nothing here yet.</div>`; return; }
    root.innerHTML = `<div class="outfit-grid">${list.map(outfitCardHTML).join("")}</div>`;
  }

  function renderTabCounts() {
    document.getElementById("count-outfits").textContent = outfits.length;
    document.getElementById("count-remixes").textContent = remixes.length;
    document.getElementById("count-closet").textContent = items.length;
  }

  function wireTabs() {
    document.getElementById("profile-tabs").addEventListener("click", (e) => {
      const btn = e.target.closest(".profile-tab");
      if (!btn) return;
      document.querySelectorAll(".profile-tab").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderTab(btn.dataset.tab);
    });
  }

  (async function init() {
    await load();
    renderIdentity();
    renderActions();
    renderTabCounts();
    wireTabs();
    wireShare();

    if (isOwnProfile) {
      wireEditModal();
    } else {
      wireFollow();
    }

    renderTab("outfits");
  })();
});
