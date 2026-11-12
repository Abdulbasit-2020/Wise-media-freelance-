// ==========================================
// WMF ADMIN DASHBOARD
// FRONTEND VERSION
// ==========================================


// ==========================================
// 1. MOBILE NAVIGATION
// ==========================================

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mainNavigation =
    document.getElementById("mainNavigation");


if (mobileMenuButton && mainNavigation) {

    mobileMenuButton.addEventListener("click", () => {

        const isActive =
            mainNavigation.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            isActive ? "true" : "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            isActive ? "Close navigation" : "Open navigation"
        );

        mobileMenuButton.textContent =
            isActive ? "✕" : "☰";

    });


    const navigationLinks =
        mainNavigation.querySelectorAll("a");

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



// ==========================================
// 2. COPYRIGHT YEAR
// ==========================================

const currentYear =
    document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}



// ==========================================
// 3. ADMIN FEATURE PLACEHOLDERS
// ==========================================

const adminFeatureButtons =
    document.querySelectorAll("[data-feature]");

const adminMessage =
    document.getElementById("adminMessage");


adminFeatureButtons.forEach(button => {

    button.addEventListener("click", () => {

        const featureName =
            button.dataset.feature;

        if (adminMessage) {

            adminMessage.textContent =
                featureName +
                " is not connected yet. " +
                "It will become available after Firebase " +
                "and administrator permissions are implemented.";

            adminMessage.className =
                "admin-message info";

            adminMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    });

});



// ==========================================
// 4. DEVELOPMENT STATUS
// ==========================================

console.info(
    "WMF Admin Dashboard frontend loaded."
);

console.info(
    "Authentication and administrative database features " +
    "have not been connected."
);



// ==========================================
// END OF ADMIN DASHBOARD JAVASCRIPT
// ==========================================
