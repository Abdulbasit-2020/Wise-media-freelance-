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

const ordersContainer =
    document.getElementById("ordersContainer");

const progressContainer =
    document.getElementById("progressContainer");

const invoicesContainer =
    document.getElementById("invoicesContainer");

const documentsContainer =
    document.getElementById("documentsContainer");

const updatesContainer =
    document.getElementById("updatesContainer");

const dashboardMessage =
    document.getElementById("dashboardMessage");

const logoutButton =
    document.getElementById("logoutButton");


// ============================================
// COPYRIGHT
// ============================================

document.getElementById("currentYear").textContent =
    new Date().getFullYear();


// ============================================
// DISPLAY MESSAGE
// ============================================

function showDashboardMessage(message, type = "info") {

    dashboardMessage.textContent = message;

    dashboardMessage.className =
        `dashboard-message ${type}`;

}


// ============================================
// SAFE TEXT CREATION
// ============================================

function addText(parent, tag, text, className = "") {

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

    if (value.toDate) {
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
// SAFE DOCUMENT LINK
// ============================================

function addDocumentLink(parent, url) {

    if (
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
// EMPTY STATE
// ============================================

function showEmptyState(container, message) {

    container.replaceChildren();

    const empty = document.createElement("div");

    empty.className = "empty-state";

    empty.textContent = message;

    container.appendChild(empty);

}


// ============================================
// ERROR STATE
// ============================================

function showSectionError(container, message) {

    showEmptyState(container, message);

}


// ============================================
// CREATE RECORD CARD
// ============================================

function createRecordCard(title, data) {

    const card = document.createElement("article");

    card.className = "record-card";

    addText(card, "h3", title);

    return card;

}


// ============================================
// LOAD AUTHOR PROFILE
// ============================================


// ============================================
// LOAD AUTHOR PROFILE
// ============================================

async function loadAuthorProfile(user) {

    // Display the authenticated email immediately.
    authorEmail.textContent = user.email || "Email unavailable";

    // Display a temporary name while retrieving the profile.
    authorName.textContent = user.displayName || "Author";

    try {

        const profileRef = doc(db, "users", user.uid);

        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {

            const profile = profileSnapshot.data();

            authorName.textContent =
                profile.displayName ||
                user.displayName ||
                "Author";

            // Use the authenticated email as the reliable source.
            authorEmail.textContent =
                user.email || profile.email || "Email unavailable";

        } else {

            console.warn("Author profile document does not exist.");

            authorEmail.textContent =
                user.email || "Email unavailable";

        }

    } catch (error) {
            alert(
  "Profile Error Code: " + (error.code || "Unknown") +
  "\nError Details: " + (error.message || "No details available")
);
        

        // Authentication can still provide the email.
        authorEmail.textContent =
            user.email || "Email unavailable";

        authorName.textContent =
            user.displayName || "Author";

        showDashboardMessage(
            "Your account is authenticated, but your profile information could not be retrieved.",
            "error"
        );

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

        document.getElementById("ordersCount").textContent =
            snapshot.size;

        ordersContainer.replaceChildren();

        if (snapshot.empty) {

            showEmptyState(
                ordersContainer,
                "You don't have any orders yet. Your WMF orders will appear here."
            );

            showEmptyState(
                progressContainer,
                "Your project progress will appear here when a project is assigned."
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
                data.serviceName || data.title || "WMF Service Order",
                data
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

        showSectionError(
            progressContainer,
            "Project progress could not be loaded."
        );

        document.getElementById("ordersCount").textContent = "—";

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
                data.invoiceNumber || "WMF Invoice",
                data
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

        documentsContainer.replaceChildren();

        document.getElementById("documentsCount").textContent =
            snapshot.size;

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
                data.fileName || data.name || "Client Document",
                data
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

        document.getElementById("documentsCount").textContent = "—";

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

        updatesContainer.replaceChildren();

        document.getElementById("updatesCount").textContent =
            snapshot.size;

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
                data.title || "Project Update",
                data
            );

            addText(
                card,
                "p",
                data.message || data.description || "No update details provided."
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

        document.getElementById("updatesCount").textContent = "—";

        showSectionError(
            updatesContainer,
            "Unable to load project updates."
        );

    }

}


// ============================================
// LOAD PROJECT PROGRESS
// ============================================

function displayProjectProgress(orders) {

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
            order.serviceName || order.title || "Project",
            order
        );

        addText(
            card,
            "p",
            `Current Status: ${order.projectStatus || order.status || "Awaiting update"}`
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

logoutButton.addEventListener("click", async () => {

    logoutButton.disabled = true;

    try {

        await signOut(auth);

        window.location.replace("author-centre.html");

    } catch (error) {

        console.error("Logout error:", error);

        showDashboardMessage(
            "Unable to sign out. Please try again.",
            "error"
        );

        logoutButton.disabled = false;

    }

});


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

    try {

        showDashboardMessage(
            "Your secure author account is being loaded."
        );

        await loadAuthorProfile(user);

        const orders = await loadOrders(user);

        displayProjectProgress(orders);

        await Promise.all([
            loadInvoices(user),
            loadDocuments(user),
            loadProjectUpdates(user)
        ]);

        dashboardMessage.style.display = "none";

    } catch (error) {

        console.error("Dashboard loading error:", error);

        showDashboardMessage(
            error.message || "Unable to load your dashboard.",
            "error"
        );

    }

});


console.log("WMF Author Dashboard loaded.");
