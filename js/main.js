(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealElement(element) {
    element.classList.add("is-visible");
  }

  function initRevealItems() {
    const revealTargets = [
      ".night-state .section-shell",
      ".night-routes .section-shell",
      ".night-route-card",
      ".night-work .section-shell",
      ".work-card",
      ".path-section",
      ".closing-breath",
      ".path-card",
      ".layer-card",
      ".case-card",
      ".soft-note",
      ".contact-form",
      ".contact-aside",
      ".page-hero .section-shell.narrow",
      ".quiet-content .section-shell.text-flow",
      ".quiet-content > .section-shell:not(.contact-shell)"
    ];

    const items = [...document.querySelectorAll(revealTargets.join(","))];
    items.forEach((item, index) => {
      item.classList.add("reveal-item");
      if (!item.style.getPropertyValue("--reveal-delay")) {
        item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
      }
    });

    if (prefersReducedMotion) {
      items.forEach(revealElement);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    items.forEach((item) => observer.observe(item));
  }

  function initNightHome() {
    const body = document.body;
    if (body.dataset.page !== "home") return;

    const awakeButton = document.querySelector(".js-home-awake");
    const stateSection = document.querySelector("#home-state");
    if (!awakeButton || !stateSection) return;

    awakeButton.addEventListener("click", () => {
      body.classList.add("is-awake");
      const behavior = prefersReducedMotion ? "auto" : "smooth";
      window.setTimeout(() => {
        stateSection.scrollIntoView({ behavior, block: "start" });
      }, prefersReducedMotion ? 0 : 180);
    });
  }

  function initHomeStateChoice() {
    if (document.body.dataset.page !== "home") return;

    const choices = [...document.querySelectorAll(".night-state__choice")];
    const response = document.querySelector("[data-state-response]");
    const title = document.querySelector("[data-state-response-title]");
    const text = document.querySelector("[data-state-response-text]");
    if (!choices.length || !response || !title || !text) return;

    const copyMap = {
      explosive: {
        title: "先别急着把话说完。",
        text: "也许这个家现在最需要的，是先让每一次开口不再像点火。我们先不急着解决全部，只先看清第一步。"
      },
      silent: {
        title: "沉默有时候不是不在乎。",
        text: "是大家都太累了。先不用逼自己立刻修好关系。我们先不急着解决全部，只先看清第一步。"
      },
      withdrawn: {
        title: "退回去的孩子，不一定是不想好。",
        text: "也许他只是暂时没有力气再面对现实。我们先不急着解决全部，只先看清第一步。"
      },
      chaos: {
        title: "也许不是你不够努力。",
        text: "而是这个家的顺序已经乱了。先别加方法，先看卡点。我们先不急着解决全部，只先看清第一步。"
      },
      tired: {
        title: "你也需要被放下来一点。",
        text: "父母不是永远不能累的人。我们先不急着解决全部，只先看清第一步。"
      }
    };

    choices.forEach((button) => {
      button.addEventListener("click", () => {
        choices.forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");

        const state = button.dataset.state;
        const current = copyMap[state] || copyMap.explosive;
        title.textContent = current.title;
        text.textContent = current.text;
        response.hidden = false;

        if (!prefersReducedMotion && typeof response.animate === "function") {
          response.animate(
            [
              { opacity: 0, transform: "translateY(12px)" },
              { opacity: 1, transform: "translateY(0)" }
            ],
            { duration: 380, easing: "ease", fill: "both" }
          );
        }
      });
    });
  }

  function initWorkCarousel() {
    if (document.body.dataset.page !== "home") return;

    const carousel = document.querySelector(".work-carousel");
    const viewport = document.querySelector("[data-carousel-viewport]");
    const dotsWrap = document.querySelector("[data-carousel-dots]");
    const prevButton = document.querySelector("[data-carousel-prev]");
    const nextButton = document.querySelector("[data-carousel-next]");
    const slides = viewport ? [...viewport.querySelectorAll("[data-slide]")] : [];
    if (!carousel || !viewport || !dotsWrap || !slides.length) return;

    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "work-carousel__dot";
      dot.setAttribute("aria-label", `跳到第 ${index + 1} 张作品`);
      dot.dataset.index = String(index);
      dotsWrap.appendChild(dot);
      return dot;
    });

    function getSlideOffset(index) {
      const slide = slides[index];
      return slide ? slide.offsetLeft : 0;
    }

    function getNearestIndex() {
      const scrollLeft = viewport.scrollLeft;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft - scrollLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    }

    function updateDots(index = getNearestIndex()) {
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    function goTo(index) {
      const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
      viewport.scrollTo({
        left: getSlideOffset(safeIndex),
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
      updateDots(safeIndex);
    }

    function step(direction) {
      const current = getNearestIndex();
      goTo(current + direction);
    }

    prevButton?.addEventListener("click", () => step(-1));
    nextButton?.addEventListener("click", () => step(1));

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goTo(index));
    });

    let ticking = false;
    viewport.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateDots();
        ticking = false;
      });
    }, { passive: true });

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    });

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;
      isDragging = true;
      startX = event.clientX;
      startScrollLeft = viewport.scrollLeft;
      viewport.setPointerCapture?.(event.pointerId);
      viewport.classList.add("is-dragging");
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - startX;
      viewport.scrollLeft = startScrollLeft - deltaX;
    });

    function stopDragging(event) {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove("is-dragging");
      viewport.releasePointerCapture?.(event.pointerId);
      updateDots();
    }

    viewport.addEventListener("pointerup", stopDragging);
    viewport.addEventListener("pointercancel", stopDragging);
    viewport.addEventListener("pointerleave", (event) => {
      if (!isDragging) return;
      stopDragging(event);
    });

    updateDots(0);
  }

  initRevealItems();
  initNightHome();
  initHomeStateChoice();
  initWorkCarousel();
})();
