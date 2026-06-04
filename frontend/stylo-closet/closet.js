/******* stylo — Closet page helper funcs ******/
(function () {
  const { ITEMS } = window.STYLO;
  const { itemCardHTML } = window.STYLO_UI;

  const filters = { status: "all", category: "all", color: "all" };

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

  // ---- Add a piece modal ----

  let uploadedBlob = null;
  let uploadItemStatus = "owned";

  const uploadOverlay = document.getElementById("upload-overlay");

  function openUpload() { uploadOverlay.classList.add("is-open"); }
  function closeUpload() {
    uploadOverlay.classList.remove("is-open");
    uploadedBlob = null;
    uploadItemStatus = "owned";
    document.getElementById("upload-file").value = "";
    document.getElementById("upload-preview-img").src = "";
    document.getElementById("upload-preview-wrap").classList.remove("has-image");
    document.getElementById("upload-processing").classList.remove("visible");
    document.getElementById("upload-name").value = "";
    document.getElementById("upload-category").value = "top";
    document.querySelectorAll("#upload-status-tabs .upload-status-tab").forEach(b =>
      b.classList.toggle("is-active", b.dataset.status === "owned")
    );
  }

  document.getElementById("add-item-btn").addEventListener("click", openUpload);
  document.getElementById("upload-close-btn").addEventListener("click", closeUpload);
  document.getElementById("upload-cancel-btn").addEventListener("click", closeUpload);
  uploadOverlay.addEventListener("click", (e) => { if (e.target === uploadOverlay) closeUpload(); });

  document.getElementById("upload-status-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".upload-status-tab");
    if (!btn) return;
    uploadItemStatus = btn.dataset.status;
    document.querySelectorAll("#upload-status-tabs .upload-status-tab").forEach(b =>
      b.classList.toggle("is-active", b === btn)
    );
  });

  const dropzone  = document.getElementById("upload-dropzone");
  const fileInput = document.getElementById("upload-file");

  dropzone.addEventListener("click", (e) => { if (e.target !== fileInput) fileInput.click(); });
  dropzone.addEventListener("dragover",  (e) => { e.preventDefault(); dropzone.classList.add("drag-over"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag-over"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  });
  fileInput.addEventListener("change", () => { if (fileInput.files[0]) processFile(fileInput.files[0]); });

  async function processFile(file) {
    const wrap       = document.getElementById("upload-preview-wrap");
    const img        = document.getElementById("upload-preview-img");
    const processing = document.getElementById("upload-processing");

    img.src = URL.createObjectURL(file);
    wrap.classList.add("has-image");
    processing.classList.add("visible");

    const nameField = document.getElementById("upload-name");
    if (!nameField.value) {
      nameField.value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    }

    try {
      const { removeBackground } = await import(
        "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/background-removal.mjs"
      );
      const blob = await removeBackground(file, {
        publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/",
      });
      uploadedBlob = blob;
      img.src = URL.createObjectURL(blob);
    } catch (err) {
      console.warn("bg removal unavailable:", err);
      uploadedBlob = file;
    }

    processing.classList.remove("visible");
  }

  document.getElementById("upload-add-btn").addEventListener("click", () => {
    if (!uploadedBlob) {
      dropzone.classList.add("missing");
      setTimeout(() => dropzone.classList.remove("missing"), 900);
      return;
    }

    const newItem = {
      id: "custom-" + Date.now(),
      name:     document.getElementById("upload-name").value.trim() || "new piece",
      category: document.getElementById("upload-category").value,
      status:   uploadItemStatus,
      image:    URL.createObjectURL(uploadedBlob),
    };

    ITEMS.push(newItem);
    render();
    closeUpload();
  });

  render();
})();
