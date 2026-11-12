
/* =====================================
   WMF HOMEPAGE JAVASCRIPT
===================================== */


/* =====================================
   MOBILE NAVIGATION
===================================== */

const menuToggle = document.getElementById("menuToggle");

const navigation = document.getElementById("navigation");


menuToggle.addEventListener("click", function () {

    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});


/* CLOSE MOBILE MENU AFTER CLICKING */

navigation.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

        navigation.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");

    });

});



/* =====================================
   HERO SLIDESHOW
===================================== */


const slides = [

    {

        label: "WISE MEDIA FREELANCE",

        title: "Transforming Ideas Into <em>Powerful Digital Experiences.</em>",

        description: "At Wise Media Freelance, we help authors, entrepreneurs and businesses bring their ideas to life through creative design, digital marketing, publishing support and professional web solutions.",

        primaryText: "EXPLORE OUR SERVICES",

        primaryLink: "services.html",

        secondaryText: "VIEW OUR PORTFOLIO",

        secondaryLink: "portfolio.html",

        background: "linear-gradient(110deg, #080B16, #172544)"

    },


    {

        label: "FOR AUTHORS AND PUBLISHERS",

        title: "Your Story Deserves to Be <em>Seen, Heard and Remembered.</em>",

        description: "From cinematic book trailers and animated book content to proofreading, publishing support and promotional campaigns, we help authors present their books professionally and reach more readers.",

        primaryText: "EXPLORE BOOK SERVICES",

        primaryLink: "book-services.html",

        secondaryText: "ORDER A BOOK SERVICE",

        secondaryLink: "book-services.html",

        background: "linear-gradient(110deg, #11101C, #45354C)"

    },


    {

        label: "BUSINESS AND DIGITAL SOLUTIONS",

        title: "Build Your Brand. <em>Strengthen Your Presence. Grow Your Business.</em>",

        description: "Discover creative and digital solutions designed to help businesses establish their online presence, communicate their value and connect with their audience.",

        primaryText: "DISCOVER OUR SERVICES",

        primaryLink: "services.html",

        secondaryText: "GET STARTED",

        secondaryLink: "book-services.html",

        background: "linear-gradient(110deg, #071A1B, #234B49)"

    }

];



let currentSlide = 0;

let slideTimer = null;

let isPaused = false;



const hero = document.getElementById("hero");

const heroLabel = document.getElementById("heroLabel");

const heroTitle = document.getElementById("heroTitle");

const heroDescription = document.getElementById("heroDescription");

const primaryButton = document.getElementById("primaryButton");

const secondaryButton = document.getElementById("secondaryButton");

const slideNumber = document.getElementById("slideNumber");

const indicators = document.querySelectorAll(".indicator");



/* DISPLAY SLIDE */

function showSlide(index) {

    currentSlide = (index + slides.length) % slides.length;

    const slide = slides[currentSlide];


    hero.classList.add("changing");


    setTimeout(function () {

        heroLabel.textContent = slide.label;

        heroTitle.innerHTML = slide.title;

        heroDescription.textContent = slide.description;


        primaryButton.innerHTML =
            slide.primaryText + " <span>↗</span>";

        primaryButton.href = slide.primaryLink;


        secondaryButton.textContent =
            slide.secondaryText;

        secondaryButton.href =
            slide.secondaryLink;


        hero.style.background = slide.background;


        slideNumber.innerHTML =
            "0" + (currentSlide + 1) + " <i>/</i> 03";


        indicators.forEach(function (indicator, i) {

            indicator.classList.toggle(
                "active",
                i === currentSlide
            );

            indicator.setAttribute(
                "aria-current",
                i === currentSlide ? "true" : "false"
            );

        });


        hero.classList.remove("changing");

    }, 180);

}



/* NEXT SLIDE */

function nextSlide() {

    showSlide(currentSlide + 1);

}



/* PREVIOUS SLIDE */

function previousSlide() {

    showSlide(currentSlide - 1);

}



/* AUTOMATIC SLIDESHOW */

function startSlideshow() {

    stopSlideshow();

    slideTimer = setInterval(function () {

        if (!isPaused) {

            nextSlide();

        }

    }, 5000);

}



/* STOP SLIDESHOW */

function stopSlideshow() {

    if (slideTimer) {

        clearInterval(slideTimer);

        slideTimer = null;

    }

}



/* NEXT AND PREVIOUS BUTTONS */

document.getElementById("nextSlide").addEventListener(
    "click",
    function () {

        nextSlide();

        startSlideshow();

    }
);


document.getElementById("previousSlide").addEventListener(
    "click",
    function () {

        previousSlide();

        startSlideshow();

    }
);



/* INDICATOR BUTTONS */

indicators.forEach(function (indicator, index) {

    indicator.addEventListener("click", function () {

        showSlide(index);

        startSlideshow();

    });

});



/* PAUSE WHEN INTERACTING */

hero.addEventListener("mouseenter", function () {

    isPaused = true;

});


hero.addEventListener("mouseleave", function () {

    isPaused = false;

});


hero.addEventListener("focusin", function () {

    isPaused = true;

});


hero.addEventListener("focusout", function () {

    isPaused = false;

});



/* MOBILE SWIPE SUPPORT */

let touchStartX = 0;

let touchEndX = 0;


hero.addEventListener("touchstart", function (event) {

    touchStartX = event.changedTouches[0].screenX;

}, { passive: true });


hero.addEventListener("touchend", function (event) {

    touchEndX = event.changedTouches[0].screenX;

    const difference = touchStartX - touchEndX;


    if (Math.abs(difference) > 50) {

        if (difference > 0) {

            nextSlide();

        } else {

            previousSlide();

        }

        startSlideshow();

    }

}, { passive: true });



/* START THE SLIDESHOW */

showSlide(0);

startSlideshow();



/* =====================================
   AUTOMATIC COPYRIGHT YEAR
===================================== */

document.getElementById("currentYear").textContent =
    new Date().getFullYear();
