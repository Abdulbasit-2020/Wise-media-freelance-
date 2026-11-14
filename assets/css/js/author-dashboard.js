// ========================================
// WMF AUTHOR DASHBOARD
// Wise Media Freelance
// ========================================

// FIREBASE IMPORTS
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
    getDocFromServer
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";


// ========================================
// DOM ELEMENT HELPER
// ========================================

function getElement(id) {
    return document.getElementById(id);
}


// ========================================
// DISPLAY MESSAGE
// ========================================

function showMessage(elementId, message) {
    const element = getElement(elementId);

    if (element) {
        element.textContent = message;
    }
}


// ========================================
// SAFE TEXT HELPER
// ========================================

function setText(elementId, value) {
    const element = getElement(elementId);

    if (element) {
        element.textContent =
            value !== undefined && value !== null && value !== ""
                ? value
                : "Not available";
    }
}


// ========================================
// DATE FORMATTER
// ========================================

function formatDate(value) {
    if (!value) return "Not available";

    let date;

    if (typeof value.toDate === "function") {
        date = value.toDate();
    } else {
        date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


// ========================================
// LOAD AUTHOR PROFILE
// ========================================

async function loadAuthorProfile(user) {

    console.log("================================");
    console.log("WMF AUTHOR PROFILE DIAGNOSTICS");
    console.log("================================");

    console.log("User UID:", user.uid);
    console.log("User Email:", user.email);
    console.log("Email Verified:", user.emailVerified);
    console.log("Browser Online:", navigator.onLine);
    console.log("Firebase Project:", db.app.options.projectId);
    console.log("Firebase App:", db.app.name);

    const profileRef = doc(db, "users", user.uid);

    console.log("Expected Firestore Path:", profileRef.path);

    try {

        // Force Firebase to refresh the user's authentication token.
        await user.getIdToken(true);

        console.log("Authentication token refreshed successfully.");

        // Read directly from the Firestore server.
        const profileSnapshot = await getDocFromServer(profileRef);

        console.log(
            "Firestore Profile Exists:",
            profileSnapshot.exists()
        );

        if (!profileSnapshot.exists()) {

            console.error(
                "PROFILE NOT FOUND:",
                profileRef.path
            );

            showMessage(
                "profile-message",
                "Your account is active, but your Firestore profile document could not be found. Please contact support."
            );

            return;
        }

        const profile = profileSnapshot.data();

        console.log("Firestore Profile Data:", profile);

        // Display profile information.
        setText(
            "author-name",
            profile.displayName || user.displayName || "Author"
        );

        setText(
            "author-email",
            profile.email || user.email
        );

        setText(
            "author-joined",
            formatDate(profile.createdAt)
        );

        showMessage(
            "profile-message",
            "Your profile loaded successfully."
        );

    } catch (error) {

        console.error("PROFILE LOADING ERROR");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);

        let message =
            "Unable to load your profile. Please try again.";

        if (error.code === "unavailable") {

            message =
                "Firestore is currently unavailable. Check your internet connection and try again.";

        } else if (error.code === "permission-denied") {

            message =
                "Firestore denied access to your profile. Please check your Firestore security rules.";

        } else if (error.code === "unauthenticated") {

            message =
                "Your session could not be authenticated. Please sign in again.";

        }

        showMessage("profile-message", message);
    }
}


// ========================================
// LOAD AUTHOR ORDERS
// ========================================

async function loadAuthorOrders(user) {

    const container = getElement("orders-list");

    try {

        const ordersRef = collection(db, "orders");

        const ordersQuery = query(
            ordersRef,
            where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(ordersQuery);

        if (!container) return;

        if (snapshot.empty) {

            container.textContent = "You have no orders yet.";

            return;
        }

        container.innerHTML = "";

        snapshot.forEach((orderDoc) => {

            const order = orderDoc.data();

            const item = document.createElement("div");

            item.className = "dashboard-item";

            const title = document.createElement("h4");
            title.textContent =
                order.serviceName || "Service Order";

            const status = document.createElement("p");
            status.textContent =
                "Status: " + (order.status || "Pending");

            const date = document.createElement("p");
            date.textContent =
                "Date: " + formatDate(order.createdAt);

            item.appendChild(title);
            item.appendChild(status);
            item.appendChild(date);

            container.appendChild(item);

        });

    } catch (error) {

        console.error("Orders loading error:", error);

        if (container) {
            container.textContent =
                "Unable to load your orders.";
        }
    }
}


// ========================================
// LOAD AUTHOR INVOICES
// ========================================

async function loadAuthorInvoices(user) {

    const container = getElement("invoices-list");

    try {

        const invoicesRef = collection(db, "invoices");

        const invoicesQuery = query(
            invoicesRef,
            where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(invoicesQuery);

        if (!container) return;

        if (snapshot.empty) {

            container.textContent = "No invoices available.";

            return;
        }

        container.innerHTML = "";

        snapshot.forEach((invoiceDoc) => {

            const invoice = invoiceDoc.data();

            const item = document.createElement("div");

            item.className = "dashboard-item";

            const title = document.createElement("h4");
            title.textContent =
                invoice.invoiceNumber || "Invoice";

            const amount = document.createElement("p");
            amount.textContent =
                "Amount: " + (invoice.amount ?? "Not available");

            const status = document.createElement("p");
            status.textContent =
                "Status: " + (invoice.status || "Pending");

            item.appendChild(title);
            item.appendChild(amount);
            item.appendChild(status);

            container.appendChild(item);

        });

    } catch (error) {

        console.error("Invoices loading error:", error);

        if (container) {
            container.textContent =
                "Unable to load your invoices.";
        }
    }
}


// ========================================
// LOAD AUTHOR DOCUMENTS
// ========================================

async function loadAuthorDocuments(user) {

    const container = getElement("documents-list");

    try {

        const documentsRef = collection(db, "documents");

        const documentsQuery = query(
            documentsRef,
            where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(documentsQuery);

        if (!container) return;

        if (snapshot.empty) {

            container.textContent = "No documents available.";

            return;
        }

        container.innerHTML = "";

        snapshot.forEach((documentDoc) => {

            const documentData = documentDoc.data();

            const item = document.createElement("div");

            item.className = "dashboard-item";

            const title = document.createElement("h4");

            title.textContent =
                documentData.name || "Document";

            item.appendChild(title);

            if (documentData.url) {

                const link = document.createElement("a");

                link.href = documentData.url;
                link.textContent = "View Document";
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                item.appendChild(link);
            }

            container.appendChild(item);

        });

    } catch (error) {

        console.error("Documents loading error:", error);

        if (container) {
            container.textContent =
                "Unable to load your documents.";
        }
    }
}


// ========================================
// LOAD PROJECT UPDATES
// ========================================

async function loadProjectUpdates(user) {

    const container = getElement("updates-list");

    try {

        const updatesRef = collection(db, "projectUpdates");

        const updatesQuery = query(
            updatesRef,
            where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(updatesQuery);

        if (!container) return;

        if (snapshot.empty) {

            container.textContent =
                "No project updates available.";

            return;
        }

        container.innerHTML = "";

        snapshot.forEach((updateDoc) => {

            const update = updateDoc.data();

            const item = document.createElement("div");

            item.className = "dashboard-item";

            const title = document.createElement("h4");

            title.textContent =
                update.title || "Project Update";

            const description = document.createElement("p");

            description.textContent =
                update.message || "No details available.";

            const date = document.createElement("p");

            date.textContent =
                formatDate(update.createdAt);

            item.appendChild(title);
            item.appendChild(description);
            item.appendChild(date);

            container.appendChild(item);

        });

    } catch (error) {

        console.error("Project updates loading error:", error);

        if (container) {
            container.textContent =
                "Unable to load project updates.";
        }
    }
}


// ========================================
// AUTHOR LOGOUT
// ========================================

const logoutButton = getElement("logout-btn");

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "author-centre.html";

        } catch (error) {

            console.error("Logout error:", error);

            alert(
                "Unable to log out. Please try again."
            );
        }
    });
}


// ========================================
// AUTHENTICATION STATE LISTENER
// ========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "author-centre.html";

        return;
    }

    if (!user.emailVerified) {

        window.location.href = "author-centre.html";

        return;
    }

    console.log("Author authenticated successfully.");
    console.log("Author UID:", user.uid);

    // Load the profile first.
    await loadAuthorProfile(user);

    // Load the remaining dashboard sections.
    await Promise.allSettled([

        loadAuthorOrders(user),

        loadAuthorInvoices(user),

        loadAuthorDocuments(user),

        loadProjectUpdates(user)

    ]);

});
