const BASE_PATH =
    location.hostname.includes("github.io")
        ? "/QA"
        : "";

function fetchNav() {

    return fetch("/QA/nav/nav.html")
        .then(response => response.text())
        .then(html => {

            document.getElementById("nav").innerHTML = html;

            highlightCurrentNav();
            highlightProgressNav();
            highlightCurrentSidebar();
            updateProgressSidebar();
            initSidebarState();

            document.querySelector(".sidebar-toggle")
                ?.addEventListener("click", toggleSidebar);
        });
}

function highlightCurrentNav() {

    let path = window.location.pathname.split("/").pop().toLowerCase();

    if (!path || path === "") {
        path = "index.html";
    }

    console.log("ACTIVE CHECK:", path);

    document.querySelectorAll("#nav a").forEach(a => {

        const href = (a.getAttribute("href") || "")
            .split("/")
            .pop()
            .toLowerCase();

        console.log("LINK:", href);

        if (href === path) {
            a.classList.add("active");
        }
    });
}

function highlightProgressNav() {

    const navItem = document.getElementById("nav-schwingung");

    if (!navItem) {
        console.log("nav-schwingung nicht gefunden");
        return;
    }

    if (localStorage.getItem("schwingung_quiz_done")) {
        navItem.style.fontStyle = "italic";
    }
}


async function loadHTML(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    try {
        const res = await fetch(file);
        el.innerHTML = await res.text();
    } catch (err) {
        console.error("Failed to load", file, err);
    }
}

// detect page name from URL
function getPageName() {
    const path = window.location.pathname;
    const file = path.split("/").pop(); // e.g. Schwingung.html
    return file.replace(".html", "").toLowerCase();
}


document.addEventListener("DOMContentLoaded", () => {
    loadHTML("nav", "/QA/nav/nav.html");

    const page = getPageName();

    // map pages to sidebar files
    const sidebarMap = {
        "index": "/QA/sidebar/sidebar-index.html",
        "theorie": "/QA/sidebar/sidebar-theorie.html",
        "schwingung": "/QA/sidebar/sidebar-schwingung.html",
        "quiz": "/QA/sidebar/sidebar-quiz.html"
    };

    const sidebarFile = sidebarMap[page] || "/QA/sidebar/default.html";

    loadHTML("sidebar", sidebarFile);
});


function initSidebarState() {

    const layout = document.querySelector(".layout");
    if (!layout) return;

    const hidden = localStorage.getItem("sidebar_hidden");

    if (hidden !== "true") {
        layout.classList.add("sidebar-open");
    }

    console.log("sidebar state:", hidden);
}


function toggleSidebar() {

    const layout = document.querySelector(".layout");
    if (!layout) return;

    layout.classList.toggle("sidebar-open");

    const isOpen = layout.classList.contains("sidebar-open");

    localStorage.setItem("sidebar_hidden", !isOpen);
}


function highlightCurrentSidebar() {

    const path = window.location.pathname.split("/").pop().toLowerCase();

    document.querySelectorAll(".side-nav a").forEach(a => {

        const href = a.getAttribute("href").toLowerCase();

        if (href === path) {
            a.classList.add("active");
        }
    });
}


function updateProgressSidebar() {

    const done = localStorage.getItem("schwingung_quiz_done");
    const p = document.getElementById("progress");

    if (!p) return; // ← WICHTIG

    if (done) {
        p.textContent = "Schwingung: ✔ ";
        p.style.color = "green";
    }
}






