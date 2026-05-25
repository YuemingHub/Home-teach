(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initLayerStack();
    initTimelineProgress();
    initValueRings();
  });

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initLayerStack() {
    var stacks = document.querySelectorAll("[data-layer-stack]");
    if (!stacks.length) return;

    if (reducedMotion() || !("IntersectionObserver" in window)) {
      stacks.forEach(function (stack) {
        stack.querySelectorAll(".layer-stack__row").forEach(function (row) {
          row.classList.add("is-lit");
        });
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var stack = entry.target;
        var rows = Array.prototype.slice.call(stack.querySelectorAll(".layer-stack__row"));
        rows.reverse().forEach(function (row, idx) {
          window.setTimeout(function () {
            row.classList.add("is-lit");
          }, idx * 280);
        });
        observer.unobserve(stack);
      });
    }, { threshold: 0.32 });

    stacks.forEach(function (stack) { observer.observe(stack); });
  }

  function initTimelineProgress() {
    var timelines = document.querySelectorAll(".timeline.is-progressive");
    if (!timelines.length) return;

    if (reducedMotion() || !("IntersectionObserver" in window)) {
      timelines.forEach(function (timeline) {
        timeline.querySelectorAll(".timeline-item").forEach(function (item) {
          item.classList.add("is-lit");
        });
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-lit");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4, rootMargin: "0px 0px -40px 0px" });

    timelines.forEach(function (timeline) {
      timeline.querySelectorAll(".timeline-item").forEach(function (item) {
        observer.observe(item);
      });
    });
  }

  function initValueRings() {
    var root = document.querySelector("[data-value-rings]");
    if (!root) return;

    var rings = Array.prototype.slice.call(root.querySelectorAll("[data-ring]"));
    var copies = Array.prototype.slice.call(document.querySelectorAll("[data-ring-copy]"));
    if (!rings.length) return;

    function applyRing(key) {
      rings.forEach(function (ring) {
        ring.classList.toggle("is-active", ring.getAttribute("data-ring") === key);
        ring.setAttribute("aria-pressed", ring.getAttribute("data-ring") === key ? "true" : "false");
      });
      copies.forEach(function (copy) {
        copy.classList.toggle("is-active", copy.getAttribute("data-ring-copy") === key);
      });
    }

    var defaultKey = rings[0].getAttribute("data-ring");
    applyRing(defaultKey);

    rings.forEach(function (ring) {
      var key = ring.getAttribute("data-ring");
      ring.addEventListener("mouseenter", function () { applyRing(key); });
      ring.addEventListener("focus", function () { applyRing(key); });
      ring.addEventListener("click", function () { applyRing(key); });
    });
  }
})();
