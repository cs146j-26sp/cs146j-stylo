/* ============================================
   stylo — Studio page logic (vanilla JS)
   Real-image item cards on canvas + sidebar.
   ============================================ */
(function () {
  const { ITEMS } = window.STYLO;
  const { itemCardHTML } = window.STYLO_UI;

  // ---- Pre-loaded opening composition (looks good on landing) ----
  // Coords are % of canvas; scale is multiplier on base size; rot in deg.
  let placements = [
    { item_id: "mint-cami",  x: 38, y: 30, scale: 1.00, rot: -2, z: 2 },
    { item_id: "wash-shorts",x: 44, y: 62, scale: 0.95, rot: 1,  z: 1 },
    { item_id: "tan-flats",  x: 56, y: 86, scale: 0.85, rot: -6, z: 3 },
    { item_id: "brown-bag",  x: 76, y: 48, scale: 0.90, rot: 8,  z: 4 },
  ];
  let selectedIdx = null;
  // Filters
  let statusFilter = "all";
  let catFilter = "all";

  const $ = (sel) => document.querySelector(sel);
  const canvas = $("#canvas");
  const closetList = $("#closet-list");
  const usedList = $("#used-list");
  const emptyHint = $("#canvas-empty-hint");

  function findItem(id) { return ITEMS.find((i) => i.id === id); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rand(a, b) { return Math.random() * (b - a) + a; }

  // ---- Item base size in CSS px (varies per category so e.g. shoes are smaller) ----
  function baseSizeFor(category) {
    return {
      top:       240,
      outer:     250,
      bottom:    230,
      skirt:     230,
      dress:     260,
      shoes:     180,
      accessory: 170,
      hat:       160,
    }[category] || 220;
  }

  // ---- Sidebar closet ----
  function filteredItems() {
    return ITEMS.filter((it) => {
      if (statusFilter !== "all" && it.status !== statusFilter) return false;
      if (catFilter === "all") return true;
      if (catFilter === "tops")        return ["top","outer"].includes(it.category);
      if (catFilter === "bottoms")     return ["bottom","skirt"].includes(it.category);
      if (catFilter === "shoes")       return it.category === "shoes";
      if (catFilter === "accessories") return ["accessory","hat"].includes(it.category);
      return true;
    });
  }

  function renderClosetList() {
    const items = filteredItems();
    if (items.length === 0) {
      closetList.innerHTML = `<div style="grid-column:1/-1; padding:24px 6px; font-family: var(--font-display); font-style: italic; color: var(--text); opacity: 0.55; text-align: center;">no pieces match — loosen a filter.</div>`;
      return;
    }
    closetList.innerHTML = items.map((it) => itemCardHTML(it)).join("");
    closetList.querySelectorAll(".item-card").forEach((el) => {
      el.addEventListener("pointerdown", (e) => startSidebarDrag(el.dataset.itemId, e));
    });
  }

  function bindChips(rowId, setter, selector) {
    const row = document.getElementById(rowId);
    row.addEventListener("click", (e) => {
      const btn = e.target.closest(selector);
      if (!btn) return;
      row.querySelectorAll(selector).forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      setter(btn);
      renderClosetList();
    });
  }
  bindChips("status-chips", (btn) => { statusFilter = btn.dataset.status; }, ".status-tab");
  bindChips("cat-chips",    (btn) => { catFilter    = btn.dataset.cat;    }, ".chip");

  // ---- Canvas render ----
  function renderCanvas() {
    canvas.querySelectorAll(".canvas-piece").forEach((p) => p.remove());

    placements.forEach((p, idx) => {
      const item = findItem(p.item_id);
      if (!item) return;
      const baseSize = baseSizeFor(item.category);
      const size = baseSize * p.scale;
      const el = document.createElement("div");
      el.className = "canvas-piece" + (idx === selectedIdx ? " is-selected" : "");
      el.style.cssText = `
        left:${p.x}%; top:${p.y}%;
        width:${size}px; height:${size}px;
        transform: translate(-50%, -50%) rotate(${p.rot}deg);
        z-index:${p.z + (idx === selectedIdx ? 1000 : 0)};
      `;
      el.innerHTML = `<img src="${item.image}" alt="${item.name}" draggable="false" />`;
      el.dataset.idx = idx;
      el.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        startCanvasDrag(idx, e);
      });
      canvas.appendChild(el);
    });

    emptyHint.style.display = placements.length === 0 ? "flex" : "none";
    renderUsed();
    renderSelectionToolbar();
  }

  function renderUsed() {
    if (placements.length === 0) {
      usedList.innerHTML = `<div class="used-empty">nothing yet</div>`;
      return;
    }
    const uniqueIds = [...new Set(placements.map((p) => p.item_id))];
    usedList.innerHTML = uniqueIds.map((id) => {
      const it = findItem(id);
      if (!it) return "";
      return `
        <div class="used-row">
          <span class="used-thumb"><img src="${it.image}" alt=""/></span>
          <span class="used-name">${it.name}</span>
          <span class="used-meta">${it.category}</span>
        </div>`;
    }).join("");
  }

  function renderSelectionToolbar() {
    const existing = canvas.querySelector(".piece-toolbar");
    if (existing) existing.remove();
    if (selectedIdx == null || !placements[selectedIdx]) return;
    const tb = document.createElement("div");
    tb.className = "piece-toolbar";
    tb.innerHTML = `
      <button data-act="bigger" title="bigger">＋</button>
      <button data-act="smaller" title="smaller">−</button>
      <button data-act="ccw" title="rotate left">↺</button>
      <button data-act="cw" title="rotate right">↻</button>
      <button data-act="front" title="bring to front">↑ front</button>
      <button data-act="back" title="send to back">↓ back</button>
      <button data-act="remove" class="remove" title="remove">✕</button>
    `;
    tb.addEventListener("pointerdown", (e) => e.stopPropagation());
    tb.addEventListener("click", (e) => {
      e.stopPropagation();
      const act = e.target.closest("button")?.dataset.act;
      if (!act) return;
      const p = placements[selectedIdx];
      if (!p) return;
      if (act === "bigger")  p.scale = clamp(p.scale * 1.12, 0.3, 2.5);
      if (act === "smaller") p.scale = clamp(p.scale * 0.88, 0.3, 2.5);
      if (act === "ccw")     p.rot -= 10;
      if (act === "cw")      p.rot += 10;
      if (act === "front")   p.z += 1;
      if (act === "back")    p.z = Math.max(0, p.z - 1);
      if (act === "remove") {
        placements.splice(selectedIdx, 1);
        selectedIdx = null;
      }
      renderCanvas();
    });
    canvas.appendChild(tb);
  }

  // ---- Drag a placement around the canvas ----
  function startCanvasDrag(idx, ev) {
    ev.preventDefault();
    selectedIdx = idx;
    renderCanvas();
    const rect = canvas.getBoundingClientRect();
    const startX = ev.clientX, startY = ev.clientY;
    const start = placements[idx];
    const sx = start.x, sy = start.y;
    function move(e) {
      const dx = ((e.clientX - startX) / rect.width) * 100;
      const dy = ((e.clientY - startY) / rect.height) * 100;
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

  // Click empty canvas → deselect
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

  // ---- Drag from sidebar onto canvas ----
  function startSidebarDrag(itemId, ev) {
    ev.preventDefault();
    const item = findItem(itemId);
    if (!item) return;

    const ghost = document.createElement("div");
    ghost.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 110px; height: 110px;
      transform: translate(-50%, -50%) rotate(-3deg);
      filter: drop-shadow(0 12px 22px rgba(46,19,18,0.30));
      opacity: 0.95;
    `;
    ghost.innerHTML = `<img src="${item.image}" style="width:100%; height:100%; object-fit:contain;" alt=""/>`;
    document.body.appendChild(ghost);
    ghost.style.left = ev.clientX + "px";
    ghost.style.top  = ev.clientY + "px";

    function move(e) {
      ghost.style.left = e.clientX + "px";
      ghost.style.top  = e.clientY + "px";
    }
    function up(e) {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (inside) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        const nextZ = placements.reduce((m, p) => Math.max(m, p.z), 0) + 1;
        placements.push({
          item_id: itemId,
          x, y,
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

  // ---- Shuffle ----
  $("#shuffle-btn").addEventListener("click", () => {
    const owned = ITEMS.filter((i) => i.status === "owned");
    const tops    = owned.filter((i) => ["top","outer"].includes(i.category));
    const bottoms = owned.filter((i) => ["bottom","skirt"].includes(i.category));
    const shoes   = owned.filter((i) => i.category === "shoes");
    const accs    = owned.filter((i) => ["accessory","hat"].includes(i.category));
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const next = [];
    const add = (it, x, y, scale, rot, z) =>
      it && next.push({ item_id: it.id, x, y, scale, rot, z });
    add(pick(tops),    40 + rand(-4,4), 28 + rand(-2,2), 1.0,  rand(-4,4), 2);
    add(pick(bottoms), 44 + rand(-4,4), 60 + rand(-2,2), 0.95, rand(-4,4), 1);
    add(pick(shoes),   54 + rand(-4,4), 86 + rand(-2,2), 0.85, rand(-8,8), 3);
    if (Math.random() > 0.3) add(pick(accs), 76 + rand(-6,6), 48 + rand(-6,6), 0.85, rand(-10,10), 4);
    placements = next;
    selectedIdx = null;
    renderCanvas();
  });

  document.getElementById("occasion-chips").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    document.querySelectorAll("#occasion-chips .chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
  });

  // Sync the two name inputs
  const nameTop  = document.getElementById("studio-name");
  const nameSide = document.getElementById("fit-title");
  nameTop.addEventListener("input",  () => { nameSide.value = nameTop.value; });
  nameSide.addEventListener("input", () => { nameTop.value  = nameSide.value; });

  // Publish — show a soft toast
  document.getElementById("publish-btn").addEventListener("click", () => {
    const name = nameTop.value || "untitled fit";
    const toast = document.createElement("div");
    toast.className = "studio-toast";
    toast.innerHTML = `
      <span class="studio-toast-em">published.</span>
      &nbsp;“${name}” is on the feed.
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.classList.add("in"); });
    setTimeout(() => {
      toast.classList.remove("in");
      setTimeout(() => toast.remove(), 350);
    }, 2600);
  });

  renderClosetList();
  renderCanvas();
})();
