// ── TAB NAVIGATION ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");

      // remove active states
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      // activate selected
      tab.classList.add("active");
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");

      // smooth scroll to content
      const page = document.querySelector(".page");
      if (page) {
        page.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});


// ── HERO PARALLAX (LIGHTWEIGHT) ──────────────────────────
window.addEventListener("scroll", () => {
  const bg = document.querySelector(".hero-bg");
  if (!bg) return;

  const scrollY = window.scrollY;
  bg.style.transform = `translateY(${scrollY * 0.2}px)`;
});


// ── WOW SECTION ANIMATION (BARS FILL) ────────────────────
function animateWowBars() {
  const bars = document.querySelectorAll(".wow-bar-fill");

  bars.forEach(bar => {
    bar.style.width = bar.classList.contains("low") ? "64%" : "100%";
  });
}

// trigger when visible
const wowSection = document.querySelector(".wow-section");

if (wowSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateWowBars();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(wowSection);
}


// ── SIMPLE FORM HANDLER (SAFE PLACEHOLDER) ───────────────
const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // TEMP: fake result so nothing breaks
    const resultBox = document.querySelector(".result-box");
    if (resultBox) {
      resultBox.style.display = "block";
    }
  });
}


// ── RETRY BUTTON (OPTIONAL) ──────────────────────────────
const retryBtn = document.querySelector(".retry-btn");

if (retryBtn) {
  retryBtn.addEventListener("click", () => {
    location.reload();
  });
}
