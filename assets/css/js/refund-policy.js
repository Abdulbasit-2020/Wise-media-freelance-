// ==========================================
// WMF REFUND & CANCELLATION POLICY PAGE
// ==========================================


// MOBILE NAVIGATION
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mainNavigation = document.getElementById("mainNavigation");

if (mobileMenuButton && mainNavigation) {

    mobileMenuButton.addEventListener("click", () => {

        const isActive = mainNavigation.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            isActive ? "true" : "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            isActive ? "Close navigation" : "Open navigation"
        );

        mobileMenuButton.textContent = isActive ? "✕" : "☰";

    });


    // CLOSE MENU WHEN A LINK IS CLICKED
    const navigationLinks = mainNavigation.querySelectorAll("a");

    navigationLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNavigation.classList.remove("active");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Open navigation"
            );

            mobileMenuButton.textContent = "☰";

        });

    });

}


// AUTOMATIC COPYRIGHT YEAR
const currentYear = document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


// ==========================================
// END OF REFUND POLICY JAVASCRIPT
// ==========================================
