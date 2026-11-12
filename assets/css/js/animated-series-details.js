// ============================================
// WMF ANIMATED BOOK SERIES DETAILS
// ============================================


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


// 2. ANIMATED BOOK SERIES PACKAGES

// These are temporary placeholders.
// Replace them with the client's approved packages.

const animatedPackages = [

    {
        name: "Basic Package",
        price: "Price to be confirmed",

        description:
            "A starting option for an animated book project.",

        features: [
            "Project requirements discussion",
            "Agreed animation scope",
            "Final delivery according to agreed terms"
        ]
    },

    {
        name: "Standard Package",
        price: "Price to be confirmed",

        description:
            "An option for projects with additional creative requirements.",

        features: [
            "Project requirements discussion",
            "Creative planning",
            "Agreed animation deliverables",
            "Final delivery according to agreed terms"
        ]
    },

    {
        name: "Premium Package",
        price: "Price to be confirmed",

        description:
            "An option for projects with more extensive production needs.",

        features: [
            "Project requirements discussion",
            "Detailed creative planning",
            "Agreed production scope",
            "Final delivery according to agreed terms"
        ]
    }

];


// 3. DISPLAY PACKAGES

const packageContainer = document.getElementById("packageContainer");

if (packageContainer) {

    animatedPackages.forEach((item) => {

        const card = document.createElement("div");
        card.className = "package-card";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const price = document.createElement("div");
        price.className = "package-price";
        price.textContent = item.price;

        const description = document.createElement("p");
        description.textContent = item.description;

        const featureList = document.createElement("ul");

        item.features.forEach((feature) => {

            const li = document.createElement("li");
            li.textContent = feature;

            featureList.appendChild(li);

        });

        const orderButton = document.createElement("a");

        orderButton.className = "gold-button";

        orderButton.href =
            `order.html?service=animated-book-series&package=${encodeURIComponent(item.name)}`;

        orderButton.textContent = "Choose Package";

        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(description);
        card.appendChild(featureList);
        card.appendChild(orderButton);

        packageContainer.appendChild(card);

    });

}


// 4. FAQ ACCORDION

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        const wasActive = item.classList.contains("active");

        faqItems.forEach((faq) => {
            faq.classList.remove("active");
        });

        if (!wasActive) {
            item.classList.add("active");
        }

    });

});


// 5. PAGE LOADED

console.log("WMF Animated Book Series Details Page Loaded.");
