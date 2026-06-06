/* ============================================
  my stylo studio!!
   this page lets users create outfit moodboards
   by dragging clothing items from their closet
   onto a customizable studio canvas.

   main features i worked on:
   - filtering closet items
   - drag/drop interactions
   - movable + editable outfit pieces
   - layering / scaling / rotating
   - shuffle outfit generation
   - syncing title inputs
   - publish toast interaction
============================================ */
window.addEventListener('stylo:ready', () => {
  const { ITEMS } = window.STYLO;         // ← now safe, data is loaded
  const CATALOG = window.STYLO.CATALOG || []; // every item, not just owned ones
  const { itemCardHTML } = window.STYLO_UI;
  const CURRENT_USER_ID = 1; // no auth yet so "me" is just user 1


  // stores every clothing item currently placed on the canvas
  // each object tracks:
  // - which clothing item it is
  // - x/y position on canvas
  // - scale size
  // - rotation
  // - z index layering
  let placements = [
    { item_id: "mint-cami",  x: 38, y: 30, scale: 1.00, rot: -2, z: 2 },
    { item_id: "wash-shorts",x: 44, y: 62, scale: 0.95, rot: 1,  z: 1 },
    { item_id: "tan-flats",  x: 56, y: 86, scale: 0.85, rot: -6, z: 3 },
    { item_id: "brown-bag",  x: 76, y: 48, scale: 0.90, rot: 8,  z: 4 },
  ];

  let selectedIdx = null;

  // keeps track of active sidebar filters
  // used to dynamically re-render closet items
  let statusFilter = "all";
  let catFilter = new Set(["tops", "bottoms", "shoes", "accessories"]);
  let searchQuery = "";

  const $ = (sel) => document.querySelector(sel);
  const canvas = $("#canvas");
  const closetList = $("#closet-list");
  const usedList = $("#used-list");
  const emptyHint = $("#canvas-empty-hint");

  // look up an item by id, checking the closet first then the full catalog
  // (so remixed pieces you don't own still show up on the canvas)
  function findItem(id) {
    return ITEMS.find((i) => i.id === id) || CATALOG.find((i) => i.id === id);
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function rand(a, b) {
    return Math.random() * (b - a) + a;
  }

  // gives different default sizes depending on clothing category
  // makes shoes/accessories appear naturally smaller than tops/dresses
  function baseSizeFor(category) {
    return {
      top: 240,
      outer: 250,
      bottom: 230,
      skirt: 230,
      dress: 260,
      shoes: 180,
      accessory: 170,
      hat: 160,
    }[category] || 220;
  }

  // ---- Sidebar closet ----

  // filters closet items based on selected status + category chips
  // returns only items matching current filters
  function getCatGroup(category) {
    if (["top", "outer"].includes(category)) return "tops";
    if (["bottom", "skirt"].includes(category)) return "bottoms";
    if (category === "shoes") return "shoes";
    if (["accessory", "hat"].includes(category)) return "accessories";
    return null;
  }

  function filteredItems() {
    return ITEMS.filter((it) => {
      if (statusFilter !== "all" && it.status !== statusFilter) return false;
      const group = getCatGroup(it.category);
      if (group !== null && !catFilter.has(group)) return false;
      if (searchQuery && !it.name.toLowerCase().includes(searchQuery)) return false;
      return true;
    });
  }

  // dynamically renders the left sidebar closet
  // each item becomes draggable onto the canvas
  function renderClosetList() {
    const items = filteredItems();

    if (items.length === 0) {
      closetList.innerHTML = `
        <div style="
          grid-column:1/-1;
          padding:24px 6px;
          font-family: var(--font-display);
          font-style: italic;
          color: var(--text);
          opacity: 0.55;
          text-align: center;
        ">
          no pieces match — loosen a filter.
        </div>
      `;
      return;
    }

    closetList.innerHTML = items
      .map((it) => itemCardHTML(it))
      .join("");

    closetList.querySelectorAll(".item-card").forEach((el) => {
      el.addEventListener("pointerdown", (e) => {
        startSidebarDrag(el.dataset.itemId, e);
      });
    });
  }

  // reusable helper for filter chips
  // updates active styling + rerenders closet items
  function bindChips(rowId, setter, selector) {
    const row = document.getElementById(rowId);

    row.addEventListener("click", (e) => {
      const btn = e.target.closest(selector);

      if (!btn) return;

      row.querySelectorAll(selector).forEach((c) => {
        c.classList.remove("is-active");
      });

      btn.classList.add("is-active");

      setter(btn);

      renderClosetList();
    });
  }

  bindChips(
    "status-chips",
    (btn) => {
      statusFilter = btn.dataset.status;
    },
    ".status-tab"
  );

  function bindMultiselect(dropdownId, allLabel, onChange) {
    const root = document.getElementById(dropdownId);
    const trigger = root.querySelector(".multiselect-trigger");
    const menu = root.querySelector(".multiselect-menu");
    const labelEl = root.querySelector(".multiselect-label");
    const checkboxes = root.querySelectorAll("input[type=checkbox]");

    function updateLabel() {
      const checked = [...checkboxes].filter(c => c.checked).map(c => c.value);
      if (checked.length === 0) {
        labelEl.textContent = "none";
      } else if (checked.length === checkboxes.length) {
        labelEl.textContent = allLabel;
      } else if (checked.length <= 2) {
        labelEl.textContent = checked.join(", ");
      } else {
        labelEl.textContent = checked.length + " selected";
      }
    }

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      root.classList.toggle("is-open");
    });

    menu.addEventListener("click", (e) => e.stopPropagation());

    menu.addEventListener("change", () => {
      const checked = new Set([...checkboxes].filter(c => c.checked).map(c => c.value));
      updateLabel();
      onChange(checked);
    });

    updateLabel();
  }

  document.addEventListener("click", () => {
    document.querySelectorAll(".multiselect.is-open").forEach(d => d.classList.remove("is-open"));
  });

  bindMultiselect("cat-dropdown", "all categories", (checked) => {
    catFilter = checked;
    renderClosetList();
  });

  bindMultiselect("occ-dropdown", "all occasions", () => {});

  const searchInput = document.getElementById("closet-search");
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderClosetList();
  });

  // ---- Canvas render ----

  // main render function for the studio canvas
  // rebuilds all placed clothing items visually
  // applies:
  // - position
  // - size
  // - rotation
  // - layering
  // based on placement data
  function renderCanvas() {
    canvas.querySelectorAll(".canvas-piece").forEach((p) => p.remove());

    placements.forEach((p, idx) => {
      const item = findItem(p.item_id);

      if (!item) return;

      const baseSize = baseSizeFor(item.category);
      const size = baseSize * p.scale;

      const el = document.createElement("div");

      el.className =
        "canvas-piece" +
        (idx === selectedIdx ? " is-selected" : "");

      el.style.cssText = `
        left:${p.x}%;
        top:${p.y}%;
        width:${size}px;
        height:${size}px;
        transform: translate(-50%, -50%) rotate(${p.rot}deg);
        z-index:${p.z + (idx === selectedIdx ? 1000 : 0)};
      `;

      el.innerHTML = `
        <img
          src="${item.image}"
          alt="${item.name}"
          draggable="false"
        />
      `;

      el.dataset.idx = idx;

      el.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        startCanvasDrag(idx, e);
      });

      canvas.appendChild(el);
    });

    emptyHint.style.display =
      placements.length === 0 ? "flex" : "none";

    renderUsed();
    renderSelectionToolbar();
  }

  // renders the "pieces on this page" sidebar
  // shows all unique items currently used in the outfit
  function renderUsed() {
    if (placements.length === 0) {
      usedList.innerHTML = `
        <div class="used-empty">nothing yet</div>
      `;
      return;
    }

    const uniqueIds = [
      ...new Set(placements.map((p) => p.item_id)),
    ];

    usedList.innerHTML = uniqueIds
      .map((id) => {
        const it = findItem(id);

        if (!it) return "";

        return `
          <div class="used-row">
            <span class="used-thumb">
              <img src="${it.image}" alt=""/>
            </span>

            <span class="used-name">${it.name}</span>

            <span class="used-meta">${it.category}</span>
          </div>
        `;
      })
      .join("");
  }

  // creates editing controls for selected clothing items
  // user can:
  // - resize
  // - rotate
  // - change layering
  // - remove pieces
  function renderSelectionToolbar() {
    const existing = canvas.querySelector(".piece-toolbar");

    if (existing) existing.remove();

    if (selectedIdx == null || !placements[selectedIdx]) return;

    const tb = document.createElement("div");

    tb.className = "piece-toolbar";

    tb.innerHTML = `
      <button data-act="bigger">＋</button>
      <button data-act="smaller">−</button>
      <button data-act="ccw">↺</button>
      <button data-act="cw">↻</button>
      <button data-act="front">↑ front</button>
      <button data-act="back">↓ back</button>
      <button data-act="remove" class="remove" title="remove item"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;vertical-align:middle;font-variation-settings:'FILL' 1">delete</span></button>
    `;

    tb.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
    });

    tb.addEventListener("click", (e) => {
      e.stopPropagation();

      const act =
        e.target.closest("button")?.dataset.act;

      if (!act) return;

      const p = placements[selectedIdx];

      if (!p) return;

      // updates placement properties depending on
      // which edit button user presses
      // then rerenders canvas so changes appear instantly

      if (act === "bigger") {
        p.scale = clamp(p.scale * 1.12, 0.3, 2.5);
      }

      if (act === "smaller") {
        p.scale = clamp(p.scale * 0.88, 0.3, 2.5);
      }

      if (act === "ccw") {
        p.rot -= 10;
      }

      if (act === "cw") {
        p.rot += 10;
      }

      if (act === "front") {
        p.z += 1;
      }

      if (act === "back") {
        p.z = Math.max(0, p.z - 1);
      }

      if (act === "remove") {
        placements.splice(selectedIdx, 1);
        selectedIdx = null;
      }

      renderCanvas();
    });

    canvas.appendChild(tb);
  }

  // allows already-placed clothing items
  // to be dragged around the canvas
  // converts mouse movement into percentage-based positioning
  // percentages help keep layout responsive
  function startCanvasDrag(idx, ev) {
    ev.preventDefault();

    selectedIdx = idx;

    renderCanvas();

    const rect = canvas.getBoundingClientRect();

    const startX = ev.clientX;
    const startY = ev.clientY;

    const start = placements[idx];

    const sx = start.x;
    const sy = start.y;

    function move(e) {
      const dx =
        ((e.clientX - startX) / rect.width) * 100;

      const dy =
        ((e.clientY - startY) / rect.height) * 100;

      start.x = clamp(sx + dx, 0, 100);
      start.y = clamp(sy + dy, 0, 100);

      renderCanvas();
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  // clicking empty canvas deselects current clothing item
  canvas.addEventListener("pointerdown", (e) => {
    if (
      e.target === canvas ||
      e.target.classList.contains("canvas-empty-hint") ||
      e.target.classList.contains("canvas-corner") ||
      e.target.classList.contains("canvas-stamp")
    ) {
      selectedIdx = null;
      renderCanvas();
    }
  });

  // handles dragging new clothing items
  // from sidebar onto canvas
  //
  // creates a floating ghost preview while dragging
  // when released inside canvas:
  // - creates new placement object
  // - adds item onto canvas
  // - rerenders everything
  function startSidebarDrag(itemId, ev) {
    ev.preventDefault();

    const item = findItem(itemId);

    if (!item) return;

    const ghost = document.createElement("div");

    ghost.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      width: 110px;
      height: 110px;
      transform: translate(-50%, -50%) rotate(-3deg);
      filter: drop-shadow(0 12px 22px rgba(46,19,18,0.30));
      opacity: 0.95;
    `;

    ghost.innerHTML = `
      <img
        src="${item.image}"
        style="width:100%; height:100%; object-fit:contain;"
        alt=""
      />
    `;

    document.body.appendChild(ghost);

    ghost.style.left = ev.clientX + "px";
    ghost.style.top = ev.clientY + "px";

    function move(e) {
      ghost.style.left = e.clientX + "px";
      ghost.style.top = e.clientY + "px";
    }

    function up(e) {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);

      const rect = canvas.getBoundingClientRect();

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inside) {
        const x =
          ((e.clientX - rect.left) / rect.width) * 100;

        const y =
          ((e.clientY - rect.top) / rect.height) * 100;

        const nextZ =
          placements.reduce(
            (m, p) => Math.max(m, p.z),
            0
          ) + 1;

        placements.push({
          item_id: itemId,
          x,
          y,
          scale: 0.95,
          rot: rand(-4, 4),
          z: nextZ,
        });

        selectedIdx = placements.length - 1;

        renderCanvas();
      }

      ghost.remove();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  // randomly generates an outfit using owned clothing items
  // picks tops, bottoms, shoes, and accessories
  // then auto-places them into styled positions on canvas
  function shuffleFit() {
    const owned = ITEMS.filter(i => i.status === "owned");
    const pick = (cats) => {
      const pool = owned.filter(i => cats.includes(i.category));
      return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    };

    const top    = pick(["top", "outer"]);
    const bottom = pick(["bottom", "skirt"]);
    const shoes  = pick(["shoes"]);
    const acc    = pick(["accessory", "hat"]);

    const picks = [top, bottom, shoes, acc].filter(Boolean);
    if (!picks.length) return;

    placements = picks.map((item, i) => ({
      item_id: item.id,
      x: 20 + i * 17,
      y: 28 + (i % 2) * 22,
      scale: 0.95,
      rot: rand(-5, 5),
      z: i + 1,
    }));
    selectedIdx = null;
    renderCanvas();
  }

  document.getElementById("shuffle-btn").addEventListener("click", shuffleFit);

  // ---- remix ----
  // coming in from "remix" on a feed post leaves a remixPost in localStorage.
  // rebuild that look on the canvas, mark it as a remix, and let the user add
  // any pieces they don't own to their closet

  let remixMeta = null; // set while we're remixing someone's post

  const basename = (u) => (u || "").split("/").pop();

  // feed covers are stored relative to /stylo-feed, so make them absolute and
  // the profile page can load them from its own folder too
  function normalizeCover(url) {
    if (!url) return null;
    if (/^https?:/.test(url) || url.startsWith("/")) return url;
    return "/stylo-feed/" + url.replace(/^\.?\//, "");
  }

  // strip the #hashtags out of a caption so it reads as a plain outfit name
  function stripHashtags(text) {
    return (text || "")
      .replace(/#[^\s#]+/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // lay out a list of slugs on the canvas — tops up top, bottoms in the
  // middle, shoes down low, accessories off to the side
  function flatlayPlacements(slugs) {
    const SPOTS = {
      tops: { x: 42, y: 30 },
      bottoms: { x: 46, y: 60 },
      shoes: { x: 55, y: 85 },
      accessories: { x: 76, y: 42 },
      other: { x: 50, y: 50 },
    };
    const used = {};
    return slugs
      .map((slug) => findItem(slug))
      .filter(Boolean)
      .map((item, i) => {
        const group = getCatGroup(item.category) || "other";
        const n = used[group] || 0;
        used[group] = n + 1;
        const spot = SPOTS[group] || SPOTS.other;
        return {
          item_id: item.id,
          x: clamp(spot.x + n * 12 - 4, 8, 92),
          y: clamp(spot.y + (group === "accessories" ? n * 16 : 0), 8, 92),
          scale: 0.95,
          rot: rand(-5, 5),
          z: i + 1,
        };
      });
  }

  // remix pieces the user doesn't own yet. match on the image filename since
  // owned items use numeric ids but the catalog is keyed by slug
  function missingItems(slugs) {
    const owned = new Set(ITEMS.map((i) => basename(i.image)));
    const seen = new Set();
    const out = [];
    for (const slug of slugs) {
      const item = findItem(slug);
      if (!item) continue;
      const base = basename(item.image);
      if (owned.has(base) || seen.has(base)) continue;
      seen.add(base);
      out.push(item);
    }
    return out;
  }

  function renderRemixBadge() {
    if (!remixMeta) return;
    let badge = document.getElementById("remix-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "remix-badge";
      badge.className = "remix-badge";
      const bar = document.querySelector(".studio-action-bar");
      if (bar) bar.appendChild(badge);
    }
    badge.innerHTML =
      `<span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;">refresh</span> ` +
      `remixing <strong>@${remixMeta.username}</strong>'s look`;
  }

  async function addRemixItem(slug, status, row) {
    const item = findItem(slug);
    if (!item) return;
    const payload = {
      user_id: CURRENT_USER_ID,
      name: item.name,
      category: item.category,
      status,
      image_url: item.image,
    };
    let newId = slug;
    try {
      const res = await fetch("/api/clothing-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.id != null) newId = String(data.id);
    } catch (_) {
      // offline — just add it locally
    }
    ITEMS.push({
      id: newId,
      name: item.name,
      category: item.category,
      status,
      image: item.image,
    });
    // now that it's owned it has a real id, so point any canvas piece still on
    // the slug at the new id (otherwise it won't get linked when we publish)
    if (newId !== slug) {
      let relinked = false;
      for (const p of placements) {
        if (p.item_id === slug) { p.item_id = newId; relinked = true; }
      }
      if (relinked) renderCanvas();
    }
    row.remove();
    renderClosetList();
    const panel = document.getElementById("remix-missing");
    if (panel && !panel.querySelector(".remix-missing-row")) panel.remove();
  }

  function renderMissingPanel(slugs) {
    const existing = document.getElementById("remix-missing");
    if (existing) existing.remove();

    const missing = missingItems(slugs);
    if (!missing.length) return;

    const panel = document.createElement("div");
    panel.id = "remix-missing";
    panel.className = "remix-missing";
    panel.innerHTML = `
      <div class="remix-missing-title">remixed pieces you don't own yet</div>
      ${missing
        .map(
          (it) => `
        <div class="remix-missing-row" data-id="${it.id}">
          <img src="${it.image}" alt="${it.name}" />
          <span class="remix-missing-name">${it.name}</span>
          <span class="remix-missing-actions">
            <button class="remix-add-btn" data-status="owned">+ closet</button>
            <button class="remix-add-btn ghost" data-status="wishlist">+ wishlist</button>
          </span>
        </div>`
        )
        .join("")}
    `;

    const anchor = document.getElementById("closet-list");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(panel, anchor);

    panel.querySelectorAll(".remix-add-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".remix-missing-row");
        addRemixItem(row.dataset.id, btn.dataset.status, row);
      });
    });
  }

  function loadRemix() {
    const raw = localStorage.getItem("remixPost");
    if (!raw) return;
    localStorage.removeItem("remixPost"); // consume so a refresh doesn't re-load

    let data;
    try {
      data = JSON.parse(raw);
    } catch (_) {
      return;
    }

    const slugs = Array.isArray(data.items) ? data.items : [];
    const built = flatlayPlacements(slugs);
    if (built.length) {
      placements = built;
      selectedIdx = null;
    }

    remixMeta = {
      sourceId: data.sourceId,
      username: data.username,
      title: data.title || "",
      cover: normalizeCover(data.cover),
    };

    // prefill the name with the original outfit's title so there's something to
    // start from, minus the hashtags. user can rename it before publishing
    const seedTitle = stripHashtags(data.title);
    const nameInput = document.getElementById("studio-name");
    const fitTitle = document.getElementById("fit-title");
    if (nameInput && seedTitle) nameInput.value = seedTitle;
    if (fitTitle && seedTitle) fitTitle.value = seedTitle;

    renderRemixBadge();
    renderMissingPanel(slugs);
  }

  // the publish button lives in the DOMContentLoaded block below, so hand it a
  // way to read the current canvas. only owned items have a real (numeric) db
  // id, so catalog-only pieces get dropped and we only link the real ones.
  // remix flags + the source cover go along when we're remixing.
  window.STYLO_STUDIO = {
    buildPublishPayload(title, occasion) {
      // remix placements use catalog slugs, not db ids, so build an image -> id
      // map of owned items and match by filename when a placement isn't numeric
      const ownedIdByImage = new Map();
      for (const it of ITEMS) {
        const nid = Number(it.id);
        if (Number.isInteger(nid) && nid > 0) ownedIdByImage.set(basename(it.image), nid);
      }
      const resolveOwnedId = (p) => {
        const direct = Number(p.item_id);
        if (Number.isInteger(direct) && direct > 0) return direct;
        const item = findItem(p.item_id);
        return item ? ownedIdByImage.get(basename(item.image)) ?? null : null;
      };
      const itemIds = [...new Set(placements.map(resolveOwnedId).filter((n) => n))];
      const layout = placements.map((p) => {
        const item = findItem(p.item_id);
        return { ...p, image: item?.image || null, name: item?.name || null };
      });
      const payload = {
        user_id: CURRENT_USER_ID,
        title: title || "untitled",
        occasion,
        item_ids: itemIds,
        layout,
        // feed uses a frame bg + the saved layout to show every piece
        image_url: remixMeta ? remixMeta.cover : "media/post1tall.png",
        aspect: "tall",
      };
      if (remixMeta) {
        payload.is_remix = 1;
        payload.remix_of = remixMeta.sourceId;
        payload.remix_of_username = remixMeta.username;
      }
      return payload;
    },
  };

  loadRemix();
  renderClosetList();
  renderCanvas();
});

// ---- Publish modal + title sync (no ITEMS needed, wire up on DOMContentLoaded) ----

function showToast(title) {
  const toast = document.createElement("div");
  toast.className = "studio-toast";
  toast.innerHTML = `posted — <span class="studio-toast-em">${title}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("in"));
  setTimeout(() => {
    toast.classList.remove("in");
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

document.addEventListener("DOMContentLoaded", () => {
  const studioName  = document.getElementById("studio-name");
  const fitTitle    = document.getElementById("fit-title");
  const publishModal = document.getElementById("publish-modal");
  const modalTitle  = document.getElementById("publish-modal-title");

  // keep both title fields in sync (bidirectional)
  studioName.addEventListener("input", () => {
    fitTitle.value = studioName.value;
  });
  fitTitle.addEventListener("input", () => {
    studioName.value = fitTitle.value;
  });

  // publish button → open modal (the POST happens on confirm below, which can
  // see the canvas + remix state through window.STYLO_STUDIO)
  document.getElementById("publish-btn").addEventListener("click", () => {
    modalTitle.textContent = studioName.value.trim() || "untitled";
    publishModal.classList.add("is-open");
  });

  // confirm → POST the outfit (carrying remix flags when remixing), then toast
  document.getElementById("publish-confirm-btn").addEventListener("click", async () => {
    publishModal.classList.remove("is-open");
    const title = studioName.value.trim() || "untitled";
    // the occasion(s) the user has checked in the "this fit" panel
    const occasion = [
      ...document.querySelectorAll("#occ-dropdown input[type=checkbox]:checked"),
    ].map((c) => c.value);
    try {
      const payload = window.STYLO_STUDIO?.buildPublishPayload(
        title,
        occasion.length ? occasion : null
      );
      if (payload) {
        // the feed reads from /api/outfits, so saving here is enough to make the
        // outfit show up at the top of discover (and on your profile)
        await fetch("/api/outfits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (_) {
      // offline — still show the toast
    }
    showToast(title);
  });

  // cancel → just close
  document.getElementById("publish-cancel-btn").addEventListener("click", () => {
    publishModal.classList.remove("is-open");
  });

  // click backdrop → close
  publishModal.addEventListener("click", (e) => {
    if (e.target === publishModal) publishModal.classList.remove("is-open");
  });
});