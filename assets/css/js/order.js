// ======================================================
// WMF CLIENT ORDER PLACEMENT
// Firebase Authentication + Firestore
// ======================================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";


// ======================================================
// ELEMENTS
// ======================================================

const orderForm = document.getElementById("orderForm");

const orderMessage = document.getElementById("orderMessage");

const submitOrderButton =
    document.getElementById("submitOrderButton");

const clientName = document.getElementById("clientName");

const clientEmail = document.getElementById("clientEmail");

const serviceName = document.getElementById("serviceName");

const bookTitle = document.getElementById("bookTitle");

const bookGenre = document.getElementById("bookGenre");

const wordCount = document.getElementById("wordCount");

const projectDescription =
    document.getElementById("projectDescription");

const preferredDeadline =
    document.getElementById("preferredDeadline");

const additionalRequirements =
    document.getElementById("additionalRequirements");

const scopeAgreement =
    document.getElementById("scopeAgreement");


// ======================================================
// COPYRIGHT
// ======================================================

document.getElementById("currentYear").textContent =
    new Date().getFullYear();


// ======================================================
// MESSAGE
// ======================================================

function showMessage(message, type = "error") {

    orderMessage.textContent = message;

    orderMessage.className = `order-message ${type}`;

    orderMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ======================================================
// AUTHENTICATION
// ======================================================

let authenticatedUser = null;

let authenticationReady = false;

onAuthStateChanged(auth, (user) => {

    authenticationReady = true;

    if (!user || !user.emailVerified) {

        authenticatedUser = null;

        window.location.replace("author-centre.html");

        return;

    }

    authenticatedUser = user;

    clientEmail.value = user.email || "";

    clientName.value = user.displayName || "";

});


// ======================================================
// SUBMIT ORDER REQUEST
// ======================================================

orderForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    orderMessage.className = "order-message";

    if (!authenticationReady || !authenticatedUser) {

        showMessage(
            "Please sign in with your verified WMF account before submitting an order."
        );

        return;

    }


    // --------------------------------------------------
    // GET FORM VALUES
    // --------------------------------------------------

    const name = clientName.value.trim();

    const selectedService = serviceName.value;

    const title = bookTitle.value.trim();

    const genre = bookGenre.value.trim();

    const description = projectDescription.value.trim();

    const deadline = preferredDeadline.value;

    const additional = additionalRequirements.value.trim();

    const words = wordCount.value === ""
        ? null
        : Number(wordCount.value);


    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!name || !selectedService || !title || !description) {

        showMessage("Please complete all required fields.");

        return;

    }

    if (name.length > 100 || title.length > 200) {

        showMessage("One or more fields exceed the permitted length.");

        return;

    }

    if (description.length > 5000 || additional.length > 3000) {

        showMessage("Your project description is too long.");

        return;

    }

    if (
        words !== null &&
        (!Number.isInteger(words) || words < 0 || words > 1000000)
    ) {

        showMessage("Please enter a valid word count.");

        return;

    }

    if (!scopeAgreement.checked) {

        showMessage(
            "Please confirm that you understand the order review process."
        );

        return;

    }


    // --------------------------------------------------
    // PREVENT PAST DEADLINES
    // --------------------------------------------------

    if (deadline) {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(`${deadline}T00:00:00`);

        if (selectedDate < today) {

            showMessage(
                "Please select today or a future preferred completion date."
            );

            return;

        }

    }


    // --------------------------------------------------
    // PREPARE ORDER REQUEST
    // --------------------------------------------------

    const orderRequest = {

        ownerUid: authenticatedUser.uid,

        fullName: name,

        email: authenticatedUser.email,

        serviceName: selectedService,

        bookTitle: title,

        bookGenre: genre,

        wordCount: words,

        projectDescription: description,

        preferredDeadline: deadline,

        additionalRequirements: additional,

        status: "submitted",

        paymentStatus: "unpaid",

        createdAt: serverTimestamp()

    };


    // --------------------------------------------------
    // SUBMIT TO FIRESTORE
    // --------------------------------------------------

    try {

        submitOrderButton.disabled = true;

        submitOrderButton.textContent = "Submitting Request...";


        const requestReference = await addDoc(
            collection(db, "orderRequests"),
            orderRequest
        );


        orderForm.reset();

        clientEmail.value = authenticatedUser.email || "";

        clientName.value = authenticatedUser.displayName || name;


        showMessage(
            `Your order request has been submitted successfully. Reference: ${requestReference.id}. WMF will review your requirements before confirming the project scope and payment instructions.`,
            "success"
        );


        console.log(
            "WMF order request submitted:",
            requestReference.id
        );


    } catch (error) {

        console.error("Order submission error:", error);

        if (error.code === "permission-denied") {

            showMessage(
                "Your request was blocked by Firestore security rules. Please contact WMF support or check the orderRequests rules."
            );

        } else {

            showMessage(
                "We could not submit your request. Please check your internet connection and try again."
            );

        }

    } finally {

        submitOrderButton.disabled = false;

        submitOrderButton.textContent = "Submit Order Request";

    }

});
