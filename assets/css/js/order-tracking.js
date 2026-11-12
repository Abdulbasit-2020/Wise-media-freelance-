// ==========================================
// WMF ORDER TRACKING PAGE
// ==========================================


// MOBILE NAVIGATION

const mobileMenuButton = document.getElementById("mobileMenuButton");

const mainNavigation = document.getElementById("mainNavigation");


if (mobileMenuButton && mainNavigation) {

    mobileMenuButton.addEventListener("click", () => {

        const isActive = mainNavigation.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            isActive ? "true" : "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            isActive ? "Close navigation" : "Open navigation"
        );

        mobileMenuButton.textContent = isActive ? "✕" : "☰";

    });


    // CLOSE MENU WHEN A LINK IS CLICKED

    const navigationLinks = mainNavigation.querySelectorAll("a");

    navigationLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNavigation.classList.remove("active");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Open navigation"
            );

            mobileMenuButton.textContent = "☰";

        });

    });

}


// COPYRIGHT YEAR

const currentYear = document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


// ORDER TRACKING FORM

const trackingForm = document.getElementById("trackingForm");

const orderReference = document.getElementById("orderReference");

const trackingMessage = document.getElementById("trackingMessage");


if (trackingForm && orderReference && trackingMessage) {

    trackingForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const reference = orderReference.value.trim();


        // CHECK EMPTY INPUT

        if (!reference) {

            trackingMessage.className = "tracking-message error";

            trackingMessage.textContent =
                "Please enter your order reference.";

            return;

        }


        // LIVE TRACKING IS NOT CONNECTED YET

        trackingMessage.className = "tracking-message info";

        trackingMessage.textContent =
            "Thank you. The live tracking system is not connected yet, " +
            "so your order cannot currently be checked here. " +
            "Please contact WMF through the Contact page for an update.";


        console.log(
            "Order tracking requested. Reference:",
            reference
        );

    });

}


// ==========================================
// END OF ORDER TRACKING JAVASCRIPT
// ==========================================
