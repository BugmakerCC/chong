/* Chong Chen - personal site interactions
   Progressive enhancement: page is fully usable without this file.
   No scroll listeners; uses IntersectionObserver throughout. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme toggle ---------------------------------------------------- */
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      // brief color transition without animating the whole load
      root.classList.add("theming");
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      window.setTimeout(function () {
        root.classList.remove("theming");
      }, 500);
    });
  }

  /* ---- Mobile menu ----------------------------------------------------- */
  var burger = document.getElementById("nav-burger");
  var menu = document.getElementById("mobile-menu");
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    window.setTimeout(function () {
      menu.hidden = true;
    }, 300);
  }
  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    // next frame so the transition runs
    requestAnimationFrame(function () {
      menu.classList.add("open");
    });
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
  }
  if (burger && menu) {
    burger.addEventListener("click", function () {
      if (menu.hidden) openMenu();
      else closeMenu();
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---- Nav scrolled state (sentinel, no scroll listener) --------------- */
  var nav = document.getElementById("nav");
  var sentinel = document.getElementById("top-sentinel");
  if (nav && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        nav.classList.toggle("scrolled", !entries[0].isIntersecting);
      },
      { threshold: 0 }
    ).observe(sentinel);
  } else if (nav) {
    nav.classList.add("scrolled");
  }

  /* ---- Scroll reveal --------------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var observerFired = false;
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        observerFired = true;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          // stagger siblings within the same container
          var siblings = Array.prototype.slice.call(
            el.parentElement.querySelectorAll(":scope > .reveal")
          );
          var idx = siblings.indexOf(el);
          el.style.setProperty(
            "--reveal-delay",
            (idx > 0 ? Math.min(idx, 6) * 0.06 : 0) + "s"
          );
          el.classList.add("in");
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
    // failsafe: if the observer never delivers a callback (e.g. a headless
    // or unusual environment), reveal everything so content is never hidden.
    window.setTimeout(function () {
      if (!observerFired) {
        reveals.forEach(function (el) {
          el.classList.add("in");
        });
      }
    }, 1800);
  }

  /* ---- Active section in nav ------------------------------------------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a")
  );
  var byId = {};
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    byId[id] = a;
  });
  var sections = navLinks
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var visible = {};
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });
        // pick the most-visible tracked section
        var best = null;
        var bestRatio = 0;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > bestRatio) {
            bestRatio = visible[id];
            best = id;
          }
        });
        navLinks.forEach(function (a) {
          a.classList.remove("active");
        });
        if (best && byId[best]) byId[best].classList.add("active");
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---- WeChat QR dialog ------------------------------------------------ */
  var dialog = document.getElementById("qr-dialog");
  var qrClose = document.getElementById("qr-close");
  var qrTriggers = document.querySelectorAll("[data-wechat]");
  if (dialog && dialog.showModal) {
    qrTriggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeMenu();
        dialog.showModal();
      });
    });
    if (qrClose)
      qrClose.addEventListener("click", function () {
        dialog.close();
      });
    // click on backdrop closes
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
  } else {
    // fallback: open the QR image directly
    qrTriggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.open("assets/img/wechat-qr.jpg", "_blank", "noopener");
      });
    });
  }
})();
