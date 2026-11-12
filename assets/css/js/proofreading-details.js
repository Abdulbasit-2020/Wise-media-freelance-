// ============================================
// WMF PROOFREADING AND EDITING DETAILS
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


// 2. EDITING PACKAGES

// Temporary package information.
// Replace with approved WMF package details.

const editingPackages = [

    {
        name: "Proofreading",
        price: "Price to be confirmed",

        description:
            "For manuscripts requiring a final surface-level review.",

        features: [
            "Spelling review",
            "Grammar and punctuation review",
            "Typographical error checks",
            "Agreed manuscript delivery"
        ]
    },

    {
        name: "Standard Editing",
        price: "Price to be confirmed",

        description:
            "For manuscripts requiring broader language improvements.",

        features: [
            "Grammar and spelling review",
            "Sentence clarity review",
            "Consistency checks",
            "Agreed editing scope"
        ]
    },

    {
        name: "Comprehensive Editing",
        price: "Price to be confirmed",

        description:
            "For projects requiring a more extensive editing scope.",

        features: [
            "Detailed manuscript assessment",
            "Broader language improvements",
            "Readability review",
            "Agreed editing deliverables"
        ]
    }

];


// 3. DISPLAY PACKAGES

const packageContainer = document.getElementById("packageContainer");

if (packageContainer) {

    editingPackages.forEach((item) => {

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
            `order.html?service=proofreading-editing&package=${encodeURIComponent(item.name)}`;

        orderButton.textContent = "Choose Service";

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

console.log("WMF Proofreading and Editing Page Loaded.");
