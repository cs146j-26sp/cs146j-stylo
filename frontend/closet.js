/* ============================================
   stylo — Closet page logic
   Filterable item grid, vanilla JS.
   ============================================ */
(function () {
  const { ITEMS, PALETTE } = window.STYLO;
  const { itemCardHTML } = window.STYLO_UI;

  const filters = { status: "all", category: "all", color: "all" };

  // Build the color chip row from distinct colors in items.
  const colorChips = document.getElementById("color-chips");
  const distinctColors = [...new Set(ITEMS.map((i) => i.color))];
  colorChips.innerHTML =
    `<button class="chip is-active" data-value="all">all</button>` +
    distinctColors.map((c) => `
      <button class="chip" data-value="${c}">
        <span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:${PALETTE[c]}; border:1px solid rgba(0,0,0,0.18); margin-right:6px; vertical-align:-1px;"></span>${c}
      </button>
    `).join("");

  // Wire filter chip rows.
  document.querySelectorAll(".chip-row[data-group]").forEach((row) => {
    row.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      row.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      filters[row.dataset.group] = btn.dataset.value;
      render();
    });
  });

  function visibleItems() {
    return ITEMS.filter((it) => {
      if (filters.status !== "all" && it.status !== filters.status) return false;
      if (filters.color  !== "all" && it.color  !== filters.color)  return false;
      if (filters.category !== "all") {
        if (filters.category === "tops"        && !["top","outer"].includes(it.category)) return false;
        if (filters.category === "bottoms"     && !["bottom","skirt"].includes(it.category)) return false;
        if (filters.category === "shoes"       && it.category !== "shoes") return false;
        if (filters.category === "accessories" && !["accessory","hat"].includes(it.category)) return false;
      }
      return true;
    });
  }

  function render() {
    const items = visibleItems();
    const grid = document.getElementById("closet-grid");
    if (items.length === 0) {
      grid.innerHTML = `<div class="closet-empty">nothing matches — loosen a filter.</div>`;
    } else {
      grid.innerHTML = items.map((it) => itemCardHTML(it, { size: 180 })).join("");
    }

    // Summary line at the top.
    const owned = ITEMS.filter((i) => i.status === "owned").length;
    const wished = ITEMS.filter((i) => i.status === "wishlist").length;
    document.getElementById("closet-summary").innerHTML =
      `${owned} owned · <em>${wished} on the wish list</em>`;
  }

  document.getElementById("add-item-btn").addEventListener("click", () => {
    // simple mock: show a small confirmation
    const toast = document.createElement("div");
    toast.textContent = "Upload modal would open here — backend will run rembg to cut the background.";
    toast.style.cssText = `
      position: fixed; bottom: 28px; left: 50%;
      transform: translateX(-50%);
      background: var(--text); color: var(--bg);
      padding: 12px 22px; border-radius: 999px;
      font-family: var(--font-body); font-size: 0.85rem;
      z-index: 9999; box-shadow: 0 14px 28px -14px rgba(0,0,0,0.4);
      max-width: 80%;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  });

  render();
})();
