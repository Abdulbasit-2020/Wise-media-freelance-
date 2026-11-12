// ========================================
// WMF TESTIMONIALS PAGE
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


// ========================================
// TESTIMONIAL DATA
// ========================================

// Only genuine, approved client testimonials
// should be added here.
//
// Firebase Firestore collection planned:
// testimonials
//
// Suggested fields:
// - clientName
// - clientRole
// - message
// - imageUrl (optional)
// - approved
// - featured
// - createdAt

const testimonials = [];


// ========================================
// DISPLAY TESTIMONIALS
// ========================================

const testimonialsGrid = document.getElementById("testimonialsGrid");
const testimonialsEmpty = document.getElementById("testimonialsEmpty");


function displayTestimonials() {

  if (!testimonialsGrid || !testimonialsEmpty) {
    return;
  }

  testimonialsGrid.innerHTML = "";

  // Display only approved testimonials
  const approvedTestimonials = testimonials.filter(
    testimonial => testimonial.approved === true
  );

  if (approvedTestimonials.length === 0) {
    testimonialsEmpty.hidden = false;
    return;
  }

  testimonialsEmpty.hidden = true;

  approvedTestimonials.forEach(testimonial => {

    const card = document.createElement("article");
    card.className = "testimonial-card";

    const quote = document.createElement("div");
    quote.className = "testimonial-quote";
    quote.textContent = "“";

    const message = document.createElement("p");
    message.className = "testimonial-message";
    message.textContent = testimonial.message || "";

    const client = document.createElement("div");
    client.className = "testimonial-client";

    if (testimonial.imageUrl) {
      const image = document.createElement("img");

      image.className = "testimonial-avatar";
      image.src = testimonial.imageUrl;
      image.alt = "";
      image.loading = "lazy";

      client.appendChild(image);
    }

    const details = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = testimonial.clientName || "WMF Client";

    const role = document.createElement("span");
    role.textContent = testimonial.clientRole || "";

    details.appendChild(name);
    details.appendChild(role);

    client.appendChild(details);

    card.appendChild(quote);
    card.appendChild(message);
    card.appendChild(client);

    testimonialsGrid.appendChild(card);

  });

}


// INITIALISE PAGE
displayTestimonials();
