// ========================================
// WMF CONTACT PAGE
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
// CONTACT FORM
// ========================================

const contactForm = document.getElementById("contactForm");

const formMessage = document.getElementById("formMessage");

const contactSubmitButton = document.getElementById(
  "contactSubmitButton"
);


if (contactForm) {

  contactForm.addEventListener("submit", (event) => {

    event.preventDefault();

    formMessage.className = "form-message";
    formMessage.textContent = "";

    if (!contactForm.checkValidity()) {

      contactForm.reportValidity();

      return;

    }


    // Collect form information.
    // This data is NOT sent to a server yet.

    const enquiry = {

      fullName: document.getElementById("fullName").value.trim(),

      email: document.getElementById("email").value.trim(),

      service: document.getElementById("service").value,

      subject: document.getElementById("subject").value.trim(),

      message: document.getElementById("message").value.trim(),

      createdAt: new Date().toISOString()

    };


    // Basic validation

    if (
      !enquiry.fullName ||
      !enquiry.email ||
      !enquiry.service ||
      !enquiry.subject ||
      !enquiry.message
    ) {

      formMessage.textContent =
        "Please complete all required fields.";

      formMessage.classList.add("error");

      return;

    }


    // Temporary demonstration response.
    // Firebase submission will be implemented later.

    formMessage.textContent =
      "Your form has passed the frontend checks. However, the contact system is not connected yet, so your enquiry has NOT been sent. Please do not treat this message as a successful submission.";

    formMessage.classList.add("error");


    // Keep the button available.
    // Do not clear the user's message.

    console.log(
      "Contact form demonstration data:",
      enquiry
    );

  });

}
