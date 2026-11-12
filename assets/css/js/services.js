// WMF SERVICES PAGE JAVASCRIPT

document.addEventListener("DOMContentLoaded", () => {

    // COPYRIGHT YEAR

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // SERVICE DATABASE
    // These are display records, not confirmed prices.

    const services = [

        {
            id: "book-trailer",
            name: "Book Trailer Video",
            category: "book",
            categoryName: "Book Services",
            icon: "▶",
            description:
                "Turn your book into a cinematic promotional experience with a trailer designed to introduce its atmosphere, characters and central story.",
            delivery: "Confirmed after package selection"
        },

        {
            id: "animated-book-series",
            name: "Animated Book Series",
            category: "book",
            categoryName: "Book Services",
            icon: "🎬",
            description:
                "Bring your book world to life through a planned series of animated promotional videos or story-led episodes.",
            delivery: "Based on agreed project scope"
        },

        {
            id: "proofreading-editing",
            name: "Proofreading & Editing",
            category: "book",
            categoryName: "Book Services",
            icon: "✍",
            description:
                "Prepare your manuscript for readers with careful proofreading and editing focused on grammar, spelling, punctuation, consistency and readability.",
            delivery: "Confirmed after manuscript assessment"
        },

        {
            id: "publishing-package",
            name: "Publishing Full Package",
            category: "book",
            categoryName: "Book Services",
            icon: "📚",
            description:
                "Get coordinated support for preparing your book for publication. Exact package inclusions will be clearly listed before checkout.",
            delivery: "Based on agreed package scope"
        },

        {
            id: "book-design",
            name: "Book Cover & Interior Design",
            category: "design",
            categoryName: "Creative Design",
            icon: "🎨",
            description:
                "Present your story professionally with book cover concepts, interior layout and formatting support.",
            delivery: "Confirmed after package selection"
        },

        {
            id: "amazon-optimization",
            name: "Amazon Optimization & A+ Content",
            category: "book",
            categoryName: "Book Services",
            icon: "📖",
            description:
                "Improve the presentation of your book listing with metadata support, keyword research and enhanced A+ content design where eligible.",
            delivery: "Confirmed after package selection"
        },

        {
            id: "book-marketing",
            name: "Book Marketing & Promotion",
            category: "marketing",
            categoryName: "Digital Marketing",
            icon: "📢",
            description:
                "Explore promotional support such as social media creative, Goodreads campaign support, YouTube promotion and Meta advertising management.",
            delivery: "Based on campaign scope"
        },

        {
            id: "graphic-design",
            name: "Graphic Design",
            category: "design",
            categoryName: "Creative Design",
            icon: "🖌",
            description:
                "Professional visual design solutions for brands, businesses, promotional materials and digital platforms.",
            delivery: "Confirmed after project requirements"
        },

        {
            id: "website-design",
            name: "Website Design & Development",
            category: "web",
            categoryName: "Websites",
            icon: "💻",
            description:
                "Build a professional online presence with responsive website design and development tailored to your business.",
            delivery: "Based on website scope"
        },

        {
            id: "seo",
            name: "Website SEO",
            category: "web",
            categoryName: "Websites",
            icon: "🔎",
            description:
                "Improve website structure, search visibility and technical foundations through search engine optimization support.",
            delivery: "Based on agreed SEO scope"
        },

        {
            id: "social-media",
            name: "Social Media Marketing",
            category: "marketing",
            categoryName: "Digital Marketing",
            icon: "📱",
            description:
                "Strengthen your online presence through social media creative, campaign planning and promotional support.",
            delivery: "Based on campaign scope"
        }

    ];


    // ELEMENTS

    const servicesGrid = document.getElementById("servicesGrid");

    const searchInput = document.getElementById("serviceSearch");

    const searchButton = document.getElementById("searchButton");

    const filterButtons = document.querySelectorAll(".filter-btn");

    const noResults = document.getElementById("noResults");


    // CURRENT FILTER

    let activeCategory = "all";


    // DISPLAY SERVICES

    function displayServices() {

        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        const filteredServices = services.filter(service => {

            const matchesCategory =
                activeCategory === "all" ||
                service.category === activeCategory;

            const matchesSearch =
                service.name.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.categoryName.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesSearch;

        });


        servicesGrid.innerHTML = "";


        if (filteredServices.length === 0) {

            noResults.style.display = "block";

            return;

        }

        noResults.style.display = "none";


        filteredServices.forEach(service => {

            const card = document.createElement("article");

            card.className = "service-card";


            card.innerHTML = `

                <div class="service-image">

                    ${service.icon}

                </div>


                <div class="service-content">

                    <span class="service-category">

                        ${service.categoryName}

                    </span>


                    <h3>

                        ${service.name}

                    </h3>


                    <p>

                        ${service.description}

                    </p>


                    <div class="service-meta">

                        <p>
                            <strong>Pricing:</strong>
                            Confirmed in selected package
                        </p>

                        <p>
                            <strong>Delivery:</strong>
                            ${service.delivery}
                        </p>

                    </div>


                    <div class="service-actions">

                        <a href="service-details.html?service=${encodeURIComponent(service.id)}">

                            VIEW DETAILS

                        </a>


                        <a class="order-btn"
                           href="order.html?service=${encodeURIComponent(service.id)}">

                            ORDER NOW

                        </a>

                    </div>

                </div>

            `;


            servicesGrid.appendChild(card);

        });

    }


    // CATEGORY FILTERS

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            activeCategory = button.dataset.category;


            displayServices();

        });

    });


    // SEARCH

    searchButton.addEventListener("click", displayServices);


    searchInput.addEventListener("input", displayServices);


    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            displayServices();

        }

    });


    // INITIAL LOAD

    displayServices();


    // MOBILE NAVIGATION

    const navigation = document.querySelector(".navigation");

    const header = document.querySelector(".header");

    if (navigation && header) {

        const menuButton = document.createElement("button");

        menuButton.className = "mobile-menu-button";

        menuButton.textContent = "☰";

        menuButton.setAttribute("aria-label", "Open navigation menu");

        menuButton.setAttribute("aria-expanded", "false");

        header.appendChild(menuButton);


        menuButton.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("active");

            menuButton.setAttribute("aria-expanded", isOpen);

            menuButton.textContent = isOpen ? "✕" : "☰";

        });

    }

});
