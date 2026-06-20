
const BASE_PATH =
    window.location.hostname.includes("github.io")
        ? "/QA"
        : "";

document.getElementById("nav-start").href =
    BASE_PATH + "/index.html";

document.getElementById("nav-theorie").href =
    BASE_PATH + "/Kapitel/Theorie.html";

document.getElementById("nav-schwingung").href =
    BASE_PATH + "/Kapitel/Schwingung.html";

document.getElementById("nav-quiz").href =
    BASE_PATH + "/Kapitel/Quiz.html";

function fetchNav() {

    return fetch(BASE_PATH + "/nav/nav.html")
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

function toggleSidebar() {

    const layout = document.querySelector(".layout");
    if (!layout) return;

    layout.classList.toggle("sidebar-open");

    const isOpen = layout.classList.contains("sidebar-open");

    localStorage.setItem("sidebar_hidden", !isOpen);
}

function initSidebarState() {

    const layout = document.querySelector(".layout");
    if (!layout) return;

    const hidden = localStorage.getItem("sidebar_hidden");

    if (hidden !== "true") {
        layout.classList.add("sidebar-open");
    }

    console.log("sidebar state:", hidden);
}





