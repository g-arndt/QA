function fetchNav() {

    return fetch("/nav/nav.html")
        .then(response => {
            console.log("Status:", response.status);
            return response.text();
        })
        .then(html => {
            console.log(html);

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

    if (!localStorage.getItem("schwingung_quiz_done")) {
        return;
    }

    const navItem = document.getElementById("nav-schwingung");

    if (!navItem) {
        console.warn("nav-schwingung nicht gefunden");
        return;
    }

    navItem.style.fontStyle = "italic";
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





