// ============================================
// WMF PORTFOLIO PAGE
// ============================================


// MOBILE NAVIGATION

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mainNavigation =
    document.getElementById("mainNavigation");

if (mobileMenuButton && mainNavigation) {

    mobileMenuButton.addEventListener("click", function () {

        const isOpen =
            mainNavigation.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

    });

}


// CURRENT YEAR

const currentYear =
    document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// ============================================
// PORTFOLIO PROJECTS
// ============================================

/*
Future Firebase collection:

portfolioProjects

Suggested document fields:

title
description
category
imageUrl
projectUrl
deliverables
published
displayOrder

Only genuine, permission-cleared projects
should be published.
*/


// No sample or fabricated projects are added.

let portfolioProjects = [];


// ============================================
// DISPLAY PORTFOLIO PROJECTS
// ============================================

const portfolioGrid =
    document.getElementById("portfolioGrid");

const portfolioEmpty =
    document.getElementById("portfolioEmpty");


function displayPortfolioProjects(projects) {

    if (!portfolioGrid || !portfolioEmpty) return;

    portfolioGrid.innerHTML = "";

    const publishedProjects = projects
        .filter(project => project.published === true)
        .sort((a, b) => {
            return (a.displayOrder || 0) -
                   (b.displayOrder || 0);
        });

    if (publishedProjects.length === 0) {

        portfolioEmpty.hidden = false;

        return;
    }

    portfolioEmpty.hidden = true;


    publishedProjects.forEach(project => {

        const card = document.createElement("article");

        card.className = "portfolio-card";

        const image = document.createElement("img");

        image.src = project.imageUrl || "";

        image.alt = project.title || "WMF portfolio project";

        image.loading = "lazy";


        const content = document.createElement("div");

        content.className = "portfolio-card-content";


        const category = document.createElement("span");

        category.className = "portfolio-category";

        category.textContent =
            project.categoryLabel || "Creative Project";


        const title = document.createElement("h3");

        title.textContent =
            project.title || "WMF Project";


        const description = document.createElement("p");

        description.textContent =
            project.description || "";


        content.appendChild(category);

        content.appendChild(title);

        content.appendChild(description);


        if (project.projectUrl) {

            const link = document.createElement("a");

            link.href = project.projectUrl;

            link.textContent = "VIEW PROJECT";

            content.appendChild(link);

        }


        card.appendChild(image);

        card.appendChild(content);

        portfolioGrid.appendChild(card);

    });

}


// ============================================
// PORTFOLIO FILTERS
// ============================================

const filterButtons =
    document.querySelectorAll(".portfolio-filter");


let selectedCategory = "all";


filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        selectedCategory =
            this.dataset.category || "all";

        filterPortfolio();

    });

});


// ============================================
// PORTFOLIO SEARCH
// ============================================

const portfolioSearch =
    document.getElementById("portfolioSearch");


if (portfolioSearch) {

    portfolioSearch.addEventListener("input", filterPortfolio);

}


function filterPortfolio() {

    const searchTerm = portfolioSearch
        ? portfolioSearch.value.toLowerCase().trim()
        : "";


    const filteredProjects = portfolioProjects.filter(project => {

        const matchesCategory =
            selectedCategory === "all" ||
            project.category === selectedCategory;


        const searchableText = (
            (project.title || "") + " " +
            (project.description || "") + " " +
            (project.categoryLabel || "")
        ).toLowerCase();


        const matchesSearch =
            searchableText.includes(searchTerm);


        return matchesCategory && matchesSearch;

    });


    displayPortfolioProjects(filteredProjects);

}


// INITIAL DISPLAY

displayPortfolioProjects(portfolioProjects);


// ============================================
// FUTURE FIREBASE INTEGRATION
// ============================================

/*
Later, we will connect this page to Firebase Firestore.

The admin dashboard will allow WMF to:

1. Add portfolio projects.
2. Upload project images.
3. Edit project descriptions.
4. Select project categories.
5. Add deliverables and project details.
6. Publish or hide projects.
7. Reorder portfolio projects.

Do not add private client files or images without permission.
*/
