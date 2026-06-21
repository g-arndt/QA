(function () {
    // avoid double-loading
    if (window.MathJax) return;

    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']]
        }
    };

    // load MathJax script dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.defer = true;

    document.head.appendChild(script);
})();