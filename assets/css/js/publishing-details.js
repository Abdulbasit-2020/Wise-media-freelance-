// ============================================
// WMF PUBLISHING DETAILS PAGE
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


// 2. PUBLISHING PACKAGES

// These are temporary display placeholders.
// Replace them with the client's approved package details.

const publishingPackages = [

    {
        name: "Basic Publishing Support",
        price: "Price to be confirmed",

        description:
            "For authors who need selected publishing preparation services.",

        features: [
            "Project requirements discussion",
            "Agreed publishing preparation tasks",
            "Specified final deliverables"
        ]
    },

    {
        name: "Standard Publishing Package",
        price: "Price to be confirmed",

        description:
            "For authors who need a broader combination of publishing support.",

        features: [
            "Project assessment",
            "Agreed manuscript preparation",
            "Selected design or formatting support",
            "Specified final deliverables"
        ]
    },

    {
        name: "Complete Publishing Package",
        price: "Price to be confirmed",

        description:
            "For authors seeking a more comprehensive publishing project.",

        features: [
            "Publishing project discussion",
            "Agreed manuscript preparation",
            "Agreed design and formatting tasks",
            "Publishing preparation support",
            "Specified final deliverables"
        ]
    }

];


// 3. DISPLAY PACKAGES

const packageContainer = document.getElementById("packageContainer");

if (packageContainer) {

    publishingPackages.forEach((item) => {

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
            `order.html?service=publishing-full-package&package=${encodeURIComponent(item.name)}`;

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


// 5. PAGE STATUS

console.log("WMF Publishing Details Page Loaded.");
