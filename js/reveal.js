// ============================================================
// Scroll reveal — one staged entrance per section.
//
// Content is visible by default; CSS only hides .reveal once
// this script sets data-reveal="on". Three guards make sure a
// visitor can never be left staring at a blank page:
//   1. anything already on screen is revealed synchronously,
//      before any observer is involved;
//   2. if IntersectionObserver is missing or motion is
//      unwelcome, the gate is never armed at all;
//   3. a failsafe reveals everything if the observer turns out
//      to be dead.
// ============================================================
(function () {
  "use strict";

  var MAX_STAGGER_STEPS = 6;   // matches .reveal--1 … .reveal--5 in base.css
  var VIEWPORT_SLACK = 0.92;   // treat the bottom 8% as "below the fold"
  var FAILSAFE_MS = 3000;

  function revealAll(items) {
    for (var i = 0; i < items.length; i++) items[i].classList.add("is-in");
  }

  function isOnScreen(el) {
    var rect = el.getBoundingClientRect();
    var limit = (window.innerHeight || document.documentElement.clientHeight);
    return rect.top < limit * VIEWPORT_SLACK && rect.bottom > 0;
  }

  function init() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Guard 2: never arm the gate we cannot open.
    if (!("IntersectionObserver" in window) || prefersReduced) {
      revealAll(items);
      return;
    }

    document.documentElement.setAttribute("data-reveal", "on");

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].isIntersecting) continue;
          entries[i].target.classList.add("is-in");
          observer.unobserve(entries[i].target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var step = j % MAX_STAGGER_STEPS;
      if (step > 0) item.classList.add("reveal--" + step);

      // Guard 1: the first screen animates in on its own timeline
      // and never waits on the observer.
      if (isOnScreen(item)) {
        item.classList.add("is-in");
      } else {
        observer.observe(item);
      }
    }

    // Guard 3: if nothing ever came in, the observer is not working.
    window.setTimeout(function () {
      if (!document.querySelector(".reveal.is-in")) revealAll(items);
    }, FAILSAFE_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
