// ==========================================
// WMF AMAZON OPTIMIZATION PAGE
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
// AMAZON OPTIMIZATION PACKAGES
// ==========================================

// Temporary package examples.
// Confirm all package details with WMF before launch.

const amazonPackages = [

    {
        name: "Basic Optimization",

        price: "Price to be confirmed",

        description:
            "An introductory option for authors requesting listing support.",

        deliverables: [
            "Listing requirements review",
            "Metadata support scope to be confirmed",
            "Keyword research scope to be confirmed",
            "Delivery estimate to be confirmed",
            "Revision allowance to be confirmed"
        ]

    },

    {
        name: "Standard Optimization",

        price: "Price to be confirmed",

        description:
            "A broader optimization option for authors.",

        deliverables: [
            "Listing review",
            "Metadata support",
            "Keyword research",
            "Deliverables to be confirmed",
            "Delivery and revisions to be confirmed"
        ]

    },

    {
        name: "Premium Optimization",

        price: "Price to be confirmed",

        description:
            "An extended option that may include A+ Content design where eligible.",

        deliverables: [
            "Extended listing review",
            "Keyword research scope to be confirmed",
            "Metadata support",
            "A+ Content design where eligible and agreed",
            "Delivery and revisions to be confirmed"
        ]

    }

];


// DISPLAY PACKAGE CARDS

const packageContainer = document.getElementById("amazonPackages");

if (packageContainer) {

    amazonPackages.forEach((pkg, index) => {

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
            "order.html?service=amazon-optimization&package=" +
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

        // Close all questions.

        faqItems.forEach(otherItem => {

            otherItem.classList.remove("open");

            const otherIcon =
                otherItem.querySelector(".faq-question span");

            if (otherIcon) {
                otherIcon.textContent = "+";
            }

        });

        // Open selected question.

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
    "WMF Amazon Optimization page loaded successfully."
);
