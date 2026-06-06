/******* stylo — Closet page helper funcs ******/

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("header-mount").innerHTML =
    window.STYLO_UI.renderHeader("closet");

  function initCloset() {
    const { ITEMS } = window.STYLO;
    const { itemCardHTML } = window.STYLO_UI;

    const filters = { status: "all", category: "all", color: "all" };

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
      grid.innerHTML = items.length
        ? items.map((it) => itemCardHTML(it, { size: 180 })).join("")
        : `<div class="closet-empty">nothing matches — loosen a filter.</div>`;

      const owned  = ITEMS.filter((i) => i.status === "owned").length;
      const wished = ITEMS.filter((i) => i.status === "wishlist").length;
      document.getElementById("closet-summary").innerHTML =
        `${owned} owned · <em>${wished} on the wish list</em>`;
    }

    document.getElementById("add-item-btn").addEventListener("click", () => {
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
  }

  if (window.STYLO?.ITEMS?.length) {
    initCloset();
  } else {
    window.addEventListener("stylo:ready", initCloset);
  }
});