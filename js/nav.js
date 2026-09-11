// ============================================================
// Mobile navigation — disclosure button for the nav menu.
// ============================================================
(function () {
  "use strict";

  var BREAKPOINT = "(max-width: 860px)";

  function init() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    var query = window.matchMedia(BREAKPOINT);

    function setOpen(isOpen) {
      menu.hidden = !isOpen;
      toggle.setAttribute("aria-expanded", String(isOpen));
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
      setOpen(menu.hidden);
    });

    menu.addEventListener("click", function (event) {
      if (query.matches && event.target.closest(".nav__link")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && query.matches && !menu.hidden) {
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
