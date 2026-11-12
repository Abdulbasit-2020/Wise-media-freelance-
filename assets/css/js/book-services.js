// WMF BOOK SERVICES JAVASCRIPT

document.addEventListener("DOMContentLoaded", () => {

    // COPYRIGHT YEAR

    const year = document.getElementById("current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    // BOOK SERVICES DATA

    const bookServices = [

        {
            id: "book-trailer",
            name: "Book Trailer Video",
            category: "promotion",
            categoryName: "Book Promotion",
            icon: "🎬",

            description:
                "Turn your book into a cinematic promotional experience with a trailer designed to introduce its atmosphere, characters and central story.",

            detailsLink: "book-trailer-details.html",
            orderText: "ORDER BOOK TRAILER"
        },


        {
            id: "animated-series",
            name: "Animated Book Series",
            category: "promotion",
            categoryName: "Book Promotion",
            icon: "🎥",

            description:
                "Bring your book world to life through a planned series of animated promotional videos or story-led episodes. Scope, style, episode count and delivery schedule must be agreed in the selected package.",

            detailsLink: "animated-series-details.html",
            orderText: "ORDER ANIMATED SERIES"
        },


        {
            id: "proofreading",
            name: "Proofreading & Editing",
            category: "editing",
            categoryName: "Editing",
            icon: "✍️",

            description:
                "Prepare your manuscript for readers with careful proofreading and editing focused on grammar, spelling, punctuation, consistency and readability.",

            detailsLink: "proofreading-details.html",
            orderText: "SUBMIT MANUSCRIPT"
        },


        {
            id: "publishing-package",
            name: "Publishing Full Package",
            category: "publishing",
            categoryName: "Publishing",
            icon: "📚",

            description:
                "Get coordinated support for preparing your book for publication, including agreed manuscript preparation, formatting, cover coordination and publishing guidance.",

            detailsLink: "publishing-details.html",
            orderText: "ORDER PUBLISHING PACKAGE"
        },


        {
            id: "book-design",
            name: "Book Cover & Interior Design",
            category: "design",
            categoryName: "Book Design",
            icon: "🎨",

            description:
                "Present your story professionally with book cover concepts, interior layout and formatting support.",

            detailsLink: "book-design-details.html",
            orderText: "ORDER BOOK DESIGN"
        },


        {
            id: "amazon-optimization",
            name: "Amazon Optimization & A+ Content",
            category: "marketing",
            categoryName: "Amazon Support",
            icon: "📖",

            description:
                "Improve the presentation of your book listing with metadata support, keyword research and enhanced A+ content design where eligible.",

            detailsLink: "amazon-optimization-details.html",
            orderText: "ORDER AMAZON OPTIMIZATION"
        },


        {
            id: "book-marketing",
            name: "Book Marketing & Promotion",
            category: "marketing",
            categoryName: "Book Marketing",
            icon: "📢",

            description:
                "Explore promotional support such as social media creative, Goodreads campaign support, YouTube promotion and Meta advertising management. Advertising spend is separate from WMF service fees.",

            detailsLink: "book-marketing-details.html",
            orderText: "ORDER BOOK PROMOTION"
        }

    ];


    // ELEMENTS

    const grid = document.getElementById("bookServiceGrid");

    const filterButtons =
        document.querySelectorAll(".book-filter");

    const emptyMessage =
        document.getElementById("bookEmpty");


    // CURRENT FILTER

    let currentCategory = "all";


    // DISPLAY SERVICES

    function renderBookServices() {

        const filtered = bookServices.filter(service => {

            return currentCategory === "all" ||
                   service.category === currentCategory;

        });


        grid.innerHTML = "";


        if (filtered.length === 0) {

            emptyMessage.style.display = "block";

            return;

        }


        emptyMessage.style.display = "none";


        filtered.forEach(service => {

            const card = document.createElement("article");

            card.className = "book-service-card";


            card.innerHTML = `

                <div class="book-service-icon">

                    ${service.icon}

                </div>


                <div class="book-service-content">

                    <span class="category">

                        ${service.categoryName}

                    </span>


                    <h3>

                        ${service.name}

                    </h3>


                    <p>

                        ${service.description}

                    </p>


                    <div class="book-service-actions">

                        <a href="${service.detailsLink}">

                            VIEW DETAILS

                        </a>


                        <a class="primary"
                           href="order.html?service=${encodeURIComponent(service.id)}">

                            ${service.orderText}

                        </a>

                    </div>

                </div>

            `;


            grid.appendChild(card);

        });

    }


    // FILTER BUTTONS

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");


            currentCategory = button.dataset.category;


            renderBookServices();

        });

    });


    // OTHER AUTHOR SERVICES

    const otherButton =
        document.getElementById("otherServicesButton");

    const otherContent =
        document.getElementById("otherServicesContent");


    otherButton.addEventListener("click", () => {

        const isHidden = otherContent.hidden;

        otherContent.hidden = !isHidden;

        otherButton.textContent = isHidden
            ? "SHOW LESS"
            : "EXPLORE OTHER SERVICES";

    });


    // INITIAL LOAD

    renderBookServices();


    // MOBILE NAVIGATION

    const navigation =
        document.querySelector(".navigation");

    const header =
        document.querySelector(".header");


    if (navigation && header) {

        const menuButton = document.createElement("button");

        menuButton.className = "mobile-menu-button";

        menuButton.textContent = "☰";

        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        header.appendChild(menuButton);


        menuButton.addEventListener("click", () => {

            const isOpen =
                navigation.classList.toggle("active");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.textContent =
                isOpen ? "✕" : "☰";

        });


        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navigation.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.textContent = "☰";

            });

        });

    }

});
