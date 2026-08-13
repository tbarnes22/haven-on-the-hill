(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const year = document.querySelector("#year");
  const form = document.querySelector("#free-class-form");
  const success = document.querySelector("#form-success");
  const referred = document.querySelector("#referred");
  const referrerField = document.querySelector("#referrer-field");
  const referrerInput = document.querySelector("#referrer");
  const dropdownItems = document.querySelectorAll(".has-dropdown");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Desktop dropdowns — hover CSS + click/keyboard support */
  const closeAllDropdowns = (except) => {
    dropdownItems.forEach((item) => {
      if (item === except) return;
      item.classList.remove("is-open");
      const trigger = item.querySelector(".nav-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  };

  dropdownItems.forEach((item) => {
    const trigger = item.querySelector(".nav-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const open = !item.classList.contains("is-open");
      closeAllDropdowns(item);
      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".has-dropdown")) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllDropdowns();
  });

  if (toggle && mobileNav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobileNav.hidden = !open;
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }

  /* FAQ accordion — keyboard accessible */
  document.querySelectorAll(".faq-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      document.querySelectorAll(".faq-trigger").forEach((other) => {
        if (other === button) return;
        other.setAttribute("aria-expanded", "false");
        const otherPanelId = other.getAttribute("aria-controls");
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
        if (otherPanel) otherPanel.hidden = true;
      });

      button.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) panel.hidden = expanded;
    });
  });

  /* Referral field toggle */
  const syncReferrer = () => {
    if (!referred || !referrerField || !referrerInput) return;
    const show = referred.value === "yes";
    referrerField.hidden = !show;
    referrerInput.required = show;
    if (!show) referrerInput.value = "";
  };

  if (referred) {
    referred.addEventListener("change", syncReferrer);
    syncReferrer();
  }

  /* Form submit → thank you (no backend) */
  if (form && success) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const empty = !String(field.value || "").trim();
        field.classList.toggle("is-invalid", empty);
        if (empty) valid = false;
      });

      const email = form.querySelector("#email");
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add("is-invalid");
        valid = false;
      }

      if (!valid) {
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
    });

    form.querySelectorAll("input, select").forEach((field) => {
      field.addEventListener("input", () => field.classList.remove("is-invalid"));
      field.addEventListener("change", () => field.classList.remove("is-invalid"));
    });
  }

  /* Scroll reveal */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
