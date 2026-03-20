// ═══════════════════════════════════════════════════════════
// Florida SLP Salary Comparison Tool — script.js
// All 67 districts · Calculator · Compare · Rankings · Profile · Corrections
// ═══════════════════════════════════════════════════════════

// ── DISTRICT DATA ─────────────────────────────────────────
// Source: "Salary Comparisons for SLPs in Florida Schools" Google Doc
// Last research session: 3/18/2026
// Manatee updated to 2025–26 verified data
const DISTRICTS = [
  { name:"Osceola", base:68250, masters:4394, doctorate:0, ccc:0, bonus:1500, total:74144, confidence:"verified", schedule:"Instructional", days:"10 months", ashaPaid:true, notes:"Specialist supplement ($4,394) requires CCCs. $1,500 SLP Supplement divided quarterly. ASHA dues paid by district." },
  { name:"Franklin", base:71003, masters:0, doctorate:0, ccc:0, bonus:0, total:71003, confidence:"estimated", schedule:"District", days:"212 days", ashaPaid:false, notes:"Master's degree is required for the position — no separate supplement. Therapist Stipend of $110/day available for extra duties." },
  { name:"Lee", base:57510, masters:2531, doctorate:0, ccc:8100, bonus:0, total:68141, confidence:"verified", schedule:"Special Instructional", days:"196 days", ashaPaid:false, notes:"Updated 3/7/24." },
  { name:"Walton", base:50000, masters:3000, doctorate:0, ccc:13265, bonus:100, total:66365, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$100 Critical Shortage Supplement included. CCC supplement is notably high at $13,265." },
  { name:"Collier", base:54000, masters:3500, doctorate:0, ccc:2500, bonus:3000, total:63000, confidence:"verified", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$3,000 Instructional Supplement for SLPs. Updated 2/24/24." },
  { name:"Sarasota", base:55000, masters:5000, doctorate:0, ccc:5000, bonus:1500, total:62500, confidence:"verified", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"Master's+30: $5,000; Master's+45: $7,500. $1,500 ESE Stipend. $2,500 additional for Case Managers. Updated 3/23/24." },
  { name:"Calhoun", base:62392, masters:0, doctorate:0, ccc:0, bonus:0, total:62392, confidence:"estimated", schedule:"Speech-Language Pathologists", days:"180 days", ashaPaid:false, notes:"Base salary already reflects CCC credential — no separate supplement." },
  { name:"Liberty", base:62392, masters:0, doctorate:0, ccc:0, bonus:0, total:62392, confidence:"estimated", schedule:"Therapists", days:"180 days", ashaPaid:false, notes:"Base salary already reflects CCC credential — no separate supplement." },
  { name:"Orange", base:49368, masters:3473, doctorate:0, ccc:8000, bonus:1500, total:62341, confidence:"verified", schedule:"Instructional", days:"197 days", ashaPaid:false, notes:"$1,500 ESE Supplement included. Updated 3/6/24." },
  { name:"Bay", base:62228, masters:0, doctorate:0, ccc:0, bonus:0, total:62228, confidence:"estimated", schedule:"Licensed Personnel", days:"10 months", ashaPaid:false, notes:"$80/day available for workshops and special curriculum development projects." },
  { name:"Dixie", base:44720, masters:2000, doctorate:0, ccc:0, bonus:15000, total:61720, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$15,000 Elementary SLP Supplement is unusually high — verify with district." },
  { name:"Broward", base:48925, masters:3650, doctorate:0, ccc:5500, bonus:3000, total:61075, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$2,500 Critical Shortage Supplement + $500 New Hire Referendum." },
  { name:"Miami-Dade", base:52470, masters:5665, doctorate:0, ccc:1030, bonus:1200, total:60365, confidence:"estimated", schedule:"Instructional", days:"196 work days (215 paid)", ashaPaid:false, notes:"Master's+36 (Specialist): $5,665. $1,200 Critical Shortage Supplement. $50/hr for work beyond regular workday." },
  { name:"Brevard", base:48725, masters:2730, doctorate:0, ccc:6200, bonus:2565, total:60220, confidence:"verified", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$730 Millage (increases with experience), $835 ESE Supplement, $1,000 Critical Shortage Supplement. Updated 3/8/24." },
  { name:"Escambia", base:57215, masters:2750, doctorate:0, ccc:0, bonus:0, total:59965, confidence:"estimated", schedule:"Professional", days:"10 months", ashaPaid:false, notes:"" },
  { name:"Manatee", base:49702, masters:2000, doctorate:0, ccc:0, bonus:10693, total:62395, confidence:"verified", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"Updated to 2025–26 verified data. $8,362 Special Referendum supplement + additional supplements. Manatee County." },
  { name:"Okaloosa", base:49017, masters:2382, doctorate:0, ccc:0, bonus:8161, total:59560, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"$8,161 FLDOH Licensure supplement." },
  { name:"Pinellas", base:52000, masters:2251, doctorate:0, ccc:5280, bonus:0, total:59531, confidence:"estimated", schedule:"Instructional", days:"198 days", ashaPaid:false, notes:"Base salary includes $6,328 in referendum supplement dollars." },
  { name:"Hernando", base:47500, masters:2500, doctorate:0, ccc:0, bonus:9170, total:59170, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"$9,170 Critical Shortage Supplement." },
  { name:"Citrus", base:47500, masters:2000, doctorate:0, ccc:9400, bonus:0, total:58900, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:true, notes:"ASHA dues paid by district." },
  { name:"Monroe", base:51800, masters:1800, doctorate:0, ccc:2300, bonus:3000, total:58900, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$3,000 SLP Supplement." },
  { name:"Highlands", base:48280, masters:2500, doctorate:0, ccc:7242, bonus:600, total:58622, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"CCC supplement is 1.15× base salary ($7,242). $600 Critical Shortage Supplement." },
  { name:"Palm Beach", base:53200, masters:3000, doctorate:0, ccc:2000, bonus:0, total:58200, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"" },
  { name:"Gulf", base:57851, masters:0, doctorate:0, ccc:0, bonus:0, total:57851, confidence:"estimated", schedule:"Specialists", days:"189 days", ashaPaid:false, notes:"Master's stipend included in base pay." },
  { name:"St. Lucie", base:47500, masters:5020, doctorate:0, ccc:4000, bonus:1100, total:57620, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"Master's+30: $5,020. $100 Critical Shortage Supplement. $1,000 Special Referendum." },
  { name:"Marion", base:55118, masters:2500, doctorate:0, ccc:0, bonus:0, total:57618, confidence:"estimated", schedule:"District Specialized Personnel", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Seminole", base:48500, masters:4125, doctorate:0, ccc:4800, bonus:0, total:57425, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Wakulla", base:55200, masters:2200, doctorate:0, ccc:0, bonus:0, total:57400, confidence:"estimated", schedule:"Instructional SLP/OT/PT", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Polk", base:52127, masters:5227, doctorate:0, ccc:0, bonus:0, total:57354, confidence:"estimated", schedule:"Student Services", days:"196 days", ashaPaid:false, notes:"Master's supplement ($5,227) requires CCCs. $1,200 Medicaid billing supplement available." },
  { name:"Hendry", base:47800, masters:2500, doctorate:0, ccc:4000, bonus:3000, total:57300, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"$3,000 Critical Shortage Supplement." },
  { name:"DeSoto", base:53000, masters:3200, doctorate:0, ccc:0, bonus:1000, total:57200, confidence:"estimated", schedule:"Speech/Language", days:"196 days", ashaPaid:false, notes:"Base salary is based on CCCs — no separate CCC supplement. $1,000 Critical Shortage Supplement." },
  { name:"Sumter", base:51491, masters:2667, doctorate:0, ccc:0, bonus:3000, total:57158, confidence:"estimated", schedule:"Instructional", days:"198 days", ashaPaid:false, notes:"$3,000 Critical Shortage Supplement." },
  { name:"Santa Rosa", base:43196, masters:3456, doctorate:0, ccc:10000, bonus:0, total:56652, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"CCC supplement: $10,000 + $1,000 each additional year up to 3 years." },
  { name:"Lafayette", base:53375, masters:2700, doctorate:0, ccc:0, bonus:0, total:56075, confidence:"estimated", schedule:"Instructional", days:"196 days, 8 hrs/day", ashaPaid:false, notes:"" },
  { name:"Charlotte", base:52058, masters:4077, doctorate:0, ccc:0, bonus:0, total:56135, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Okeechobee", base:56127, masters:0, doctorate:0, ccc:0, bonus:0, total:56127, confidence:"estimated", schedule:"Administrative", days:"206 days", ashaPaid:false, notes:"Master's degree required for position — no separate supplement." },
  { name:"Clay", base:47500, masters:2000, doctorate:0, ccc:3800, bonus:1900, total:55200, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$1,900 FLDOH Licensure (totaling $5,700 with CCCs)." },
  { name:"Lake", base:48500, masters:2875, doctorate:0, ccc:3000, bonus:750, total:55125, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$750 Critical Shortage Supplement." },
  { name:"Putnam", base:45743, masters:2146, doctorate:0, ccc:7000, bonus:0, total:54889, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Volusia", base:48103, masters:2991, doctorate:0, ccc:3183, bonus:0, total:54277, confidence:"estimated", schedule:"Teachers", days:"196 days", ashaPaid:false, notes:"Master's and CCC supplements increase with years of experience." },
  { name:"Pasco", base:46425, masters:3400, doctorate:0, ccc:3432, bonus:0, total:53257, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"Master's+18: $3,400. Additional $2,352 for SLP Mentors. Critical Shortage Supplement available." },
  { name:"Jackson", base:49707, masters:3100, doctorate:0, ccc:0, bonus:0, total:52807, confidence:"estimated", schedule:"Other District Support Staff", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Duval", base:47500, masters:1000, doctorate:0, ccc:2625, bonus:1500, total:52625, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$1,500 ESE Staff Supplement (must hold licensure)." },
  { name:"Hardee", base:45000, masters:3362, doctorate:0, ccc:4190, bonus:0, total:52552, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$15 per annual or initial IEP written as Case Manager." },
  { name:"Hillsborough", base:50451, masters:0, doctorate:0, ccc:500, bonus:1400, total:52351, confidence:"verified", schedule:"Student Services", days:"198 days", ashaPaid:false, notes:"Master's included in base salary. $1,400 one-time ESE Supplement (2023–2024). Updated 3/8/24." },
  { name:"Flagler", base:48363, masters:2750, doctorate:0, ccc:1000, bonus:0, total:52113, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Indian River", base:47500, masters:3909, doctorate:0, ccc:0, bonus:420, total:51829, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"Specialist: $3,909. $420 Title I Supplement." },
  { name:"Washington", base:42228, masters:3105, doctorate:0, ccc:6392, bonus:0, total:51725, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Nassau", base:46720, masters:3000, doctorate:0, ccc:1500, bonus:0, total:51220, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Gilchrist", base:46024, masters:2417, doctorate:0, ccc:0, bonus:2704, total:51145, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"Speech Therapist Supplement $2,704 (increases with years of experience)." },
  { name:"St. Johns", base:47500, masters:2730, doctorate:0, ccc:0, bonus:5900, total:56130, confidence:"verified", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"$1,400 Critical Shortage Supplement. $4,500 Millage Supplement. Updated 3/20/2026 via user correction." },
  { name:"Levy", base:46000, masters:3094, doctorate:0, ccc:0, bonus:1000, total:50094, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$1,000 ESE Supplement for caseloads larger than 15." },
  { name:"Holmes", base:41340, masters:2660, doctorate:0, ccc:6000, bonus:0, total:50000, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Martin", base:47500, masters:0, doctorate:0, ccc:1850, bonus:0, total:49350, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"Master's required for position — no separate supplement. $1,800 Millage stipend after 1 year." },
  { name:"Bradford", base:40461, masters:2500, doctorate:0, ccc:0, bonus:6100, total:49061, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$6,100 Critical Shortage Supplement." },
  { name:"Leon", base:43678, masters:1800, doctorate:0, ccc:700, bonus:2745, total:48923, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"$2,745 SLP Supplement (Critical Shortage)." },
  { name:"Alachua", base:45500, masters:1921, doctorate:0, ccc:1500, bonus:0, total:48921, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Union", base:46000, masters:2500, doctorate:0, ccc:0, bonus:0, total:48500, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Baker", base:42428, masters:2800, doctorate:0, ccc:425, bonus:1200, total:46853, confidence:"estimated", schedule:"Instructional", days:"197 days", ashaPaid:false, notes:"$1,200 IDEA Grant." },
  { name:"Gadsden", base:45000, masters:1268, doctorate:0, ccc:0, bonus:0, total:46268, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"" },
  { name:"Columbia", base:43275, masters:2800, doctorate:0, ccc:0, bonus:0, total:46075, confidence:"estimated", schedule:"Instructional", days:"196 days", ashaPaid:false, notes:"" },
  { name:"Taylor", base:40500, masters:3650, doctorate:0, ccc:0, bonus:0, total:44150, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"" },
  { name:"Madison", base:39767, masters:3000, doctorate:0, ccc:0, bonus:0, total:42767, confidence:"estimated", schedule:"Instructional", days:"10 months", ashaPaid:false, notes:"" },
  { name:"Suwannee", base:0, masters:0, doctorate:0, ccc:0, bonus:0, total:0, confidence:"unknown", schedule:"Contract Only", days:"—", ashaPaid:false, notes:"Employs SLPs via contract agencies — no direct-hire salary data available." },
  { name:"Glades", base:0, masters:0, doctorate:0, ccc:0, bonus:0, total:0, confidence:"unknown", schedule:"Contract Only", days:"—", ashaPaid:false, notes:"Employs SLPs via contract agencies — no direct-hire salary data available." },
  { name:"Hamilton", base:0, masters:0, doctorate:0, ccc:0, bonus:0, total:0, confidence:"unknown", schedule:"Contract Only", days:"—", ashaPaid:false, notes:"Employs SLPs via contract agencies — no direct-hire salary data available." },
  { name:"Jefferson", base:0, masters:0, doctorate:0, ccc:0, bonus:0, total:0, confidence:"unknown", schedule:"Contract Only", days:"—", ashaPaid:false, notes:"Employs SLPs via contract agencies — no direct-hire salary data available." }
];

// Pre-sort by total descending and assign ranks
const rankedDistricts = DISTRICTS
  .filter(d => d.total > 0)
  .sort((a, b) => b.total - a.total)
  .map((d, i) => ({ ...d, rank: i + 1 }));

const contractDistricts = DISTRICTS.filter(d => d.total === 0);

function getRank(name) {
  const d = rankedDistricts.find(r => r.name === name);
  return d ? d.rank : "—";
}

function fmt(n) {
  if (!n || n === 0) return "$0";
  return "$" + n.toLocaleString("en-US");
}

function fmtShort(n) {
  if (!n || n === 0) return "$0";
  if (n >= 1000) return "$" + Math.round(n / 1000).toLocaleString() + "K";
  return "$" + n.toLocaleString("en-US");
}

// ── TAB NAVIGATION ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  function switchTab(target) {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    const btn = document.querySelector(`.tab[data-tab="${target}"]`);
    const panel = document.getElementById(target);
    if (btn) btn.classList.add("active");
    if (panel) panel.classList.add("active");
    const page = document.querySelector(".page");
    if (page) page.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.getAttribute("data-tab")));
  });

  // ── POPULATE DROPDOWNS ────────────────────────────────
  const districtSelect = document.getElementById("district-select");
  const compareA = document.getElementById("compare-a");
  const compareB = document.getElementById("compare-b");
  const skeleton = document.getElementById("district-skeleton");

  const sortedNames = DISTRICTS
    .filter(d => d.total > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  sortedNames.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.name;
    opt.textContent = d.name + " County";
    districtSelect.appendChild(opt);

    const optA = opt.cloneNode(true);
    const optB = opt.cloneNode(true);
    compareA.appendChild(optA);
    compareB.appendChild(optB);
  });

  // Show dropdown, hide skeleton
  if (skeleton) skeleton.style.display = "none";
  districtSelect.style.display = "";

  // ── SALARY CALCULATOR ─────────────────────────────────
  const calcBtn = document.getElementById("calc-btn");
  const resultBox = document.getElementById("salary-result");

  calcBtn.addEventListener("click", function () {
    const name = districtSelect.value;
    if (!name) {
      districtSelect.focus();
      districtSelect.style.borderColor = "#e05555";
      setTimeout(() => districtSelect.style.borderColor = "", 2000);
      return;
    }

    const d = DISTRICTS.find(x => x.name === name);
    if (!d) return;

    const inclMasters = document.getElementById("masters-check").checked;
    const inclDoctorate = document.getElementById("doctorate-check").checked;
    const inclAsha = document.getElementById("asha-check").checked;

    // Calculate total based on selections
    let base = d.base;
    let masters = inclMasters ? d.masters : 0;
    let doctorate = inclDoctorate ? d.doctorate : 0;
    let ccc = inclAsha ? d.ccc : 0;
    let bonus = d.bonus;
    let total = base + masters + doctorate + ccc + bonus;

    const rank = getRank(name);

    // Populate result
    document.getElementById("r-district").textContent = name + " County";
    document.getElementById("r-sub").textContent = d.schedule + " · " + d.days;
    document.getElementById("r-total").textContent = fmt(total);
    document.getElementById("r-rank").textContent = "#" + rank;
    document.getElementById("r-base").textContent = fmt(base);
    document.getElementById("r-masters").textContent = inclMasters ? "+" + fmt(masters) : "$0";
    document.getElementById("r-doctorate").textContent = inclDoctorate ? "+" + fmt(doctorate) : "$0";
    document.getElementById("r-asha").textContent = inclAsha ? "+" + fmt(ccc) : "$0";
    document.getElementById("r-bonus").textContent = fmt(bonus);

    // Confidence badge
    const confEl = document.getElementById("r-confidence");
    if (d.confidence === "verified") {
      confEl.className = "conf-pill conf-v";
      confEl.textContent = "✓ Verified from primary source";
    } else if (d.confidence === "unknown") {
      confEl.className = "conf-pill conf-e";
      confEl.textContent = "✗ Contract only — no direct-hire data";
    } else {
      confEl.className = "conf-pill conf-e";
      confEl.textContent = "Estimated — needs verification";
    }

    // Notes
    let notesText = d.notes || "No additional notes for this district.";
    if (d.ashaPaid) {
      notesText += "\n\n✓ This district pays ASHA dues for SLPs.";
    }
    document.getElementById("r-notes").textContent = notesText;

    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ── COMPARE DISTRICTS ─────────────────────────────────
  const compareBtn = document.getElementById("compare-btn");
  const compareTable = document.getElementById("compare-table");

  compareBtn.addEventListener("click", function () {
    const nameA = compareA.value;
    const nameB = compareB.value;

    if (!nameA || !nameB) {
      if (!nameA) { compareA.style.borderColor = "#e05555"; setTimeout(() => compareA.style.borderColor = "", 2000); }
      if (!nameB) { compareB.style.borderColor = "#e05555"; setTimeout(() => compareB.style.borderColor = "", 2000); }
      return;
    }

    const dA = DISTRICTS.find(x => x.name === nameA);
    const dB = DISTRICTS.find(x => x.name === nameB);
    if (!dA || !dB) return;

    document.getElementById("compare-head-a").textContent = nameA;
    document.getElementById("compare-head-b").textContent = nameB;

    function setCmp(id, valA, valB) {
      const elA = document.getElementById(id + "-a");
      const elB = document.getElementById(id + "-b");
      elA.textContent = fmt(valA);
      elB.textContent = fmt(valB);
      // Highlight winner
      elA.classList.remove("winner");
      elB.classList.remove("winner");
      if (valA > valB) elA.classList.add("winner");
      else if (valB > valA) elB.classList.add("winner");
    }

    setCmp("cmp-base", dA.base, dB.base);
    setCmp("cmp-masters", dA.masters, dB.masters);
    setCmp("cmp-doctorate", dA.doctorate, dB.doctorate);
    setCmp("cmp-asha", dA.ccc, dB.ccc);
    setCmp("cmp-bonus", dA.bonus, dB.bonus);
    setCmp("cmp-total", dA.total, dB.total);

    compareTable.style.display = "";
    compareTable.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ── RANKINGS TABLE ────────────────────────────────────
  const rankBody = document.getElementById("rank-table-body");
  const rankSearch = document.getElementById("rank-search");
  const rankSort = document.getElementById("rank-sort");

  function renderRankings() {
    const query = rankSearch.value.toLowerCase().trim();
    const sortBy = rankSort.value;

    let data = [...rankedDistricts];

    // Filter
    if (query) {
      data = data.filter(d => d.name.toLowerCase().includes(query));
    }

    // Sort
    if (sortBy === "district") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "total") {
      data.sort((a, b) => b.total - a.total);
    } else if (sortBy === "base") {
      data.sort((a, b) => b.base - a.base);
    }
    // default is rank order (already sorted)

    rankBody.innerHTML = "";

    if (data.length === 0) {
      rankBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:#8fa8b8;">No districts match your search.</td></tr>';
      return;
    }

    data.forEach(d => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="rank-num">${d.rank}</td>
        <td class="rank-district">${d.name}</td>
        <td class="rank-total">${fmt(d.total)}</td>
        <td class="rank-base">${fmt(d.base)}</td>
        <td class="rank-conf"><span class="badge-${d.confidence === 'verified' ? 'v' : 'e'}">${d.confidence === 'verified' ? 'Verified' : 'Est'}</span></td>
      `;
      tr.addEventListener("click", () => openProfile(d.name));
      rankBody.appendChild(tr);
    });

    // Add contract-only districts at bottom
    if (!query) {
      contractDistricts.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="rank-num" style="color:#ccc;">—</td>
          <td class="rank-district" style="color:#8fa8b8;">${d.name}</td>
          <td class="rank-total" style="color:#ccc;">N/A</td>
          <td class="rank-base" style="color:#ccc;">Contract</td>
          <td class="rank-conf"><span class="badge-e" style="background:#fff0f0;color:#b83030;">N/A</span></td>
        `;
        rankBody.appendChild(tr);
      });
    }
  }

  rankSearch.addEventListener("input", renderRankings);
  rankSort.addEventListener("change", renderRankings);
  renderRankings();

  // ── DISTRICT PROFILE ──────────────────────────────────
  const profileSelect = document.getElementById("profile-select");
  const profileCard = document.getElementById("profile-card");
  const profileDetails = document.getElementById("profile-details");

  // Populate profile dropdown
  if (profileSelect) {
    sortedNames.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.name;
      opt.textContent = d.name + " County";
      profileSelect.appendChild(opt);
    });
  }

  function openProfile(name) {
    const d = rankedDistricts.find(x => x.name === name) ||
              DISTRICTS.find(x => x.name === name);
    if (!d) return;

    // Set dropdown to match
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
    el = document.getElementById("profile-notes"); if (el) el.textContent = d.notes || "No additional notes for this district.";

    // Show the profile content
    if (profileCard) profileCard.style.display = "";
    if (profileDetails) profileDetails.style.display = "";

    switchTab("profile");
  }

  // Profile dropdown change handler
  if (profileSelect) {
    profileSelect.addEventListener("change", function () {
      const name = profileSelect.value;
      if (name) {
        openProfile(name);
      } else {
        if (profileCard) profileCard.style.display = "none";
        if (profileDetails) profileDetails.style.display = "none";
      }
    });
  }

  // Back button
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => switchTab("rankings"));
  }

  // ── CORRECTIONS FORM ──────────────────────────────────
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPcpIMkyZ7JSWIw32gXNUQ9yc5OWG91FyGBITsw0oiSqqrTwZe-3qaAGNz5W76TsgX/exec";

  const correctionForm = document.getElementById("correction-form");
  const successBox = document.getElementById("r-success");
  const errorBox = document.getElementById("r-error");

  // Populate the corrections district dropdown
  const corrDistrictSelect = document.getElementById("c-district-select");
  if (corrDistrictSelect) {
    sortedNames.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.name;
      opt.textContent = d.name + " County";
      corrDistrictSelect.appendChild(opt);
    });
  }

  correctionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();
    const district = corrDistrictSelect.value;
    const source = document.getElementById("c-source").value.trim();
    const notes = document.getElementById("c-notes").value.trim();

    // Build corrections array from the 3 slots
    const corrections = [];
    for (let i = 1; i <= 3; i++) {
      const cat = document.getElementById("c" + i + "-category").value;
      const val = document.getElementById("c" + i + "-value").value.trim();
      if (cat && val) {
        corrections.push({ category: cat, value: val });
      }
    }

    if (!district) {
      errorBox.textContent = "Please select a district.";
      errorBox.style.display = "block";
      return;
    }

    if (corrections.length === 0) {
      errorBox.textContent = "Please fill in at least one correction (category + value).";
      errorBox.style.display = "block";
      return;
    }

    // Hide previous messages
    successBox.style.display = "none";
    errorBox.style.display = "none";

    // Disable button while submitting
    const submitBtn = correctionForm.querySelector(".btn-primary");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    const payload = {
      name: name || "Anonymous",
      email: email || "Not provided",
      district: district,
      corrections: corrections,
      source: source || "Not provided",
      notes: notes || "",
      timestamp: new Date().toISOString()
    };

    if (APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
      setTimeout(() => {
        successBox.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Correction";
        correctionForm.reset();
      }, 800);
      return;
    }

    // Send to Google Apps Script
    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(() => {
      successBox.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Correction";
      correctionForm.reset();
    })
    .catch(() => {
      errorBox.textContent = "Something went wrong. Please try again or email your correction directly.";
      errorBox.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Correction";
    });
  });

  // ── UPDATE HERO STATS FROM LIVE DATA ──────────────────
  // These update the hero stats dynamically from actual data
  const topTotal = rankedDistricts[0] ? rankedDistricts[0].total : 0;
  const lowestStart = rankedDistricts[rankedDistricts.length - 1] ? rankedDistricts[rankedDistricts.length - 1].total : 0;
  const gap = topTotal - lowestStart;

  // Update hero stats
  const statNums = document.querySelectorAll(".stat-num");
  if (statNums.length >= 3) {
    statNums[1].textContent = fmtShort(topTotal);
    statNums[2].textContent = fmtShort(lowestStart);
  }

  // Update wow section
  const wowGapNum = document.querySelector(".wow-gap-num");
  if (wowGapNum) wowGapNum.textContent = fmtShort(gap);

  const wowBarValues = document.querySelectorAll(".wow-bar-value");
  if (wowBarValues.length >= 2) {
    wowBarValues[0].textContent = fmtShort(topTotal);
    wowBarValues[1].textContent = fmtShort(lowestStart);
  }

  // Update low bar width proportionally
  const lowFill = document.querySelector(".wow-bar-fill.low");
  if (lowFill && topTotal > 0) {
    const pct = Math.round((lowestStart / topTotal) * 100);
    lowFill.style.width = pct + "%";
  }
});

// ── FULL-PAGE PARALLAX + COLOR TRANSITIONS ───────────────
(function() {
  const bg = document.getElementById("page-bg");
  const overlay = document.getElementById("page-overlay");
  if (!bg || !overlay) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Color stops for the overlay as you scroll
  // [scrollPercent, rgba string]
  // Hero area: dark navy, semi-transparent to show image
  // Wow section: slightly more transparent navy
  // Content area: shifts to a blue-grey tint
  function getOverlayColor(scrollY) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollY / docHeight : 0;

    // Blend from dark navy → navy-teal → blue-grey as you scroll
    if (pct < 0.15) {
      // Hero: dark navy, let image show through
      const t = pct / 0.15;
      const opacity = 0.82 + (t * 0.06); // 0.82 → 0.88
      return `rgba(11, 42, 60, ${opacity})`;
    } else if (pct < 0.35) {
      // Wow section: navy with slight teal shift
      const t = (pct - 0.15) / 0.20;
      const r = Math.round(11 + t * 8);   // 11 → 19
      const g = Math.round(42 + t * 14);  // 42 → 56
      const b = Math.round(60 + t * 12);  // 60 → 72
      const opacity = 0.88 - (t * 0.04);  // 0.88 → 0.84
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else if (pct < 0.7) {
      // Content area: transition to blue-grey
      const t = (pct - 0.35) / 0.35;
      const r = Math.round(19 + t * 20);  // 19 → 39
      const g = Math.round(56 + t * 24);  // 56 → 80
      const b = Math.round(72 + t * 20);  // 72 → 92
      const opacity = 0.84 - (t * 0.02);  // 0.84 → 0.82
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else {
      // Footer area: deeper navy again
      const t = (pct - 0.7) / 0.30;
      const r = Math.round(39 - t * 22);  // 39 → 17
      const g = Math.round(80 - t * 30);  // 80 → 50
      const b = Math.round(92 - t * 22);  // 92 → 70
      const opacity = 0.82 + (t * 0.10);  // 0.82 → 0.92
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Parallax the background image
      if (!prefersReduced) {
        bg.style.transform = `translateY(${scrollY * 0.15}px) scale(1.1)`;
      }

      // Transition overlay color
      overlay.style.background = getOverlayColor(scrollY);

      ticking = false;
    });
  });
})();

// ── WOW SECTION ANIMATION ────────────────────────────────
const wowSection = document.querySelector(".wow-section");
if (wowSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".wow-bar-fill").forEach(bar => {
          // Width is set dynamically in DOMContentLoaded
        });
      }
    });
  }, { threshold: 0.4 });
  observer.observe(wowSection);
}
