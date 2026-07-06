// ============================================================
// Bilingual toggle — switches between .lang-en and .lang-cn
// Persists choice in localStorage.
// ============================================================
(function () {
  const KEY = "site-lang";
  const DEFAULT = "en";

  function apply(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "cn" ? "zh-CN" : "en");
    document.querySelectorAll(".lang-switch button").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
  }

  function init() {
    const saved = localStorage.getItem(KEY) || DEFAULT;
    apply(saved);
    document.querySelectorAll(".lang-switch button").forEach((b) => {
      b.addEventListener("click", () => {
        const lang = b.dataset.lang;
        localStorage.setItem(KEY, lang);
        apply(lang);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
