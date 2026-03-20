const API_URL =
  "https://script.google.com/macros/s/AKfycbwPcpIMkyZ7JSWIw32gXNUQ9yc5OWG91FyGBITsw0oiSqqrTwZe-3qaAGNz5W76TsgX/exec";

let DISTRICTS = [];

// ── HELPERS ───────────────────────────────────────────────
function money(value) {
  const num = Number(value || 0);
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
}

function byId(id) {
  return document.getElementById(id);
}

function show(el) {
  if (el) el.style.display = "";
}

function hide(el) {
  if (el) el.style.display = "none";
}

function normalizeDistrict(raw, index = 0) {
  const district =
    raw.district ||
    raw.name ||
    raw.District ||
    raw["District Name"] ||
    `District ${index + 1}`;

  const base =
    Number(raw.baseSalary ?? raw.base ?? raw.startingSalary ?? raw.salary ?? raw["Base Salary"] ?? 0);

  const masters =
    Number(raw.masters ?? raw.mastersSupplement ?? raw["Master's"] ?? raw["Masters Supplement"] ?? 0);

  const doctorate =
    Number(raw.doctorate ?? raw.doctorateSupplement ?? raw["Doctorate"] ?? 0);

  const asha =
    Number(raw.asha ?? raw.ccc ?? raw.ashaSupplement ?? raw["ASHA"] ?? raw["CCC"] ?? 0);

  const bonus =
    Number(raw.bonus ?? raw.otherBonuses ?? raw["Other Bonuses"] ?? 0);

  const confidence =
    String(raw.confidence ?? raw.status ?? "Estimated");

  const notes =
    raw.notes || raw.note || raw.comments || "";

  const total = base + masters + doctorate + asha + bonus;

  return {
    district,
    base,
    masters,
    doctorate,
    asha,
    bonus,
    total,
    confidence,
    notes,
    raw
  };
}

function extractRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.districts)) return payload.districts;
  if (Array.isArray(payload.rows)) return payload.rows;
  return [];
}

function getRankedDistricts() {
  return [...DISTRICTS].sort((a, b) => b.total - a.total);
}

function getDistrictByName(name) {
  return DISTRICTS.find(d => d.district === name);
}

// ── LOAD DATA ─────────────────────────────────────────────
async function loadDistricts() {
  const skeleton = byId("district-skeleton");
  const retryRow = byId("district-retry-row");
  const districtSelect = byId("district-select");
  const compareA = byId("compare-a");
  const compareB = byId("compare-b");

  show(skeleton);
  hide(retryRow);
  if (districtSelect) districtSelect.style.display = "none";

  try {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const payload = await res.json();
    const rows = extractRows(payload);

    if (!rows.length) {
      throw new Error("No district rows returned from API");
    }

    DISTRICTS = rows.map(normalizeDistrict);

    populateDistrictSelect(districtSelect, DISTRICTS);
    populateDistrictSelect(compareA, DISTRICTS);
    populateDistrictSelect(compareB, DISTRICTS);
    renderRankings(DISTRICTS);

    hide(skeleton);
    if (districtSelect) districtSelect.style.display = "block";
  } catch (err) {
    console.error("Failed to load districts:", err);
    hide(skeleton);
    show(retryRow);
  }
}

function populateDistrictSelect(select, districts) {
  if (!select) return;

  select.innerHTML = `<option value="">Choose a district</option>`;
  districts
    .slice()
    .sort((a, b) => a.district.localeCompare(b.district))
    .forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.district;
      opt.textContent = d.district;
      select.appendChild(opt);
    });
}

// ── TAB NAVIGATION ───────────────────────────────────────
function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");

      const page = document.querySelector(".page");
      if (page) page.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ── HERO PARALLAX ────────────────────────────────────────
function initParallax() {
  const bg = document.querySelector(".hero-bg");
  if (!bg) return;

  window.addEventListener("scroll", () => {
    bg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  });
}

// ── WOW SECTION BARS ─────────────────────────────────────
function initWowBars() {
  const wowSection = document.querySelector(".wow-section");
  if (!wowSection) return;

  const bars = document.querySelectorAll(".wow-bar-fill");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bars.forEach(bar => {
            bar.style.width = bar.classList.contains("low") ? "64%" : "100%";
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(wowSection);
}

// ── CALCULATOR ───────────────────────────────────────────
function initCalculator() {
  const btn = byId("calc-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const districtName = byId("district-select")?.value;
    const includeMasters = byId("masters-check")?.checked;
    const includeDoctorate = byId("doctorate-check")?.checked;
    const includeAsha = byId("asha-check")?.checked;

    if (!districtName) return;

    const district = getDistrictByName(districtName);
    if (!district) return;

    const masters = includeMasters ? district.masters : 0;
    const doctorate = includeDoctorate ? district.doctorate : 0;
    const asha = includeAsha ? district.asha : 0;
    const total = district.base + masters + doctorate + asha + district.bonus;

    const ranked = getRankedDistricts().map(d => ({
      ...d,
      adjustedTotal:
        d.base +
        (includeMasters ? d.masters : 0) +
        (includeDoctorate ? d.doctorate : 0) +
        (includeAsha ? d.asha : 0) +
        d.bonus
    })).sort((a, b) => b.adjustedTotal - a.adjustedTotal);

    const rank = ranked.findIndex(d => d.district === district.district) + 1;

    byId("r-district").textContent = district.district;
    byId("r-sub").textContent = "District-employed SLP";
    byId("r-total").textContent = money(total);
    byId("r-rank").textContent = rank ? `#${rank}` : "#—";
    byId("r-base").textContent = money(district.base);
    byId("r-masters").textContent = money(masters);
    byId("r-doctorate").textContent = money(doctorate);
    byId("r-asha").textContent = money(asha);
    byId("r-bonus").textContent = money(district.bonus);

    const confEl = byId("r-confidence");
    confEl.textContent = district.confidence;
    confEl.className = "conf-pill " + (/verif/i.test(district.confidence) ? "conf-v" : "conf-e");

    byId("r-notes").textContent =
      district.notes || "No additional district notes available.";

    byId("salary-result").style.display = "block";
  });
}

// ── COMPARE ──────────────────────────────────────────────
function initCompare() {
  const btn = byId("compare-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const a = getDistrictByName(byId("compare-a")?.value);
    const b = getDistrictByName(byId("compare-b")?.value);
    if (!a || !b) return;

    byId("compare-head-a").textContent = a.district;
    byId("compare-head-b").textContent = b.district;

    setCompareValue("cmp-base", a.base, b.base);
    setCompareValue("cmp-masters", a.masters, b.masters);
    setCompareValue("cmp-doctorate", a.doctorate, b.doctorate);
    setCompareValue("cmp-asha", a.asha, b.asha);
    setCompareValue("cmp-bonus", a.bonus, b.bonus);
    setCompareValue("cmp-total", a.total, b.total);

    byId("compare-table").style.display = "table";
  });
}

function setCompareValue(prefix, aVal, bVal) {
  const aCell = byId(`${prefix}-a`);
  const bCell = byId(`${prefix}-b`);
  if (!aCell || !bCell) return;

  aCell.textContent = money(aVal);
  bCell.textContent = money(bVal);

  aCell.classList.remove("winner");
  bCell.classList.remove("winner");

  if (aVal > bVal) aCell.classList.add("winner");
  if (bVal > aVal) bCell.classList.add("winner");
}

// ── RANKINGS ─────────────────────────────────────────────
function renderRankings(rows) {
  const body = byId("rank-table-body");
  if (!body) return;

  body.innerHTML = "";
  const ranked = [...rows].sort((a, b) => b.total - a.total);

  ranked.forEach((district, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="rank-num">${index + 1}</td>
      <td class="rank-district">${district.district}</td>
      <td class="rank-total">${money(district.total)}</td>
      <td class="rank-base">${money(district.base)}</td>
      <td class="rank-conf">
        <span class="${/verif/i.test(district.confidence) ? "badge-v" : "badge-e"}">
          ${/verif/i.test(district.confidence) ? "Verified" : "Est"}
        </span>
      </td>
    `;
    tr.addEventListener("click", () => showProfile(district));
    body.appendChild(tr);
  });
}

function initRankingFilters() {
  const search = byId("rank-search");
  const sort = byId("rank-sort");

  function applyFilters() {
    let rows = [...DISTRICTS];

    const q = (search?.value || "").trim().toLowerCase();
    if (q) {
      rows = rows.filter(d => d.district.toLowerCase().includes(q));
    }

    const sortVal = sort?.value || "rank";
    if (sortVal === "district") rows.sort((a, b) => a.district.localeCompare(b.district));
    if (sortVal === "total") rows.sort((a, b) => b.total - a.total);
    if (sortVal === "base") rows.sort((a, b) => b.base - a.base);
    if (sortVal === "rank") rows.sort((a, b) => b.total - a.total);

    renderRankings(rows);
  }

  search?.addEventListener("input", applyFilters);
  sort?.addEventListener("change", applyFilters);
}

// ── PROFILE ──────────────────────────────────────────────
function showProfile(district) {
  byId("profile-name").textContent = district.district;
  byId("profile-meta").textContent = "Florida school district";
  byId("profile-salary").textContent = money(district.total);
  byId("profile-base").textContent = money(district.base);
  byId("profile-masters").textContent = money(district.masters);
  byId("profile-doctorate").textContent = money(district.doctorate);
  byId("profile-asha").textContent = money(district.asha);
  byId("profile-bonus").textContent = money(district.bonus);
  byId("profile-notes").textContent =
    district.notes || "No additional district notes available.";

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));

  document.querySelector('.tab[data-tab="profile"]')?.classList.add("active");
  byId("profile")?.classList.add("active");

  document.querySelector(".page")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initProfileBack() {
  const btn = document.querySelector(".back-btn");
  btn?.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));

    document.querySelector('.tab[data-tab="rankings"]')?.classList.add("active");
    byId("rankings")?.classList.add("active");
  });
}

// ── CORRECTION FORM ──────────────────────────────────────
function initCorrectionForm() {
  const form = byId("correction-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hide(byId("r-error"));
    show(byId("r-success"));
    form.reset();
  });
}

// ── RETRY ────────────────────────────────────────────────
function initRetry() {
  const retryBtn = document.querySelector(".retry-btn");
  retryBtn?.addEventListener("click", loadDistricts);
}

// ── INIT ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async function () {
  initTabs();
  initParallax();
  initWowBars();
  initRetry();
  initCalculator();
  initCompare();
  initRankingFilters();
  initProfileBack();
  initCorrectionForm();
  await loadDistricts();
});
