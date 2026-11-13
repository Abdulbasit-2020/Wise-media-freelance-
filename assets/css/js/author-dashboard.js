// ============================================
// WMF AUTHOR DASHBOARD
// Wise Media Freelance
// Firebase Authentication + Firestore
// ============================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";


// ============================================
// ELEMENTS
// ============================================

const authorName = document.getElementById("authorName");
const authorEmail = document.getElementById("authorEmail");

const ordersContainer = document.getElementById("ordersContainer");
const progressContainer = document.getElementById("progressContainer");
const invoicesContainer = document.getElementById("invoicesContainer");
const documentsContainer = document.getElementById("documentsContainer");
const updatesContainer = document.getElementById("updatesContainer");

const dashboardMessage = document.getElementById("dashboardMessage");
const logoutButton = document.getElementById("logoutButton");

const currentYear = document.getElementById("currentYear");


// ============================================
// COPYRIGHT
// ============================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// ============================================
// DISPLAY MESSAGE
// ============================================

function showDashboardMessage(message, type = "info") {

    if (!dashboardMessage) return;

    dashboardMessage.textContent = message;

    dashboardMessage.className =
        `dashboard-message ${type}`;

    dashboardMessage.style.display = "block";
}


// ============================================
// SAFE TEXT CREATION
// ============================================

function addText(parent, tag, text, className = "") {

    if (!parent) return null;

    const element = document.createElement(tag);

    element.textContent = text ?? "Not provided";

    if (className) {
        element.className = className;
    }

    parent.appendChild(element);

    return element;
}


// ============================================
// DATE FORMAT
// ============================================

function formatDate(value) {

    if (!value) return "Not provided";

    let date;

    if (typeof value.toDate === "function") {
        date = value.toDate();
    } else {
        date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
        return "Not provided";
    }

    return date.toLocaleDateString();
}


// ============================================
// EMPTY STATE
// ============================================

function showEmptyState(container, message) {

    if (!container) return;

    container.replaceChildren();

    const empty = document.createElement("div");

    empty.className = "empty-state";
    empty.textContent = message;

    container.appendChild(empty);
}


// ============================================
// SECTION ERROR
// ============================================

function showSectionError(container, message) {

    showEmptyState(container, message);
}


// ============================================
// DOCUMENT LINK
// ============================================

function addDocumentLink(parent, url) {

    if (
        !parent ||
        typeof url !== "string" ||
        !url.startsWith("https://")
    ) {
        return;
    }

    const link = document.createElement("a");

    link.href = url;
    link.textContent = "Open Document";
    link.className = "document-link";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    parent.appendChild(link);
}


// ============================================
// CREATE RECORD CARD
// ============================================

function createRecordCard(title) {

    const card = document.createElement("article");

    card.className = "record-card";

    addText(card, "h3", title);

    return card;
}


// ============================================
// LOAD AUTHOR PROFILE
// ============================================

async function loadAuthorProfile(user) {

    // Display authenticated information immediately.

    if (authorEmail) {
        authorEmail.textContent =
            user.email || "Email unavailable";
    }

    if (authorName) {
        authorName.textContent =
            user.displayName || "Author";
    }

    try {

        // Reference the user's Firestore document.

        const profileRef = doc(
            db,
            "users",
            user.uid
        );

        // Retrieve profile.

        const profileSnapshot = await getDoc(profileRef);

        // Check whether document exists.

        if (!profileSnapshot.exists()) {

            console.warn(
                "Author profile document not found:",
                user.uid
            );

            showDashboardMessage(
                "Your account is active, but your Firestore profile document could not be found.",
                "error"
            );

            return false;
        }

        // Get profile information.

        const profile = profileSnapshot.data();

        console.log(
            "WMF PROFILE SUCCESS:",
            profile
        );

        // Display name.

        if (authorName) {

            authorName.textContent =
                profile.displayName ||
                user.displayName ||
                "Author";
        }

        // Display authenticated email.

        if (authorEmail) {

            authorEmail.textContent =
                user.email ||
                profile.email ||
                "Email unavailable";
        }

        return true;

    } catch (error) {

        console.error(
            "PROFILE FIRESTORE ERROR:",
            error
        );

        if (authorName) {
            authorName.textContent =
                user.displayName || "Author";
        }

        if (authorEmail) {
            authorEmail.textContent =
                user.email || "Email unavailable";
        }

        // Display the actual Firebase error.

        showDashboardMessage(
            "Profile Error Code: " +
            (error.code || "Unknown") +
            " | Details: " +
            (error.message || "No details available."),
            "error"
        );

        return false;
    }
}


// ============================================
// LOAD ORDERS
// ============================================

async function loadOrders(user) {

    try {

        const ordersQuery = query(
            collection(db, "orders"),
            where("ownerUid", "==", user.uid)
        );

        const snapshot = await getDocs(ordersQuery);

        const count = document.getElementById("ordersCount");

        if (count) {
            count.textContent = snapshot.size;
        }

        if (!ordersContainer) return [];

        ordersContainer.replaceChildren();

        if (snapshot.empty) {

            showEmptyState(
                ordersContainer,
                "You don't have any orders yet. Your WMF orders will appear here."
            );

            return [];
        }

        const orders = [];

        snapshot.forEach(documentSnapshot => {

            const data = documentSnapshot.data();

            orders.push({
                id: documentSnapshot.id,
                ...data
            });

            const card = createRecordCard(
                data.serviceName ||
                data.title ||
                "WMF Service Order"
            );

            addText(
                card,
                "p",
                `Order Reference: ${documentSnapshot.id}`
            );

            addText(
                card,
                "p",
                `Status: ${data.status || "Awaiting update"}`
            );

            addText(
                card,
                "p",
                `Payment: ${data.paymentStatus || "Awaiting confirmation"}`
            );

            addText(
                card,
                "p",
                `Date: ${formatDate(data.createdAt)}`
            );

            ordersContainer.appendChild(card);
        });

        return orders;

    } catch (error) {

        console.error("Orders error:", error);

        showSectionError(
            ordersContainer,
            "Unable to load your orders. Please try again later."
        );

        const count = document.getElementById("ordersCount");

        if (count) count.textContent = "—";

        return [];
    }
}


// ============================================
// LOAD INVOICES
// ============================================

async function loadInvoices(user) {

    try {

        const invoicesQuery = query(
            collection(db, "invoices"),
            where("ownerUid", "==", user.uid)
        );

        const snapshot = await getDocs(invoicesQuery);

        if (!invoicesContainer) return;

        invoicesContainer.replaceChildren();

        if (snapshot.empty) {

            showEmptyState(
                invoicesContainer,
                "You don't have any invoices yet."
            );

            return;
        }

        snapshot.forEach(documentSnapshot => {

            const data = documentSnapshot.data();

            const card = createRecordCard(
                data.invoiceNumber || "WMF Invoice"
            );

            addText(
                card,
                "p",
                `Invoice Reference: ${documentSnapshot.id}`
            );

            addText(
                card,
                "p",
                `Amount: ${data.currency || ""} ${data.amount ?? "Not provided"}`
            );

            addText(
                card,
                "p",
                `Payment Status: ${data.paymentStatus || "Awaiting confirmation"}`
            );

            addText(
                card,
                "p",
                `Invoice Date: ${formatDate(data.createdAt)}`
            );

            if (data.invoiceUrl) {
                addDocumentLink(card, data.invoiceUrl);
            }

            invoicesContainer.appendChild(card);
        });

    } catch (error) {

        console.error("Invoice error:", error);

        showSectionError(
            invoicesContainer,
            "Unable to load invoices."
        );
    }
}


// ============================================
// LOAD DOCUMENTS
// ============================================

async function loadDocuments(user) {

    try {

        const documentsQuery = query(
            collection(db, "documents"),
            where("ownerUid", "==", user.uid)
        );

        const snapshot = await getDocs(documentsQuery);

        const count = document.getElementById("documentsCount");

        if (count) {
            count.textContent = snapshot.size;
        }

        if (!documentsContainer) return;

        documentsContainer.replaceChildren();

        if (snapshot.empty) {

            showEmptyState(
                documentsContainer,
                "Your uploaded and shared documents will appear here."
            );

            return;
        }

        snapshot.forEach(documentSnapshot => {

            const data = documentSnapshot.data();

            const card = createRecordCard(
                data.fileName ||
                data.name ||
                "Client Document"
            );

            addText(
                card,
                "p",
                `Document Type: ${data.documentType || "Not specified"}`
            );

            addText(
                card,
                "p",
                `Date: ${formatDate(data.createdAt)}`
            );

            addDocumentLink(
                card,
                data.downloadUrl || data.fileUrl
            );

            documentsContainer.appendChild(card);
        });

    } catch (error) {

        console.error("Document error:", error);

        const count = document.getElementById("documentsCount");

        if (count) count.textContent = "—";

        showSectionError(
            documentsContainer,
            "Unable to load your documents."
        );
    }
}


// ============================================
// LOAD PROJECT UPDATES
// ============================================

async function loadProjectUpdates(user) {

    try {

        const updatesQuery = query(
            collection(db, "projectUpdates"),
            where("ownerUid", "==", user.uid)
        );

        const snapshot = await getDocs(updatesQuery);

        const count = document.getElementById("updatesCount");

        if (count) {
            count.textContent = snapshot.size;
        }

        if (!updatesContainer) return;

        updatesContainer.replaceChildren();

        if (snapshot.empty) {

            showEmptyState(
                updatesContainer,
                "You don't have any project updates yet."
            );

            return;
        }

        snapshot.forEach(documentSnapshot => {

            const data = documentSnapshot.data();

            const card = createRecordCard(
                data.title || "Project Update"
            );

            addText(
                card,
                "p",
                data.message ||
                data.description ||
                "No update details provided."
            );

            addText(
                card,
                "p",
                `Date: ${formatDate(data.createdAt)}`
            );

            updatesContainer.appendChild(card);
        });

    } catch (error) {

        console.error("Project updates error:", error);

        const count = document.getElementById("updatesCount");

        if (count) count.textContent = "—";

        showSectionError(
            updatesContainer,
            "Unable to load project updates."
        );
    }
}


// ============================================
// DISPLAY PROJECT PROGRESS
// ============================================

function displayProjectProgress(orders) {

    if (!progressContainer) return;

    progressContainer.replaceChildren();

    if (!orders.length) {

        showEmptyState(
            progressContainer,
            "Your project progress will appear here when an order is assigned."
        );

        return;
    }

    orders.forEach(order => {

        const card = createRecordCard(
            order.serviceName ||
            order.title ||
            "Project"
        );

        addText(
            card,
            "p",
            `Current Status: ${
                order.projectStatus ||
                order.status ||
                "Awaiting update"
            }`
        );

        addText(
            card,
            "p",
            `Progress: ${
                typeof order.progress === "number"
                    ? `${order.progress}%`
                    : "Not yet provided"
            }`
        );

        progressContainer.appendChild(card);
    });
}


// ============================================
// LOGOUT
// ============================================

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        logoutButton.disabled = true;

        logoutButton.textContent = "Signing out...";

        try {

            await signOut(auth);

            window.location.href = "author-centre.html";

        } catch (error) {

            console.error("Logout error:", error);

            showDashboardMessage(
                "Unable to sign out. Please try again.",
                "error"
            );

            logoutButton.disabled = false;

            logoutButton.textContent = "Logout";
        }
    });
}


// ============================================
// AUTHENTICATION CHECK
// ============================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.replace("author-centre.html");

        return;
    }

    if (!user.emailVerified) {

        await signOut(auth);

        window.location.replace("author-centre.html");

        return;
    }

    showDashboardMessage(
        "Your secure author account is being loaded.",
        "info"
    );

    // Refresh authentication token.

    try {
        await user.getIdToken();
    } catch (error) {
        console.error("Authentication token error:", error);
    }

    // Load profile.

    const profileLoaded = await loadAuthorProfile(user);

    // Load orders.

    const orders = await loadOrders(user);

    // Display project progress.

    displayProjectProgress(orders);

    // Load remaining dashboard sections.

    await Promise.all([
        loadInvoices(user),
        loadDocuments(user),
        loadProjectUpdates(user)
    ]);

    // Hide loading message only when
    // profile retrieval succeeds.

    if (profileLoaded && dashboardMessage) {

        dashboardMessage.textContent = "";

        dashboardMessage.className = "dashboard-message";

        dashboardMessage.style.display = "none";
    }

});


console.log("WMF Author Dashboard loaded successfully.");
