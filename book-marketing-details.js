// ==========================================
// WMF BOOK MARKETING & PROMOTION PAGE
// ==========================================


// MOBILE NAVIGATION

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mainNavigation = document.getElementById("mainNavigation");

if (mobileMenuButton && mainNavigation) {

    mobileMenuButton.addEventListener("click", () => {

        const isOpen = mainNavigation.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileMenuButton.textContent = isOpen ? "✕" : "☰";

    });

}


// ==========================================
// MARKETING PACKAGES
// ==========================================

// These are provisional package examples.
// WMF must confirm the actual service scope,
// price, advertising budget and delivery terms.

const marketingPackages = [

    {
        name: "Basic Promotion",

        price: "Price to be confirmed",

        description:
            "An introductory option for authors requesting selected promotional support.",

        deliverables: [
            "Promotional requirements review",
            "Selected promotional activity to be agreed",
            "Deliverables to be confirmed",
            "Delivery schedule to be confirmed",
            "Revision terms to be confirmed"
        ]

    },

    {
        name: "Standard Promotion",

        price: "Price to be confirmed",

        description:
            "A broader promotional option for authors.",

        deliverables: [
            "Campaign planning support",
            "Selected promotional channels to be agreed",
            "Creative requirements to be confirmed",
            "Campaign duration to be confirmed",
            "Reporting scope to be confirmed"
        ]

    },

    {
        name: "Premium Promotion",

        price: "Price to be confirmed",

        description:
            "An extended promotional option with a wider campaign scope.",

        deliverables: [
            "Extended campaign planning",
            "Multiple promotional activities where agreed",
            "Creative and campaign scope to be confirmed",
            "Campaign duration to be confirmed",
            "Reporting and revision terms to be confirmed"
        ]

    }

];


// DISPLAY PACKAGE CARDS

const packageContainer = document.getElementById("marketingPackages");

if (packageContainer) {

    marketingPackages.forEach((pkg, index) => {

        const card = document.createElement("div");

        card.className = "package-card";

        if (index === 1) {
            card.classList.add("featured");
        }

        const title = document.createElement("h3");
        title.textContent = pkg.name;

        const description = document.createElement("p");
        description.textContent = pkg.description;

        const price = document.createElement("div");
        price.className = "package-price";
        price.textContent = pkg.price;

        const list = document.createElement("ul");

        pkg.deliverables.forEach(deliverable => {

            const item = document.createElement("li");

            item.textContent = deliverable;

            list.appendChild(item);

        });

        const button = document.createElement("a");

        button.className = "wmf-button";

        button.href =
            "order.html?service=book-marketing-promotion&package=" +
            encodeURIComponent(pkg.name);

        button.textContent = "SELECT PACKAGE";

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(price);
        card.appendChild(list);
        card.appendChild(button);

        packageContainer.appendChild(card);

    });

}


// ==========================================
// FAQ ACCORDION
// ==========================================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    const icon = question.querySelector("span");

    question.addEventListener("click", () => {

        const isOpen = item.classList.contains("open");

        // Close all FAQ items.

        faqItems.forEach(otherItem => {

            otherItem.classList.remove("open");

            const otherIcon =
                otherItem.querySelector(".faq-question span");

            if (otherIcon) {
                otherIcon.textContent = "+";
            }

        });

        // Open selected item.

        if (!isOpen) {

            item.classList.add("open");

            if (icon) {
                icon.textContent = "−";
            }

        }

    });

});


// ==========================================
// PAGE LOADED
// ==========================================

console.log(
    "WMF Book Marketing & Promotion page loaded successfully."
);
