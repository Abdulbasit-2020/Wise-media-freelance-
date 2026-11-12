// ========================================
// WMF FAQ PAGE
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


// COPYRIGHT YEAR

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


// ========================================
// FAQ ACCORDION
// ========================================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {

    const isOpen = item.classList.contains("active");

    // Close all FAQ items first
    faqItems.forEach(otherItem => {

      otherItem.classList.remove("active");

      const otherQuestion = otherItem.querySelector(".faq-question");

      otherQuestion.setAttribute("aria-expanded", "false");

    });


    // Open the selected item if it was previously closed
    if (!isOpen) {

      item.classList.add("active");

      question.setAttribute("aria-expanded", "true");

    }

  });

});
