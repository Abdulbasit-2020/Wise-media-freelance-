// ========================================
// WMF BOOK TRAILER DETAILS PAGE
// ========================================


// 1. MOBILE NAVIGATION

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mainNavigation = document.getElementById("mainNavigation");

if (mobileMenuButton && mainNavigation) {
    mobileMenuButton.addEventListener("click", () => {
        const isOpen = mainNavigation.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });
}


// 2. BOOK TRAILER PACKAGES

const packages = [
    {
        name: "Basic Package",
        price: "Price to be confirmed",
        description: "A starting option for authors who need a book trailer.",
        features: [
            "Project requirements discussion",
            "Agreed video deliverables",
            "Final delivery according to agreed terms"
        ]
    },

    {
        name: "Standard Package",
        price: "Price to be confirmed",
        description: "A package for authors seeking a more developed promotional presentation.",
        features: [
            "Project requirements discussion",
            "Agreed creative direction",
            "Agreed video deliverables",
            "Final delivery according to agreed terms"
        ]
    },

    {
        name: "Premium Package",
        price: "Price to be confirmed",
        description: "A package for projects with more extensive requirements.",
        features: [
            "Project requirements discussion",
            "Detailed creative direction",
            "Agreed video deliverables",
            "Final delivery according to agreed terms"
        ]
    }
];


// 3. DISPLAY PACKAGES

const packageContainer = document.getElementById("packageContainer");

if (packageContainer) {

    packages.forEach((item, index) => {

        const card = document.createElement("div");
        card.className = "package-card";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const price = document.createElement("div");
        price.className = "package-price gold-text";
        price.textContent = item.price;

        const description = document.createElement("p");
        description.textContent = item.description;

        const list = document.createElement("ul");

        item.features.forEach(feature => {
            const li = document.createElement("li");
            li.textContent = feature;
            list.appendChild(li);
        });

        const orderLink = document.createElement("a");
        orderLink.className = "gold-button";
        orderLink.href =
            `order.html?service=book-trailer&package=${encodeURIComponent(item.name)}`;
        orderLink.textContent = "Choose Package";

        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(description);
        card.appendChild(list);
        card.appendChild(orderLink);

        packageContainer.appendChild(card);
    });
}


// 4. FAQ ACCORDION

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        const wasActive = item.classList.contains("active");

        // Close all questions first
        faqItems.forEach(faq => {
            faq.classList.remove("active");
        });

        // Open selected question if it was previously closed
        if (!wasActive) {
            item.classList.add("active");
        }

    });

});


// 5. CURRENT YEAR SUPPORT

const currentYear = new Date().getFullYear();

console.log(`WMF Book Trailer Details Page Loaded - ${currentYear}`);
