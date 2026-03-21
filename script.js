// ═══════════════════════════════════════════════════════════
// Florida SLP Salary Comparison Tool — script.js
// Pulls LIVE data from Google Sheet, falls back to cached data
// ═══════════════════════════════════════════════════════════

// ── CONFIG ────────────────────────────────────────────────
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPcpIMkyZ7JSWIw32gXNUQ9yc5OWG91FyGBITsw0oiSqqrTwZe-3qaAGNz5W76TsgX/exec";
const DATA_URL = APPS_SCRIPT_URL + "?action=getData";

// ── STATE ─────────────────────────────────────────────────
let DISTRICTS = [];
let rankedDistricts = [];
let contractDistricts = [];
let dataSource = "loading";

// ── FALLBACK DATA ─────────────────────────────────────────
const FALLBACK = [
{name:"Osceola",base:68250,masters:4394,doctorate:0,ccc:0,bonus:1500,total:74144,confidence:"verified",schedule:"Instructional",days:"10 months",ashaPaid:"Yes",notes:"Specialist supplement ($4,394) requires CCCs. $1,500 SLP Supplement. ASHA dues paid."},
{name:"Franklin",base:71003,masters:0,doctorate:0,ccc:0,bonus:0,total:71003,confidence:"estimated",schedule:"District",days:"212 days",ashaPaid:"No",notes:"Master's required — no separate supplement."},
{name:"Lee",base:57510,masters:2531,doctorate:0,ccc:8100,bonus:0,total:68141,confidence:"verified",schedule:"Special Instructional",days:"196 days",ashaPaid:"No",notes:"Updated 3/7/24."},
{name:"Walton",base:50000,masters:3000,doctorate:0,ccc:13265,bonus:100,total:66365,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$100 Critical Shortage. CCC $13,265."},
{name:"Collier",base:54000,masters:3500,doctorate:0,ccc:2500,bonus:3000,total:63000,confidence:"verified",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$3,000 SLP Supplement. Updated 2/24/24."},
{name:"Sarasota",base:55000,masters:5000,doctorate:0,ccc:5000,bonus:1500,total:62500,confidence:"verified",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$1,500 ESE Stipend. Updated 3/23/24."},
{name:"Calhoun",base:62392,masters:0,doctorate:0,ccc:0,bonus:0,total:62392,confidence:"estimated",schedule:"SLP",days:"180 days",ashaPaid:"No",notes:"Base reflects CCC."},
{name:"Liberty",base:62392,masters:0,doctorate:0,ccc:0,bonus:0,total:62392,confidence:"estimated",schedule:"Therapists",days:"180 days",ashaPaid:"No",notes:"Base reflects CCC."},
{name:"Manatee",base:49702,masters:2156,doctorate:6396,ccc:0,bonus:10537,total:62395,confidence:"verified",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"Referendum $9,537. SLP supplement $1,000. Updated 3/20/2026."},
{name:"Orange",base:49368,masters:3473,doctorate:0,ccc:8000,bonus:1500,total:62341,confidence:"verified",schedule:"Instructional",days:"197 days",ashaPaid:"No",notes:"$1,500 ESE Supplement. Updated 3/6/24."},
{name:"Bay",base:62228,masters:0,doctorate:0,ccc:0,bonus:0,total:62228,confidence:"estimated",schedule:"Licensed Personnel",days:"10 months",ashaPaid:"No",notes:""},
{name:"Dixie",base:44720,masters:2000,doctorate:0,ccc:0,bonus:15000,total:61720,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$15,000 Elem SLP Supplement — verify."},
{name:"Broward",base:48925,masters:3650,doctorate:0,ccc:5500,bonus:3000,total:61075,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$2,500 Critical Shortage + $500 New Hire."},
{name:"Miami-Dade",base:52470,masters:5665,doctorate:0,ccc:1030,bonus:1200,total:60365,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"Specialist: $5,665. $1,200 Critical Shortage."},
{name:"Brevard",base:48725,masters:2730,doctorate:0,ccc:6200,bonus:2565,total:60220,confidence:"verified",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$730 Millage, $835 ESE, $1,000 Critical Shortage. Updated 3/8/24."},
{name:"Escambia",base:57215,masters:2750,doctorate:0,ccc:0,bonus:0,total:59965,confidence:"estimated",schedule:"Professional",days:"10 months",ashaPaid:"No",notes:""},
{name:"Okaloosa",base:49017,masters:2382,doctorate:0,ccc:0,bonus:8161,total:59560,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:"$8,161 FLDOH Licensure."},
{name:"Pinellas",base:45672,masters:2251,doctorate:0,ccc:5280,bonus:11081,total:64284,confidence:"verified",schedule:"Instructional",days:"198 days",ashaPaid:"No",notes:"Referendum supplement increased to $11,081 for 2025-26 (was $6,328). Base $45,672 + referendum $11,081 + Master's $2,251 + CCC $5,280. Updated 3/20/2026."},
{name:"Hernando",base:47500,masters:2500,doctorate:0,ccc:0,bonus:9170,total:59170,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:"$9,170 Critical Shortage."},
{name:"Citrus",base:47500,masters:2000,doctorate:0,ccc:9400,bonus:0,total:58900,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"Yes",notes:"ASHA dues paid."},
{name:"Monroe",base:51800,masters:1800,doctorate:0,ccc:2300,bonus:3000,total:58900,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$3,000 SLP Supplement."},
{name:"Highlands",base:48280,masters:2500,doctorate:0,ccc:7242,bonus:600,total:58622,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"CCC 1.15x base. $600 Critical Shortage."},
{name:"Palm Beach",base:61680,masters:3000,doctorate:0,ccc:2000,bonus:1000,total:67680,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:"$1,000 ESE Supplement. Updated from 8/28/2025 source data."},
{name:"Gulf",base:57851,masters:0,doctorate:0,ccc:0,bonus:0,total:57851,confidence:"estimated",schedule:"Specialists",days:"189 days",ashaPaid:"No",notes:"Master's in base."},
{name:"St. Lucie",base:47500,masters:5020,doctorate:0,ccc:4000,bonus:1100,total:57620,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:"Master's+30: $5,020. $1,000 Referendum."},
{name:"Marion",base:55118,masters:2500,doctorate:0,ccc:0,bonus:0,total:57618,confidence:"estimated",schedule:"District Specialized",days:"196 days",ashaPaid:"No",notes:""},
{name:"Seminole",base:48500,masters:4125,doctorate:0,ccc:4800,bonus:0,total:57425,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Wakulla",base:55200,masters:2200,doctorate:0,ccc:0,bonus:0,total:57400,confidence:"estimated",schedule:"Instructional SLP/OT/PT",days:"196 days",ashaPaid:"No",notes:""},
{name:"Polk",base:52127,masters:5227,doctorate:0,ccc:0,bonus:0,total:57354,confidence:"estimated",schedule:"Student Services",days:"196 days",ashaPaid:"No",notes:"Master's requires CCCs. $1,200 Medicaid billing available."},
{name:"Hendry",base:47800,masters:2500,doctorate:0,ccc:4000,bonus:3000,total:57300,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:"$3,000 Critical Shortage."},
{name:"DeSoto",base:53000,masters:3200,doctorate:0,ccc:0,bonus:1000,total:57200,confidence:"estimated",schedule:"Speech/Language",days:"196 days",ashaPaid:"No",notes:"Base includes CCCs. $1,000 Critical Shortage."},
{name:"Sumter",base:51491,masters:2667,doctorate:0,ccc:0,bonus:3000,total:57158,confidence:"estimated",schedule:"Instructional",days:"198 days",ashaPaid:"No",notes:"$3,000 Critical Shortage."},
{name:"Santa Rosa",base:43196,masters:3456,doctorate:0,ccc:10000,bonus:0,total:56652,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"CCC: $10,000 + $1,000/yr up to 3 yrs."},
{name:"Charlotte",base:52058,masters:4077,doctorate:0,ccc:0,bonus:0,total:56135,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"St. Johns",base:47500,masters:2730,doctorate:0,ccc:0,bonus:5900,total:56130,confidence:"verified",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:"$1,400 Critical Shortage. $4,500 Millage. Updated 3/20/2026."},
{name:"Lafayette",base:53375,masters:2700,doctorate:0,ccc:0,bonus:0,total:56075,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Okeechobee",base:56127,masters:0,doctorate:0,ccc:0,bonus:0,total:56127,confidence:"estimated",schedule:"Administrative",days:"206 days",ashaPaid:"No",notes:"Master's required — no separate supplement."},
{name:"Clay",base:47500,masters:2000,doctorate:0,ccc:3800,bonus:1900,total:55200,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$1,900 FLDOH Licensure."},
{name:"Lake",base:48500,masters:2875,doctorate:0,ccc:3000,bonus:750,total:55125,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$750 Critical Shortage."},
{name:"Putnam",base:45743,masters:2146,doctorate:0,ccc:7000,bonus:0,total:54889,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Volusia",base:48103,masters:2991,doctorate:0,ccc:3183,bonus:0,total:54277,confidence:"estimated",schedule:"Teachers",days:"196 days",ashaPaid:"No",notes:"Supplements increase with experience."},
{name:"Pasco",base:46425,masters:3400,doctorate:0,ccc:3432,bonus:0,total:53257,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$2,352 for SLP Mentors available."},
{name:"Jackson",base:49707,masters:3100,doctorate:0,ccc:0,bonus:0,total:52807,confidence:"estimated",schedule:"Support Staff",days:"196 days",ashaPaid:"No",notes:""},
{name:"Duval",base:47500,masters:1000,doctorate:0,ccc:2625,bonus:1500,total:52625,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$1,500 ESE Supplement."},
{name:"Hardee",base:45000,masters:3362,doctorate:0,ccc:4190,bonus:0,total:52552,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$15 per IEP as Case Manager."},
{name:"Hillsborough",base:50451,masters:0,doctorate:0,ccc:500,bonus:1400,total:52351,confidence:"verified",schedule:"Student Services",days:"198 days",ashaPaid:"No",notes:"Master's in base. $1,400 ESE. Updated 3/8/24."},
{name:"Flagler",base:48363,masters:2750,doctorate:0,ccc:1000,bonus:0,total:52113,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Indian River",base:47500,masters:3909,doctorate:0,ccc:0,bonus:420,total:51829,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:"Specialist: $3,909. $420 Title I."},
{name:"Washington",base:42228,masters:3105,doctorate:0,ccc:6392,bonus:0,total:51725,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Nassau",base:46720,masters:3000,doctorate:0,ccc:1500,bonus:0,total:51220,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Gilchrist",base:46024,masters:2417,doctorate:0,ccc:0,bonus:2704,total:51145,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:"SLP Supplement $2,704."},
{name:"Levy",base:46000,masters:3094,doctorate:0,ccc:0,bonus:1000,total:50094,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$1,000 ESE for caseload >15."},
{name:"Holmes",base:41340,masters:2660,doctorate:0,ccc:6000,bonus:0,total:50000,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Martin",base:47500,masters:0,doctorate:0,ccc:1850,bonus:0,total:49350,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"Master's required. $1,800 Millage after 1 yr."},
{name:"Bradford",base:40461,masters:2500,doctorate:0,ccc:0,bonus:6100,total:49061,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$6,100 Critical Shortage."},
{name:"Leon",base:43678,masters:1800,doctorate:0,ccc:700,bonus:2745,total:48923,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:"$2,745 SLP Critical Shortage."},
{name:"Alachua",base:45500,masters:1921,doctorate:0,ccc:1500,bonus:0,total:48921,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Union",base:46000,masters:2500,doctorate:0,ccc:0,bonus:0,total:48500,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Baker",base:42428,masters:2800,doctorate:0,ccc:425,bonus:1200,total:46853,confidence:"estimated",schedule:"Instructional",days:"197 days",ashaPaid:"No",notes:"$1,200 IDEA Grant."},
{name:"Gadsden",base:45000,masters:1268,doctorate:0,ccc:0,bonus:0,total:46268,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:""},
{name:"Columbia",base:43275,masters:2800,doctorate:0,ccc:0,bonus:0,total:46075,confidence:"estimated",schedule:"Instructional",days:"196 days",ashaPaid:"No",notes:""},
{name:"Taylor",base:40500,masters:3650,doctorate:0,ccc:0,bonus:0,total:44150,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:""},
{name:"Madison",base:39767,masters:3000,doctorate:0,ccc:0,bonus:0,total:42767,confidence:"estimated",schedule:"Instructional",days:"10 months",ashaPaid:"No",notes:""},
{name:"Suwannee",base:0,masters:0,doctorate:0,ccc:0,bonus:0,total:0,confidence:"unknown",schedule:"Contract Only",days:"—",ashaPaid:"No",notes:"Contract agencies only."},
{name:"Glades",base:0,masters:0,doctorate:0,ccc:0,bonus:0,total:0,confidence:"unknown",schedule:"Contract Only",days:"—",ashaPaid:"No",notes:"Contract agencies only."},
{name:"Hamilton",base:0,masters:0,doctorate:0,ccc:0,bonus:0,total:0,confidence:"unknown",schedule:"Contract Only",days:"—",ashaPaid:"No",notes:"Contract agencies only."},
{name:"Jefferson",base:0,masters:0,doctorate:0,ccc:0,bonus:0,total:0,confidence:"unknown",schedule:"Contract Only",days:"—",ashaPaid:"No",notes:"Contract agencies only."}
];

// ── PROCESS DATA ──────────────────────────────────────────
function processDistricts(data) {
  DISTRICTS = data.map(function(d) {
    return {
      name: d.name || "",
      base: Number(d.base) || 0,
      masters: Number(d.masters) || 0,
      doctorate: Number(d.doctorate) || 0,
      ccc: Number(d.ccc) || 0,
      bonus: Number(d.bonus) || 0,
      total: Number(d.total) || 0,
      confidence: (d.confidence || "estimated").toLowerCase(),
      schedule: d.schedule || "",
      days: d.days || "",
      ashaPaid: String(d.ashaPaid).toLowerCase() === "yes" || String(d.ashaPaid).toLowerCase() === "true" || d.ashaPaid === true,
      notes: d.notes || ""
    };
  });
  rankedDistricts = DISTRICTS.filter(function(d){ return d.total > 0; })
    .sort(function(a,b){ return b.total - a.total; })
    .map(function(d,i){ return Object.assign({}, d, { rank: i + 1 }); });
  contractDistricts = DISTRICTS.filter(function(d){ return d.total === 0; });
}

// ── HELPERS ───────────────────────────────────────────────
function getRank(name) {
  var d = rankedDistricts.find(function(r){ return r.name === name; });
  return d ? d.rank : "—";
}
function fmt(n) {
  if (!n || n === 0) return "$0";
  return "$" + Number(n).toLocaleString("en-US");
}
function fmtShort(n) {
  if (!n || n === 0) return "$0";
  if (n >= 1000) return "$" + Math.round(n / 1000).toLocaleString() + "K";
  return "$" + n.toLocaleString("en-US");
}

// ── LOAD DATA + INIT UI ───────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  // Load immediately from fallback so dropdowns populate right away
  processDistricts(FALLBACK);
  dataSource = "cached";
  initUI();

  // Then try live data in the background — if it works, refresh the data
  try {
    fetch(DATA_URL)
      .then(function(res) {
        if (!res.ok) throw new Error("Bad response");
        return res.json();
      })
      .then(function(json) {
        if (json && json.districts && json.districts.length > 0) {
          processDistricts(json.districts);
          dataSource = "live";
        }
      })
      .catch(function() {
        // Live data not available — fallback already loaded, no problem
      });
  } catch(e) {
    // fetch not supported or other error — fallback already loaded
  }
});

// ═══════════════════════════════════════════════════════════
// INIT UI — runs after data loads
// ═══════════════════════════════════════════════════════════
function initUI() {
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".panel");

  function switchTab(target) {
    tabs.forEach(function(t){ t.classList.remove("active"); });
    panels.forEach(function(p){ p.classList.remove("active"); });
    var btn = document.querySelector('.tab[data-tab="' + target + '"]');
    var panel = document.getElementById(target);
    if (btn) btn.classList.add("active");
    if (panel) panel.classList.add("active");
    var page = document.querySelector(".page");
    if (page) page.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  tabs.forEach(function(tab) {
    tab.addEventListener("click", function() { switchTab(tab.getAttribute("data-tab")); });
  });

  // ── POPULATE DROPDOWNS ────────────────────────────────
  var districtSelect = document.getElementById("district-select");
  var compareA = document.getElementById("compare-a");
  var compareB = document.getElementById("compare-b");
  var skeleton = document.getElementById("district-skeleton");
  var profileSelect = document.getElementById("profile-select");
  var corrDistrictSelect = document.getElementById("c-district-select");

  var sortedNames = DISTRICTS.filter(function(d){ return d.total > 0; })
    .sort(function(a,b){ return a.name.localeCompare(b.name); });

  function populateDropdown(el) {
    if (!el) return;
    sortedNames.forEach(function(d) {
      var opt = document.createElement("option");
      opt.value = d.name;
      opt.textContent = d.name + " County";
      el.appendChild(opt);
    });
  }

  populateDropdown(districtSelect);
  populateDropdown(compareA);
  populateDropdown(compareB);
  populateDropdown(profileSelect);
  populateDropdown(corrDistrictSelect);

  if (skeleton) skeleton.style.display = "none";
  if (districtSelect) districtSelect.style.display = "";

  // ── SALARY CALCULATOR ─────────────────────────────────
  var calcBtn = document.getElementById("calc-btn");
  var resultBox = document.getElementById("salary-result");

  // Master's and Doctorate are mutually exclusive — you only get one
  var mastersCheck = document.getElementById("masters-check");
  var doctorateCheck = document.getElementById("doctorate-check");
  if (mastersCheck && doctorateCheck) {
    mastersCheck.addEventListener("change", function() {
      if (mastersCheck.checked) doctorateCheck.checked = false;
    });
    doctorateCheck.addEventListener("change", function() {
      if (doctorateCheck.checked) mastersCheck.checked = false;
    });
  }

  if (calcBtn) calcBtn.addEventListener("click", function () {
    var name = districtSelect ? districtSelect.value : "";
    if (!name) {
      if (districtSelect) { districtSelect.style.borderColor = "#e05555"; setTimeout(function(){ districtSelect.style.borderColor = ""; }, 2000); }
      return;
    }
    var d = DISTRICTS.find(function(x){ return x.name === name; });
    if (!d) return;

    var inclMasters = document.getElementById("masters-check") && document.getElementById("masters-check").checked;
    var inclDoctorate = document.getElementById("doctorate-check") && document.getElementById("doctorate-check").checked;
    var inclAsha = document.getElementById("asha-check") && document.getElementById("asha-check").checked;

    var base = d.base;
    var masters = inclMasters ? d.masters : 0;
    var doctorate = inclDoctorate ? d.doctorate : 0;
    var ccc = inclAsha ? d.ccc : 0;
    var bonus = d.bonus;
    var total = base + masters + doctorate + ccc + bonus;
    var rank = getRank(name);

    var el;
    el = document.getElementById("r-district"); if (el) el.textContent = name + " County";
    el = document.getElementById("r-sub"); if (el) el.textContent = d.schedule + " · " + d.days;
    el = document.getElementById("r-total"); if (el) el.textContent = fmt(total);
    el = document.getElementById("r-rank"); if (el) el.textContent = "#" + rank;
    el = document.getElementById("r-base"); if (el) el.textContent = fmt(base);
    el = document.getElementById("r-masters"); if (el) el.textContent = inclMasters ? "+" + fmt(masters) : "$0";
    el = document.getElementById("r-doctorate"); if (el) el.textContent = inclDoctorate ? "+" + fmt(doctorate) : "$0";
    el = document.getElementById("r-asha"); if (el) el.textContent = inclAsha ? "+" + fmt(ccc) : "$0";
    el = document.getElementById("r-bonus"); if (el) el.textContent = fmt(bonus);

    var confEl = document.getElementById("r-confidence");
    if (confEl) {
      if (d.confidence === "verified") { confEl.className = "conf-pill conf-v"; confEl.textContent = "✓ Verified from primary source"; }
      else if (d.confidence === "unknown") { confEl.className = "conf-pill conf-e"; confEl.textContent = "✗ Contract only — no direct-hire data"; }
      else { confEl.className = "conf-pill conf-e"; confEl.textContent = "Estimated — needs verification"; }
    }

    var notesText = d.notes || "No additional notes for this district.";
    if (d.ashaPaid) notesText += "\n\n✓ This district pays ASHA dues for SLPs.";
    if (dataSource === "live") notesText += "\n\n📡 Data loaded live from Google Sheet.";
    el = document.getElementById("r-notes"); if (el) el.textContent = notesText;

    if (resultBox) { resultBox.style.display = "block"; resultBox.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });

  // ── COMPARE DISTRICTS ─────────────────────────────────
  var compareBtn = document.getElementById("compare-btn");
  var compareTable = document.getElementById("compare-table");

  if (compareBtn) compareBtn.addEventListener("click", function () {
    var nameA = compareA ? compareA.value : "";
    var nameB = compareB ? compareB.value : "";
    if (!nameA || !nameB) return;

    var dA = DISTRICTS.find(function(x){ return x.name === nameA; });
    var dB = DISTRICTS.find(function(x){ return x.name === nameB; });
    if (!dA || !dB) return;

    var headA = document.getElementById("compare-head-a"); if (headA) headA.textContent = nameA;
    var headB = document.getElementById("compare-head-b"); if (headB) headB.textContent = nameB;

    function setCmp(id, valA, valB) {
      var elA = document.getElementById(id + "-a");
      var elB = document.getElementById(id + "-b");
      if (elA) { elA.textContent = fmt(valA); elA.classList.remove("winner"); if (valA > valB) elA.classList.add("winner"); }
      if (elB) { elB.textContent = fmt(valB); elB.classList.remove("winner"); if (valB > valA) elB.classList.add("winner"); }
    }

    setCmp("cmp-base", dA.base, dB.base);
    setCmp("cmp-masters", dA.masters, dB.masters);
    setCmp("cmp-doctorate", dA.doctorate, dB.doctorate);
    setCmp("cmp-asha", dA.ccc, dB.ccc);
    setCmp("cmp-bonus", dA.bonus, dB.bonus);
    setCmp("cmp-total", dA.total, dB.total);

    if (compareTable) { compareTable.style.display = ""; compareTable.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });

  // ── RANKINGS TABLE ────────────────────────────────────
  var rankBody = document.getElementById("rank-table-body");
  var rankSearch = document.getElementById("rank-search");
  var rankSort = document.getElementById("rank-sort");

  function renderRankings() {
    var query = rankSearch ? rankSearch.value.toLowerCase().trim() : "";
    var sortBy = rankSort ? rankSort.value : "rank";
    var data = rankedDistricts.slice();

    if (query) data = data.filter(function(d){ return d.name.toLowerCase().indexOf(query) >= 0; });
    if (sortBy === "district") data.sort(function(a,b){ return a.name.localeCompare(b.name); });
    else if (sortBy === "total") data.sort(function(a,b){ return b.total - a.total; });
    else if (sortBy === "base") data.sort(function(a,b){ return b.base - a.base; });

    if (!rankBody) return;
    rankBody.innerHTML = "";

    if (data.length === 0) {
      rankBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:#8fa8b8;">No districts match your search.</td></tr>';
      return;
    }

    data.forEach(function(d) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<td class="rank-num">' + d.rank + '</td>' +
        '<td class="rank-district">' + d.name + '</td>' +
        '<td class="rank-total">' + fmt(d.total) + '</td>' +
        '<td class="rank-base">' + fmt(d.base) + '</td>' +
        '<td class="rank-conf"><span class="badge-' + (d.confidence === "verified" ? "v" : "e") + '">' + (d.confidence === "verified" ? "Verified" : "Est") + '</span></td>';
      tr.addEventListener("click", function(){ openProfile(d.name); });
      rankBody.appendChild(tr);
    });

    if (!query) {
      contractDistricts.forEach(function(d) {
        var tr = document.createElement("tr");
        tr.innerHTML = '<td class="rank-num" style="color:#ccc;">—</td>' +
          '<td class="rank-district" style="color:#8fa8b8;">' + d.name + '</td>' +
          '<td class="rank-total" style="color:#ccc;">N/A</td>' +
          '<td class="rank-base" style="color:#ccc;">Contract</td>' +
          '<td class="rank-conf"><span class="badge-e" style="background:#fff0f0;color:#b83030;">N/A</span></td>';
        rankBody.appendChild(tr);
      });
    }
  }

  if (rankSearch) rankSearch.addEventListener("input", renderRankings);
  if (rankSort) rankSort.addEventListener("change", renderRankings);
  renderRankings();

  // ── DISTRICT PROFILE ──────────────────────────────────
  var profileCard = document.getElementById("profile-card");
  var profileDetails = document.getElementById("profile-details");

  function openProfile(name) {
    var d = rankedDistricts.find(function(x){ return x.name === name; }) || DISTRICTS.find(function(x){ return x.name === name; });
    if (!d) return;
    if (profileSelect) profileSelect.value = name;

    var el;
    el = document.getElementById("profile-name"); if (el) el.textContent = name + " County";
    el = document.getElementById("profile-meta"); if (el) el.textContent = d.schedule + " · " + d.days + (d.ashaPaid ? " · ASHA dues paid" : "");
    el = document.getElementById("profile-salary"); if (el) el.textContent = fmt(d.total);
    el = document.getElementById("profile-base"); if (el) el.textContent = fmt(d.base);
    el = document.getElementById("profile-masters"); if (el) el.textContent = fmt(d.masters);
    el = document.getElementById("profile-doctorate"); if (el) el.textContent = fmt(d.doctorate);
    el = document.getElementById("profile-asha"); if (el) el.textContent = fmt(d.ccc);
    el = document.getElementById("profile-bonus"); if (el) el.textContent = fmt(d.bonus);
    el = document.getElementById("profile-notes"); if (el) el.textContent = d.notes || "No additional notes.";

    if (profileCard) profileCard.style.display = "";
    if (profileDetails) profileDetails.style.display = "";
    switchTab("profile");
  }

  if (profileSelect) {
    profileSelect.addEventListener("change", function () {
      if (profileSelect.value) openProfile(profileSelect.value);
      else { if (profileCard) profileCard.style.display = "none"; if (profileDetails) profileDetails.style.display = "none"; }
    });
  }

  var backBtn = document.querySelector(".back-btn");
  if (backBtn) backBtn.addEventListener("click", function(){ switchTab("rankings"); });

  // ── CORRECTIONS FORM ──────────────────────────────────
  var correctionForm = document.getElementById("correction-form");
  var successBox = document.getElementById("r-success");
  var errorBox = document.getElementById("r-error");

  if (correctionForm) correctionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("c-name") ? document.getElementById("c-name").value.trim() : "";
    var email = document.getElementById("c-email") ? document.getElementById("c-email").value.trim() : "";
    var district = corrDistrictSelect ? corrDistrictSelect.value : "";
    var source = document.getElementById("c-source") ? document.getElementById("c-source").value.trim() : "";
    var notes = document.getElementById("c-notes") ? document.getElementById("c-notes").value.trim() : "";

    var corrections = [];
    for (var i = 1; i <= 3; i++) {
      var catEl = document.getElementById("c" + i + "-category");
      var valEl = document.getElementById("c" + i + "-value");
      var cat = catEl ? catEl.value : "";
      var val = valEl ? valEl.value.trim() : "";
      if (cat && val) corrections.push({ category: cat, value: val });
    }

    if (!district) { if (errorBox) { errorBox.textContent = "Please select a district."; errorBox.style.display = "block"; } return; }
    if (corrections.length === 0) { if (errorBox) { errorBox.textContent = "Please fill in at least one correction."; errorBox.style.display = "block"; } return; }

    if (successBox) successBox.style.display = "none";
    if (errorBox) errorBox.style.display = "none";

    var submitBtn = correctionForm.querySelector(".btn-primary");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || "Anonymous",
        email: email || "Not provided",
        district: district,
        corrections: corrections,
        source: source || "Not provided",
        notes: notes || "",
        timestamp: new Date().toISOString()
      })
    })
    .then(function() {
      if (successBox) successBox.style.display = "block";
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Submit Correction"; }
      correctionForm.reset();
    })
    .catch(function() {
      if (errorBox) { errorBox.textContent = "Something went wrong. Please try again."; errorBox.style.display = "block"; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Submit Correction"; }
    });
  });

  // ── HERO STATS FROM LIVE DATA ─────────────────────────
  var topTotal = rankedDistricts[0] ? rankedDistricts[0].total : 0;
  var lowestStart = rankedDistricts[rankedDistricts.length - 1] ? rankedDistricts[rankedDistricts.length - 1].total : 0;
  var gap = topTotal - lowestStart;

  var statNums = document.querySelectorAll(".stat-num");
  if (statNums.length >= 3) { statNums[1].textContent = fmtShort(topTotal); statNums[2].textContent = fmtShort(lowestStart); }

  var wowGapNum = document.querySelector(".wow-gap-num");
  if (wowGapNum) wowGapNum.textContent = fmtShort(gap);

  var wowBarValues = document.querySelectorAll(".wow-bar-value");
  if (wowBarValues.length >= 2) { wowBarValues[0].textContent = fmtShort(topTotal); wowBarValues[1].textContent = fmtShort(lowestStart); }

  var lowFill = document.querySelector(".wow-bar-fill.low");
  if (lowFill && topTotal > 0) lowFill.style.width = Math.round((lowestStart / topTotal) * 100) + "%";

} // end initUI

// ── FULL-PAGE PARALLAX ───────────────────────────────────
(function() {
  var bg = document.getElementById("page-bg");
  var overlay = document.getElementById("page-overlay");
  if (!bg || !overlay) return;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getOverlayColor(scrollY) {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? scrollY / docHeight : 0;
    if (pct < 0.15) { var t = pct / 0.15; return "rgba(11, 42, 60, " + (0.82 + t * 0.06) + ")"; }
    else if (pct < 0.35) { var t2 = (pct - 0.15) / 0.20; return "rgba(" + Math.round(11 + t2*8) + "," + Math.round(42 + t2*14) + "," + Math.round(60 + t2*12) + "," + (0.88 - t2*0.04) + ")"; }
    else if (pct < 0.7) { var t3 = (pct - 0.35) / 0.35; return "rgba(" + Math.round(19 + t3*20) + "," + Math.round(56 + t3*24) + "," + Math.round(72 + t3*20) + "," + (0.84 - t3*0.02) + ")"; }
    else { var t4 = (pct - 0.7) / 0.30; return "rgba(" + Math.round(39 - t4*22) + "," + Math.round(80 - t4*30) + "," + Math.round(92 - t4*22) + "," + (0.82 + t4*0.10) + ")"; }
  }

  var ticking = false;
  window.addEventListener("scroll", function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var scrollY = window.scrollY;
      if (!prefersReduced) bg.style.transform = "translateY(" + (scrollY * 0.15) + "px) scale(1.1)";
      overlay.style.background = getOverlayColor(scrollY);
      ticking = false;
    });
  });
})();

// ── WOW SECTION ANIMATION ────────────────────────────────
var wowSection = document.querySelector(".wow-section");
if (wowSection) {
  new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) { if (entry.isIntersecting) { /* bars animate via CSS */ } });
  }, { threshold: 0.4 }).observe(wowSection);
}
