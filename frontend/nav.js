/* ============================================
   stylo — navigation helper
   Loaded on the feed page (and used by other
   pages via renderHeader) so menu items work
   as links without changing the feed's look.
   ============================================ */
(function () {
  // On the feed page, the menu items are <h2> with no anchor.
  // Wire them to navigate without touching their visual styling.
  function attach() {
    const map = { studio: "index.html", feed: "feed.html", closet: "closet.html" };
    document.querySelectorAll("menu .menu-item").forEach((el) => {
      // If already an anchor (other pages), skip — links work natively.
      if (el.tagName === "A") return;
      const key = el.textContent.trim().toLowerCase();
      const target = map[key];
      if (!target) return;
      el.style.cursor = "pointer";
      el.addEventListener("click", () => { window.location.href = target; });
    });
    // Account icon → profile
    const account = document.querySelector(".account");
    if (account && account.tagName !== "A") {
      account.style.cursor = "pointer";
      account.addEventListener("click", () => { window.location.href = "profile.html"; });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attach);
  } else {
    attach();
  }
})();
