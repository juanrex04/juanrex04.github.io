(function () {
  const STORAGE_KEY = "jmr-portfolio-lang";
  const toggle = document.querySelector(".nav__toggle");
  const navEnd = document.querySelector(".nav__end");
  const yearEl = document.getElementById("year");
  const langButtons = document.querySelectorAll(".lang-switch__btn");

  const CV_FILES = {
    es: {
      href: "assets/CV-Juan-Restrepo-ES.pdf",
      download: "CV-Juan-Manuel-Restrepo-ES.pdf",
    },
    en: {
      href: "assets/CV-Juan-Restrepo-EN.pdf",
      download: "CV-Juan-Manuel-Restrepo-EN.pdf",
    },
  };

  function updateCvDownloads(lang) {
    const safeLang = lang === "en" ? "en" : "es";
    const file = CV_FILES[safeLang];
    document.querySelectorAll("[data-cv-download]").forEach((el) => {
      el.setAttribute("href", file.href);
      el.setAttribute("download", file.download);
    });
  }

  function t(lang, key) {
    const bundle = window.I18N && window.I18N[lang];
    if (!bundle) return "";
    return bundle[key] ?? window.I18N.es[key] ?? "";
  }

  function applyLanguage(lang) {
    const safeLang = lang === "en" ? "en" : "es";
    document.documentElement.lang = safeLang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(safeLang, key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (key) el.innerHTML = t(safeLang, key);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      spec.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(safeLang, key));
      });
    });

    const title = t(safeLang, "meta.title");
    const description = t(safeLang, "meta.description");
    if (title) document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) metaDesc.setAttribute("content", description);

    langButtons.forEach((btn) => {
      const active = btn.getAttribute("data-lang") === safeLang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    updateCvDownloads(safeLang);

    try {
      localStorage.setItem(STORAGE_KEY, safeLang);
    } catch (_) {
      /* ignore */
    }
  }

  function initLanguage() {
    let initial = "es";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "es") initial = saved;
    } catch (_) {
      /* ignore */
    }
    applyLanguage(initial);

    langButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        applyLanguage(btn.getAttribute("data-lang"));
      });
    });
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  initLanguage();

  if (toggle && navEnd) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      navEnd.classList.toggle("is-open", !open);
    });

    navEnd.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        navEnd.classList.remove("is-open");
      });
    });
  }
})();
