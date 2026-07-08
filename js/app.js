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
}


/* =========================
   NAV ACTIVE STATE
========================= */

function highlightCurrentNav() {

    let path = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (!path) {
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
   SIDEBAR LOAD
========================= */

function getSubsection() {

    const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

    return parts[2]?.toLowerCase() || "default";
}


async function loadSidebar() {

    const subsection = getSubsection();

    const file =
        `${BASE_PATH}/sidebar/sidebar-${subsection}.html`;

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


function setupSidebarEvents() {

    document
        .querySelector(".sidebar-toggle")
        ?.addEventListener(
            "click",
            toggleSidebar
        );
}


/* =========================
   SIDEBAR ACTIVE LINK
========================= */

function highlightCurrentSidebar() {

    const current =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    document
        .querySelectorAll(".side-nav a")
        .forEach(a => {

            const href =
                (a.getAttribute("href") || "")
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

    const layout =
        document.querySelector(".layout");

    if (!layout) return;


    layout.classList.remove("initial-hidden");


    const hidden =
        localStorage.getItem("sidebar_hidden");


    if (hidden !== "true") {
        layout.classList.add("sidebar-open");
    }


    // Browser zwingt Grid neu zu berechnen
    layout.offsetHeight;


    // Plot nach initialem Layout anpassen
    requestAnimationFrame(() => {

        const plot =
            document.getElementById("plot");

        if (
            plot &&
            window.Plotly
        ) {
            Plotly.Plots.resize(plot);
        }

    });
}



function toggleSidebar() {

    const layout =
        document.querySelector(".layout");


    if (!layout) return;


    layout.classList.toggle("sidebar-open");


    const isOpen =
        layout.classList.contains("sidebar-open");


    localStorage.setItem(
        "sidebar_hidden",
        !isOpen
    );


    /*
       Warten bis CSS Grid Transition fertig ist
       und Plot neu berechnen
    */

    layout.addEventListener(
        "transitionend",
        () => {

            const plot =
                document.getElementById("plot");

            if (
                plot &&
                window.Plotly
           ) {
                Plotly.Plots.resize(plot);
            }

        },
        { once: true }
    );
}



/* =========================
   PROGRESS SIDEBAR
========================= */

function updateProgressSidebar() {

    // Umsetzung
    const done_umsetzung =
        localStorage.getItem("umsetzung_done");


    const p_umsetzung =
        document.getElementById("progress-umsetzung");


    if (!p_umsetzung) return;


    if (done_umsetzung) {

        p_umsetzung.textContent =
            "Umsetzung ✔";

        p_umsetzung.style.color =
            "green";

    }

    // Anwendung
    const done_anwendung =
        localStorage.getItem("anwendung_done");


    const p_anwendung =
        document.getElementById("progress-anwendung");


    if (!p_anwendung) return;


    if (done_anwendung) {

        p_umsetzung.textContent =
            "Anwendung ✔";

        p_umsetzung.style.color =
            "green";

    }

}


/* =========================
   MATH SETUP
========================= */

async function renderMathInContent() {

    const content =
        document.querySelector(".content");


    if (
        !content ||
        !window.MathJax
    ) return;


    await MathJax.startup?.promise;


    if (MathJax.typesetPromise) {

        await MathJax.typesetPromise(
            [content]
        );

    }

}


/* =========================
   INITIAL UI STATE
========================= */

function applyUIState() {

    highlightCurrentNav();

    highlightProgressNav();

    initSidebarState();

    updateProgressSidebar();

}


/* =========================
   PAGE INIT
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initPage
);



async function initPage() {


    await fetchNav();


    await loadSidebar();


    applyUIState();


    setupSidebarEvents();


    await renderMathInContent();



    /*
       Falls Seite mit geöffneter Sidebar
       geladen wurde:
       Plot nach Layout-Berechnung
       korrigieren
    */

    setTimeout(() => {

        const plot =
            document.getElementById("plot");
    
        if (
            plot &&
            window.Plotly
        ) {
            Plotly.Plots.resize(plot);
        }

    }, 500);

}