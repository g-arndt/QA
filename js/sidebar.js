document.addEventListener("DOMContentLoaded", () => {
    loadHTML("nav", "/QA/nav/nav.html");

    const page = getPageName();

    // map pages to sidebar files
    const sidebarMap = {
        "index": "/QA/sidebar/index.html",
        "theorie": "/QA/sidebar/theorie.html",
        "schwingung": "/QA/sidebar/schwingung.html",
        "quiz": "/QA/sidebar/quiz.html"
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


function updateProgressSidebar() {

    const done = localStorage.getItem("schwingung_quiz_done");
    const p = document.getElementById("progress");

    if (!p) return; // ← WICHTIG

    if (done) {
        p.textContent = "Schwingung: ✔ ";
        p.style.color = "green";
    }
}

