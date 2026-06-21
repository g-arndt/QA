const BASE_PATH =
    location.hostname.includes("github.io")
        ? "/QA"
        : "";

/* =========================
   NAV
========================= */

async function fetchNav() {
    const res = await fetch(`${BASE_PATH}/nav/nav.html`);
    const html = await res.text();

    document.getElementById("nav").innerHTML = html;

    highlightCurrentNav();
    highlightProgressNav();
    initSidebarState();

    document.querySelector(".sidebar-toggle")
        ?.addEventListener("click", toggleSidebar);
}

/* =========================
   NAV ACTIVE STATE
========================= */

function highlightCurrentNav() {
    let path = window.location.pathname.split("/").pop().toLowerCase();

    if (!path || path === "") {
        path = "index.html";
    }

    document.querySelectorAll("#nav a").forEach(a => {
        const href = (a.getAttribute("href") || "")
            .split("/")
            .pop()
            .toLowerCase();

        if (href === path) {
            a.classList.add("active");
        }
    });
}

/* =========================
   PROGRESS INDICATOR
========================= */

function highlightProgressNav() {

    const pages = [
        "theorie",
        "umsetzung",
        "anwendung",
        "selbsttest"
    ];

    pages.forEach(page => {

        const navItem = document.getElementById(`nav-${page}`);

        if (
            navItem &&
            localStorage.getItem(`${page}_done`)
        ) {
            navItem.style.fontStyle = "italic";
        }

    });
}

/* =========================
   SIDEBAR (FOLDER-BASED)
========================= */

function getSubsection() {
    const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

    return parts[2]?.toLowerCase() || "default";
}

async function loadSidebar() {
    const subsection = getSubsection();

    const file = `${BASE_PATH}/sidebar/sidebar-${subsection}.html`;

    const el = document.getElementById("sidebar");

    try {
        const res = await fetch(file);

        if (!res.ok) {
            console.warn("Sidebar not found:", file);
            el.innerHTML = "";
            return;
        }

        el.innerHTML = await res.text();

        highlightCurrentSidebar();
        updateProgressSidebar();

    } catch (err) {
        console.error("Sidebar load failed:", err);
    }
}

/* =========================
   SIDEBAR ACTIVE LINK
========================= */

function highlightCurrentSidebar() {
    const current = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(".side-nav a").forEach(a => {
        const href = (a.getAttribute("href") || "")
            .split("/")
            .pop()
            .toLowerCase();

        if (href === current) {
            a.classList.add("active");
        }
    });
}

/* =========================
   SIDEBAR STATE
========================= */

function initSidebarState() {
    const layout = document.querySelector(".layout");
    if (!layout) return;

    layout.classList.remove("initial-hidden");

    const hidden = localStorage.getItem("sidebar_hidden");

    if (hidden !== "true") {
        layout.classList.add("sidebar-open");
    }
}

function toggleSidebar() {
    const layout = document.querySelector(".layout");
    if (!layout) return;

    layout.classList.toggle("sidebar-open");

    const isOpen = layout.classList.contains("sidebar-open");
    localStorage.setItem("sidebar_hidden", !isOpen);
}

/* =========================
   PROGRESS (SIDEBAR)
========================= */

function updateProgressSidebar() {
    const done = localStorage.getItem("schwingung_quiz_done");
    const p = document.getElementById("progress");

    if (!p) return;

    if (done) {
        p.textContent = "Schwingung: ✔";
        p.style.color = "green";
    }
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {
    await fetchNav();
    await loadSidebar();
});