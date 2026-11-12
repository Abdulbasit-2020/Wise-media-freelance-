// ==========================================
// WMF BOOK COVER & INTERIOR DESIGN PAGE
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
// BOOK DESIGN PACKAGES
// ==========================================

// These are temporary package examples.
// WMF must approve the actual package contents,
// prices, currency, delivery estimates and revisions.

const designPackages = [

    {
        name: "Basic Design",
        price: "Price to be confirmed",

        description:
            "A starting option for authors with a smaller design requirement.",

        deliverables: [
            "Design scope to be confirmed",
            "Book specifications to be reviewed",
            "Final file format to be agreed",
            "Revision allowance to be confirmed",
            "Delivery estimate to be confirmed"
        ]
    },

    {
        name: "Standard Design",
        price: "Price to be confirmed",

        description:
            "An option for authors requesting a broader design scope.",

        deliverables: [
            "Design scope to be confirmed",
            "Cover and/or interior requirements to be agreed",
            "Publishing specifications to be reviewed",
            "Revision allowance to be confirmed",
            "Delivery estimate to be confirmed"
        ]
    },

    {
        name: "Premium Design",
        price: "Price to be confirmed",

        description:
            "An option for projects requiring a more extensive design scope.",

        deliverables: [
            "Full project requirements review",
            "Cover and interior scope to be agreed",
            "Final file formats to be confirmed",
            "Revision allowance to be confirmed",
            "Delivery estimate to be confirmed"
        ]
    }

];


// DISPLAY PACKAGE CARDS

const packageContainer = document.getElementById("designPackages");

if (packageContainer) {

    designPackages.forEach((pkg, index) => {

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

        pkg.deliverables.forEach(item => {

            const listItem = document.createElement("li");

            listItem.textContent = item;

            list.appendChild(listItem);

        });

        const button = document.createElement("a");

        button.className = "wmf-button";

        button.href =
            "order.html?service=book-cover-interior-design&package=" +
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

        // Close all FAQ items first.
        faqItems.forEach(otherItem => {

            otherItem.classList.remove("open");

            const otherIcon =
                otherItem.querySelector(".faq-question span");

            if (otherIcon) {
                otherIcon.textContent = "+";
            }

        });

        // Open the selected item if it was previously closed.
        if (!isOpen) {

            item.classList.add("open");

            if (icon) {
                icon.textContent = "−";
            }

        }

    });

});


// ==========================================
// PAGE READY MESSAGE
// ==========================================

console.log(
    "WMF Book Cover & Interior Design page loaded successfully."
);
