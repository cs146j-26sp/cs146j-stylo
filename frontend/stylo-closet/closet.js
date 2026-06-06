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

    // ── Add Item Modal ──────────────────────────────────────────────────

    function showToast(msg) {
      const toast = document.createElement("div");
      toast.textContent = msg;
      toast.style.cssText = `
        position: fixed; bottom: 28px; left: 50%;
        transform: translateX(-50%);
        background: var(--text); color: var(--bg);
        padding: 12px 22px; border-radius: 999px;
        font-family: var(--font-body); font-size: 0.85rem;
        z-index: 9999; box-shadow: 0 14px 28px -14px rgba(0,0,0,0.4);
        max-width: 80%; text-align: center;
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3200);
    }

    function openAddModal() {
      // prevent duplicate modals
      if (document.getElementById("add-item-modal")) return;

      const overlay = document.createElement("div");
      overlay.id = "add-item-modal";
      overlay.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.35);
        backdrop-filter: blur(4px);
        z-index: 1000;
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
      `;

      overlay.innerHTML = `
        <div class="add-modal-box">
          <button class="add-modal-close" aria-label="Close">✕</button>
          <h2 class="add-modal-title">add a piece ✦</h2>

          <div class="add-modal-field">
            <label class="add-modal-label">name</label>
            <input class="add-modal-input" id="modal-name" type="text" placeholder="e.g. linen midi skirt" />
          </div>

          <div class="add-modal-field">
            <label class="add-modal-label">photo</label>
            <div class="add-modal-file-area" id="modal-file-area">
              <input type="file" id="modal-file" accept="image/*" style="display:none" />
              <div class="add-modal-file-placeholder" id="modal-file-placeholder">
                <span style="font-size:1.4rem">📷</span>
                <span>click to choose a photo</span>
              </div>
              <img id="modal-preview" style="display:none; width:100%; height:100%; object-fit:contain; border-radius:10px;" />
            </div>
          </div>

          <div class="add-modal-field">
            <label class="add-modal-label">category</label>
            <div class="add-modal-chips" data-field="category">
              <button class="chip is-active" data-value="top">top</button>
              <button class="chip" data-value="bottom">bottom</button>
              <button class="chip" data-value="shoes">shoes</button>
              <button class="chip" data-value="accessory">accessory</button>
              <button class="chip" data-value="outer">outerwear</button>
            </div>
          </div>

          <div class="add-modal-field">
            <label class="add-modal-label">status</label>
            <div class="add-modal-chips" data-field="status">
              <button class="chip is-active" data-value="owned">owned</button>
              <button class="chip" data-value="wishlist">wishlist</button>
            </div>
          </div>

          <button class="add-modal-submit btn-filled" id="modal-submit">add to closet</button>
        </div>
      `;

      // inject modal styles if not already present
      if (!document.getElementById("add-modal-styles")) {
        const style = document.createElement("style");
        style.id = "add-modal-styles";
        style.textContent = `
          .add-modal-box {
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 36px 32px 28px;
            width: 100%;
            max-width: 420px;
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: 0 24px 60px -12px rgba(0,0,0,0.25);
          }
          .add-modal-close {
            position: absolute;
            top: 16px; right: 18px;
            background: none; border: none;
            font-size: 1rem; cursor: pointer;
            color: var(--text); opacity: 0.45;
            font-family: var(--font-body);
            line-height: 1;
            padding: 4px;
            transition: opacity 0.15s;
          }
          .add-modal-close:hover { opacity: 1; }
          .add-modal-title {
            font-family: var(--font-display);
            font-style: italic;
            font-size: 1.5rem;
            margin: 0;
            color: var(--text);
          }
          .add-modal-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .add-modal-label {
            font-family: var(--font-body);
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--text);
            opacity: 0.55;
          }
          .add-modal-input {
            font-family: var(--font-body);
            font-size: 0.9rem;
            color: var(--text);
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 10px 14px;
            outline: none;
            transition: border-color 0.15s;
            width: 100%;
            box-sizing: border-box;
          }
          .add-modal-input:focus { border-color: var(--text); }
          .add-modal-chips { display: flex; flex-wrap: wrap; gap: 6px; }
          .add-modal-file-area {
            border: 1.5px dashed var(--border);
            border-radius: 10px;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: border-color 0.15s, background 0.15s;
            overflow: hidden;
            position: relative;
          }
          .add-modal-file-area:hover { border-color: var(--text); background: var(--accent-soft); }
          .add-modal-file-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            font-family: var(--font-body);
            font-size: 0.82rem;
            color: var(--text);
            opacity: 0.5;
            pointer-events: none;
          }
          .add-modal-submit {
            margin-top: 4px;
            width: 100%;
            padding: 12px;
            font-size: 0.88rem;
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(overlay);

      // file picker — click area opens input
      const fileArea        = overlay.querySelector("#modal-file-area");
      const fileInput       = overlay.querySelector("#modal-file");
      const filePlaceholder = overlay.querySelector("#modal-file-placeholder");
      const filePreview     = overlay.querySelector("#modal-preview");

      fileArea.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        filePreview.src = url;
        filePreview.style.display = "block";
        filePlaceholder.style.display = "none";
      });

      // chip toggle inside modal
      overlay.querySelectorAll(".add-modal-chips").forEach((group) => {
        group.addEventListener("click", (e) => {
          const btn = e.target.closest(".chip");
          if (!btn) return;
          group.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
          btn.classList.add("is-active");
        });
      });

      // close on overlay click or ✕
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
      });
      overlay.querySelector(".add-modal-close").addEventListener("click", () => overlay.remove());

      // submit
      overlay.querySelector("#modal-submit").addEventListener("click", async () => {
        const name     = overlay.querySelector("#modal-name").value.trim();
        const file     = overlay.querySelector("#modal-file").files[0];
        const category = overlay.querySelector('[data-field="category"] .chip.is-active')?.dataset.value;
        const status   = overlay.querySelector('[data-field="status"] .chip.is-active')?.dataset.value;

        if (!name) {
          showToast("give your piece a name first ✦");
          return;
        }

        const submitBtn = overlay.querySelector("#modal-submit");
        submitBtn.textContent = "adding...";
        submitBtn.disabled = true;

        try {
          const res = await fetch(`/api/users/${window.STYLO.ME.id}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              category,
              status,
              image_url: file ? URL.createObjectURL(file) : null,
            }),
          });

          if (!res.ok) throw new Error("HTTP " + res.status);
          const newItem = await res.json();

          // add to local ITEMS array so the grid updates immediately
          ITEMS.push({
            id: String(newItem.id),
            name: newItem.name,
            category: newItem.category,
            status: newItem.status || "owned",
            image: newItem.image_url || (file ? URL.createObjectURL(file) : ""),
          });

          overlay.remove();
          render();
          showToast(`"${name}" added to your closet ✦`);
        } catch (err) {
          console.error("failed to add item:", err);
          showToast("couldn't save — is the server running?");
          submitBtn.textContent = "add to closet";
          submitBtn.disabled = false;
        }
      });
    }

    document.getElementById("add-item-btn").addEventListener("click", openAddModal);

    render();
  }

  if (window.STYLO?.ITEMS?.length) {
    initCloset();
  } else {
    window.addEventListener("stylo:ready", initCloset);
  }
});