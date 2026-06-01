/* navigation helper function: loads on the feed page (used in renderHeader) 
so menu items work as links without changing feed UI */
(function () {
  // navigate menu without modifying css styling
  function attach() {
    const map = { studio: "index.html", feed: "feed.html", closet: "closet.html" };
    document.querySelectorAll("menu .menu-item").forEach((el) => {
      // if already an anchor (other pages), skip
      if (el.tagName === "A") return;
      const key = el.textContent.trim().toLowerCase();
      const target = map[key];
      if (!target) return;
      el.style.cursor = "pointer";
      el.addEventListener("click", () => { window.location.href = target; });
    });
    // account icon and profile
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
