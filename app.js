const body = document.body;
body.classList.add("js-enabled");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-main-nav]");
const navLinks = Array.from(document.querySelectorAll("[data-main-nav] a"));
const yearEl = document.querySelector("[data-year]");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (menuToggle && nav) {
  const setMenuOpen = (open) => {
    body.classList.toggle("nav-open", open);
    document.documentElement.classList.toggle("nav-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!body.classList.contains("nav-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) return;
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      setMenuOpen(false);
    }
  });
}

const setCurrentNavLink = (activeLink) => {
  navLinks.forEach((link) => {
    if (link === activeLink) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const hashNavLinks = navLinks.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
if (hashNavLinks.length) {
  const getHeaderOffset = () => {
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 88;
    return headerHeight + 14;
  };

  const scrollToHash = (hash, smooth = true) => {
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  const activateHash = (hash) => {
    const link = hashNavLinks.find((item) => item.getAttribute("href") === hash) || hashNavLinks[0];
    if (link) setCurrentNavLink(link);
  };

  hashNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || !document.querySelector(hash)) return;
      event.preventDefault();
      activateHash(hash);
      history.replaceState(null, "", hash);
      scrollToHash(hash, true);
    });
  });

  const initialHash =
    window.location.hash && document.querySelector(window.location.hash) ? window.location.hash : hashNavLinks[0].getAttribute("href");
  activateHash(initialHash);

  if ("IntersectionObserver" in window) {
    const hashMap = new Map();
    hashNavLinks.forEach((link) => {
      const hash = link.getAttribute("href");
      const section = hash ? document.querySelector(hash) : null;
      if (section) hashMap.set(section, hash);
    });

    const navObserver = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (!best) return;
        const hash = hashMap.get(best.target);
        if (!hash) return;
        activateHash(hash);
      },
      { threshold: [0.2, 0.35, 0.55], rootMargin: "-24% 0px -54% 0px" }
    );

    hashMap.forEach((_hash, section) => navObserver.observe(section));
  } else {
    window.addEventListener("hashchange", () => activateHash(window.location.hash));
  }
} else {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const exactMatch = navLinks.find((link) => link.getAttribute("href") === currentPath);
  if (exactMatch) setCurrentNavLink(exactMatch);
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => io.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const lazyVideos = document.querySelectorAll("video[data-lazy-video]");
const loadLazyVideo = (video) => {
  if (video.dataset.loaded === "true") return;
  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
  });
  video.dataset.loaded = "true";
  video.load();
  if (video.autoplay) {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }
};

if (lazyVideos.length) {
  if ("IntersectionObserver" in window) {
    const prefersReducedData = Boolean(navigator.connection && navigator.connection.saveData);
    const isMobileViewport = window.matchMedia("(max-width: 760px)").matches;
    const videoRootMargin = prefersReducedData ? "0px" : isMobileViewport ? "80px 0px" : "320px 0px";
    const videoObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          loadLazyVideo(entry.target);
          videoObserver.unobserve(entry.target);
        }
      },
      { rootMargin: videoRootMargin, threshold: 0.01 }
    );

    lazyVideos.forEach((video) => videoObserver.observe(video));
  } else {
    lazyVideos.forEach(loadLazyVideo);
  }
}

const inlineLogoWrap = document.querySelector("[data-inline-svg]");
if (inlineLogoWrap) {
  const triggerWrapGlitch = () => {
    inlineLogoWrap.classList.add("glitch-hit");
    window.setTimeout(() => inlineLogoWrap.classList.remove("glitch-hit"), 220);
  };

  const scheduleWrapGlitch = () => {
    const delay = 1800 + Math.random() * 3200;
    window.setTimeout(() => {
      triggerWrapGlitch();
      scheduleWrapGlitch();
    }, delay);
  };

  scheduleWrapGlitch();
}
