// ========================================
// WMF TERMS AND CONDITIONS PAGE
// ========================================


// MOBILE NAVIGATION

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mainNavigation = document.getElementById("mainNavigation");

if (mobileMenuButton && mainNavigation) {

  mobileMenuButton.addEventListener("click", () => {

    const isActive = mainNavigation.classList.toggle("active");

    mobileMenuButton.setAttribute(
      "aria-expanded",
      String(isActive)
    );

    mobileMenuButton.textContent = isActive ? "✕" : "☰";

  });

}


// AUTOMATIC COPYRIGHT YEAR

const currentYear = document.getElementById("currentYear");

if (currentYear) {

  currentYear.textContent = new Date().getFullYear();

}
