(function () {
  const doc = document.documentElement;

  function applyTheme(pref) {
    if (pref === "dark") doc.classList.add("dark");
    else doc.classList.remove("dark");
  }

  function detectInitialTheme() {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Theme
    applyTheme(detectInitialTheme());
    document.getElementById("themeToggle")?.addEventListener("click", () => {
      const next = doc.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });

    // Mobile menu
    const menuBtn = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    menuBtn?.addEventListener("click", () => {
      if (!mobileMenu) return;
      mobileMenu.classList.toggle("hidden");
    });

    // Copy buttons
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const pre = btn.closest("pre");
        const codeEl = pre?.querySelector("code");
        const text = codeEl?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(text);
          toast(btn, "Copied");
        } catch {
          toast(btn, "Failed");
        }
      });
    });

    // Run buttons
    document.querySelectorAll("[data-run]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pre = btn.closest("pre");
        const codeEl = pre?.querySelector("code");
        const target = pre?.nextElementSibling?.matches?.("[data-demo-target]")
          ? pre.nextElementSibling
          : null;

        if (!codeEl || !target) return;

        const iframe = target.querySelector("iframe") || createSandbox(target);
        const html = codeEl.textContent ?? "";
        // safer: sandbox, no top-level navigation
        iframe.setAttribute(
          "sandbox",
          "allow-forms allow-pointer-lock allow-popups allow-scripts allow-modals"
        );
        iframe.srcdoc = html;
        toast(btn, "Running…");
      });
    });

    // Current year for footer
    document
      .querySelectorAll("[data-year]")
      .forEach((el) => (el.textContent = new Date().getFullYear()));
  });

  function createSandbox(container) {
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "260px";
    iframe.style.border = "1px solid hsl(0 0% 90%)";
    iframe.style.borderRadius = "10px";
    iframe.style.background = "white";
    container.appendChild(iframe);
    return iframe;
  }

  function toast(anchorEl, text) {
    const tip = document.createElement("div");
    tip.textContent = text;
    tip.style.position = "absolute";
    tip.style.right = "8px";
    tip.style.top = "8px";
    tip.style.fontSize = "12px";
    tip.style.padding = "4px 8px";
    tip.style.borderRadius = "6px";
    tip.style.background = "hsl(210 20% 90% / 0.9)";
    tip.style.color = "#111";
    tip.style.pointerEvents = "none";
    tip.style.transition = "opacity .2s ease";
    const pre = anchorEl.closest("pre") || document.body;
    pre.style.position = pre.style.position || "relative";
    pre.appendChild(tip);
    setTimeout(() => (tip.style.opacity = "0"), 600);
    setTimeout(() => tip.remove(), 900);
  }
})();
