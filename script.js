// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ===== Year =====
$("#year").textContent = new Date().getFullYear();

// ===== Mobile Menu =====
const burger = $("#burger");
const menu = $("#menu");

burger.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("show");
  burger.setAttribute("aria-expanded", String(isOpen));
});

// Close menu on link click (mobile)
$$(".menu a").forEach(a => {
  a.addEventListener("click", () => {
    menu.classList.remove("show");
    burger.setAttribute("aria-expanded", "false");
  });
});

// ===== Active Nav Link on Scroll =====
const sections = ["projects", "skills", "experience", "certifications", "contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navLinks = $$(".navlink").filter(a => a.getAttribute("href")?.startsWith("#"));

function setActiveLink() {
  const y = window.scrollY + 120;
  let currentId = "home";

  for (const sec of sections) {
    if (sec.offsetTop <= y) currentId = sec.id;
  }

  navLinks.forEach(a => {
    const id = a.getAttribute("href").slice(1);
    a.classList.toggle("active", id === currentId);
  });
}

window.addEventListener("scroll", setActiveLink);
setActiveLink();

// ===== Project Filter + Search =====
const chips = $$(".chip");
const projectSearch = $("#projectSearch");
const cards = $$("#projectGrid .pcard");

let activeFilter = "all";

function applyProjectFilters() {
  const q = (projectSearch.value || "").trim().toLowerCase();

  cards.forEach(card => {
    const tags = (card.getAttribute("data-tags") || "").toLowerCase();
    const title = (card.getAttribute("data-title") || "").toLowerCase();

    const matchesFilter = activeFilter === "all" ? true : tags.includes(activeFilter);
    const matchesSearch = q === "" ? true : (title.includes(q) || tags.includes(q));

    card.classList.toggle("hidden", !(matchesFilter && matchesSearch));
  });
}

chips.forEach(btn => {
  btn.addEventListener("click", () => {
    chips.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.getAttribute("data-filter");
    applyProjectFilters();
  });
});

projectSearch.addEventListener("input", applyProjectFilters);

// ===== Modal (Project Details) =====
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const modalClose = $("#modalClose");

const PROJECT_DETAILS = {
  p1: {
    title: "Mini Voting System (Python)",
    body: `
      <p><b>Overview:</b> A Python-based mini voting system to automate vote collection and result calculation.</p>
      <ul>
        <li>Implemented candidate and voter handling workflow.</li>
        <li>Automated vote counting and result summary generation.</li>
        <li>Added basic validations to reduce input errors.</li>
      </ul>
      <p><b>Suggested Add-ons:</b> Export results to CSV, store votes in SQLite, add simple UI.</p>
    `
  },
  p2: {
    title: "Netflix Content Analysis (Excel)",
    body: `
      <p><b>Overview:</b> Excel-based analysis on Netflix dataset using Pivot Tables and Charts to identify trends.</p>
      <ul>
        <li>Created pivot tables to analyze genres, type (Movie/TV), and release years.</li>
        <li>Built charts for content distribution and trend reporting.</li>
        <li>Summarized insights for decision support (popular genres, growth over years).</li>
      </ul>
      <p><b>Suggested Add-ons:</b> Add slicers, KPI cards, and a dashboard page.</p>
    `
  },
  p3: {
    title: "Healthcare Liver Risk Dashboard (Python • ML • Streamlit)",
    body: `
      <p><b>Overview:</b> A Machine Learning–based healthcare dashboard built using Python and Streamlit to monitor liver disease risk.</p>
      <ul>
        <li>Performed data preprocessing and feature handling for improved accuracy.</li>
        <li>Built interactive dashboard views for patient insights and risk monitoring.</li>
        <li>Displayed trends and key metrics to support clinical/admin reporting.</li>
      </ul>
      <p><b>Suggested Add-ons:</b> Model evaluation metrics, ROC curve, and exportable reports.</p>
    `
  }
};

function openModal(key) {
  const data = PROJECT_DETAILS[key];
  if (!data) return;
  modalTitle.textContent = data.title;
  modalBody.innerHTML = data.body;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.getAttribute("data-open")));
});

modalClose.addEventListener("click", closeModal);
$$("[data-close]").forEach(el => el.addEventListener("click", closeModal));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ===== Contact Form (mailto) =====
const form = $("#contactForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  const subject = encodeURIComponent(`Portfolio Inquiry - Thrisha Cheruku`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:cherukuthrisha@gmail.com?subject=${subject}&body=${body}`;
});