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
(function () {
  const { ITEMS } = window.STYLO;
  const { itemCardHTML } = window.STYLO_UI;

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

  const $ = (sel) => document.querySelector(sel);
  const canvas = $("#canvas");
  const closetList = $("#closet-list");
  const usedList = $("#used-list");
  const emptyHint = $("#canvas-empty-hint");

  function findItem(id) {
    return ITEMS.find((i) => i.id === id);
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
      if (group === null) return true;
      return catFilter.has(group);
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

  document.getElementById("cat-chips").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const cat = btn.dataset.cat;
    if (catFilter.has(cat)) {
      catFilter.delete(cat);
      btn.classList.remove("is-active");
    } else {
      catFilter.add(cat);
      btn.classList.add("is-active");
    }
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
      <button data-act="remove" class="remove">✕</button>
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

  document.getElementById("save-draft").addEventListener("click", () => {
    const toast = document.createElement("div");
    toast.className = "studio-toast";
    toast.innerHTML = `draft saved — <span class="studio-toast-em">keep going.</span>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("in"));
    setTimeout(() => {
      toast.classList.remove("in");
      setTimeout(() => toast.remove(), 350);
    }, 2200);
  });

  document.getElementById("publish-btn").addEventListener("click", () => {
    const title = document.getElementById("fit-title").value.trim() || "untitled";
    const toast = document.createElement("div");
    toast.className = "studio-toast";
    toast.innerHTML = `posted — <span class="studio-toast-em">${title}</span>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("in"));
    setTimeout(() => {
      toast.classList.remove("in");
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  });

  // keep both title inputs in sync
  const studioName = document.getElementById("studio-name");
  const fitTitle   = document.getElementById("fit-title");
  studioName.addEventListener("input", () => { fitTitle.value   = studioName.value; });
  fitTitle.addEventListener("input",   () => { studioName.value = fitTitle.value; });

  renderClosetList();
  renderCanvas();
})();