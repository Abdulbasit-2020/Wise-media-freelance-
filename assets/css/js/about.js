// WMF ABOUT PAGE JAVASCRIPT

document.addEventListener("DOMContentLoaded", () => {

    // Automatic copyright year

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // Mobile navigation

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


        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navigation.classList.remove("active");

                menuButton.setAttribute("aria-expanded", "false");

                menuButton.textContent = "☰";

            });

        });

    }

});
