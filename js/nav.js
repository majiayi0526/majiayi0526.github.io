// ============================================================
// Mobile navigation — disclosure button for the nav menu.
// ============================================================
(function () {
  "use strict";

  // Must match the nav breakpoint in styles/layout.css. If these two
  // drift apart the toggle and the menu disagree about which mode they
  // are in, and the menu becomes unopenable.
  var BREAKPOINT = "(max-width: 1023px)";

  function init() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    var query = window.matchMedia(BREAKPOINT);

    function setOpen(isOpen) {
      // One source of truth: the class drives display, aria mirrors it.
      // The menu starts closed in CSS, so nothing flashes open while this
      // script is still loading; visitors without JS get the no-js sheet.
      menu.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    }

    function isOpen() {
      return menu.classList.contains("is-open");
    }

    function syncToViewport() {
      // Above the breakpoint the menu is always laid out; below it,
      // it starts closed.
      setOpen(!query.matches);
    }

    syncToViewport();

    if (query.addEventListener) {
      query.addEventListener("change", syncToViewport);
    } else if (query.addListener) {
      query.addListener(syncToViewport); // Safari < 14
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    menu.addEventListener("click", function (event) {
      if (query.matches && event.target.closest(".nav__link")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && query.matches && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
