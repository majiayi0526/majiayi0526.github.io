// ============================================================
// Bilingual toggle — swaps .lang-en / .lang-cn, persists choice.
// ============================================================
(function () {
  "use strict";

  var KEY = "site-lang";
  var DEFAULT_LANG = "en";
  var VALID = { en: "en", cn: "zh-CN" };

  // ?lang=cn / ?lang=en wins over the stored choice, so a link can be
  // shared in a specific language (e.g. sending the Chinese page to a
  // Chinese-speaking reader) without them having to toggle.
  function readFromUrl() {
    var match = /[?&]lang=(en|cn)\b/.exec(window.location.search);
    return match ? match[1] : null;
  }

  function readStored() {
    try {
      var saved = window.localStorage.getItem(KEY);
      return VALID[saved] ? saved : null;
    } catch (err) {
      // Private mode or blocked storage — fall back, never throw.
      return null;
    }
  }

  function store(lang) {
    try {
      window.localStorage.setItem(KEY, lang);
    } catch (err) {
      /* non-fatal: the toggle still works for this page view */
    }
  }

  function apply(lang) {
    var root = document.documentElement;
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", VALID[lang]);
    var buttons = document.querySelectorAll(".lang-switch button");
    for (var i = 0; i < buttons.length; i++) {
      var isActive = buttons[i].getAttribute("data-lang") === lang;
      buttons[i].classList.toggle("active", isActive);
      buttons[i].setAttribute("aria-pressed", String(isActive));
    }
  }

  function init() {
    var fromUrl = readFromUrl();
    if (fromUrl) store(fromUrl);
    apply(fromUrl || readStored() || DEFAULT_LANG);

    document.addEventListener("click", function (event) {
      var button = event.target.closest(".lang-switch button");
      if (!button) return;
      var lang = button.getAttribute("data-lang");
      if (!VALID[lang]) return;
      store(lang);
      apply(lang);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
