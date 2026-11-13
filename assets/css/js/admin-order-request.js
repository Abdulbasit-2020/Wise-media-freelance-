// ======================================================
// WMF ADMIN ORDER REQUEST MANAGEMENT
// ======================================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";


// ======================================================
// ELEMENTS
// ======================================================

const requestsContainer =
    document.getElementById("requestsContainer");

const adminMessage =
    document.getElementById("adminMessage");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const refreshButton =
    document.getElementById("refreshButton");

const logoutButton =
    document.getElementById("logoutButton");

document.getElementById("currentYear").textContent =
    new Date().getFullYear();


// ======================================================
// STATE
// ======================================================

let currentAdmin = null;
let allRequests = [];
let loadingRequests = false;


// ======================================================
// MESSAGE
// ======================================================

function showMessage(message, type = "info") {

    adminMessage.textContent = message;

    adminMessage.className =
        `admin-message ${type}`;

}


// ======================================================
// DATE
// ======================================================

function formatDate(value) {

    if (!value) return "Not provided";

    const date = value.toDate
        ? value.toDate()
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not provided";
    }

    return date.toLocaleString();

}


// ======================================================
// SAFE TEXT
// ======================================================

function addText(parent, tag, value) {

    const element = document.createElement(tag);

    element.textContent =
        value === null || value === undefined || value === ""
            ? "Not provided"
            : String(value);

    parent.appendChild(element);

    return element;

}


// ======================================================
// STATUS CLASS
// ======================================================

function getStatusClass(status) {

    if (status === "approved") {
        return "status-approved";
    }

    if (status === "rejected") {
        return "status-rejected";
    }

    return "status-submitted";

}


// ======================================================
// LOAD REQUESTS
// ======================================================

async function loadRequests() {

    if (!currentAdmin || loadingRequests) return;

    loadingRequests = true;

    refreshButton.disabled = true;

    requestsContainer.replaceChildren();

    const loading = document.createElement("div");

    loading.className = "empty-state";

    loading.textContent = "Loading order requests...";

    requestsContainer.appendChild(loading);

    try {

        const requestsQuery = query(
            collection(db, "orderRequests"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(requestsQuery);

        allRequests = [];

        snapshot.forEach(item => {

            allRequests.push({
                id: item.id,
                ...item.data()
            });

        });

        renderRequests();

        showMessage(
            `${allRequests.length} order request(s) retrieved.`,
            "success"
        );

    } catch (error) {

        console.error("Load requests error:", error);

        requestsContainer.replaceChildren();

        const errorState = document.createElement("div");

        errorState.className = "empty-state";

        errorState.textContent =
            "Unable to load order requests. Check your Firestore rules and administrator permissions.";

        requestsContainer.appendChild(errorState);

        showMessage(
            "Order requests could not be retrieved.",
            "error"
        );

    } finally {

        loadingRequests = false;

        refreshButton.disabled = false;

    }

}


// ======================================================
// RENDER REQUESTS
// ======================================================

function renderRequests() {

    requestsContainer.replaceChildren();

    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedStatus = statusFilter.value;

    const filteredRequests = allRequests.filter(request => {

        const matchesSearch =
            (request.fullName || "").toLowerCase().includes(searchTerm) ||
            (request.bookTitle || "").toLowerCase().includes(searchTerm) ||
            (request.email || "").toLowerCase().includes(searchTerm) ||
            (request.serviceName || "").toLowerCase().includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            request.status === selectedStatus;

        return matchesSearch && matchesStatus;

    });

    if (filteredRequests.length === 0) {

        const empty = document.createElement("div");

        empty.className = "empty-state";

        empty.textContent =
            allRequests.length === 0
                ? "There are currently no client order requests."
                : "No requests match your search or filter.";

        requestsContainer.appendChild(empty);

        return;

    }

    filteredRequests.forEach(request => {

        const card = document.createElement("article");

        card.className = "request-card";

        // Client and service.
        addText(
            card,
            "h2",
            request.bookTitle || "Untitled Book"
        );

        addText(
            card,
            "p",
            `Client: ${request.fullName || "Not provided"}`
        );

        addText(
            card,
            "p",
            `Email: ${request.email || "Not provided"}`
        );

        addText(
            card,
            "p",
            `Service: ${request.serviceName || "Not provided"}`
        );

        const meta = document.createElement("div");

        meta.className = "request-meta";

        const status = document.createElement("span");

        status.className =
            `status-badge ${getStatusClass(request.status)}`;

        status.textContent =
            request.status || "submitted";

        meta.appendChild(status);

        const payment = document.createElement("span");

        payment.className = "status-badge";

        payment.textContent =
            `Payment: ${request.paymentStatus || "unpaid"}`;

        meta.appendChild(payment);

        card.appendChild(meta);

        const details = document.createElement("div");

        details.className = "request-details";

        addText(details, "h3", "Project Information");

        addText(
            details,
            "p",
            `Book Genre: ${request.bookGenre || "Not provided"}`
        );

        addText(
            details,
            "p",
            `Word Count: ${request.wordCount ?? "Not provided"}`
        );

        addText(
            details,
            "p",
            `Preferred Deadline: ${request.preferredDeadline || "Not provided"}`
        );

        addText(
            details,
            "p",
            `Submitted: ${formatDate(request.createdAt)}`
        );

        addText(details, "h3", "Project Description");

        addText(
            details,
            "p",
            request.projectDescription
        );

        addText(details, "h3", "Additional Requirements");

        addText(
            details,
            "p",
            request.additionalRequirements
        );

        addText(details, "h3", "Administrative Notes");

        const notes = document.createElement("textarea");

        notes.className = "admin-notes";

        notes.maxLength = 3000;

        notes.placeholder =
            "Enter internal WMF review notes...";

        notes.value = request.adminNotes || "";

        details.appendChild(notes);

        const actions = document.createElement("div");

        actions.className = "request-actions";

        const saveButton = createActionButton(
            "Save Notes",
            "save-button"
        );

        const approveButton = createActionButton(
            "Approve Request",
            "approve-button"
        );

        const rejectButton = createActionButton(
            "Reject Request",
            "reject-button"
        );

        saveButton.addEventListener("click", () => {

            saveNotes(request.id, notes, saveButton);

        });

        approveButton.addEventListener("click", () => {

            updateRequestStatus(
                request.id,
                "approved",
                notes.value,
                approveButton
            );

        });

        rejectButton.addEventListener("click", () => {

            updateRequestStatus(
                request.id,
                "rejected",
                notes.value,
                rejectButton
            );

        });

        actions.append(
            saveButton,
            approveButton,
            rejectButton
        );

        details.appendChild(actions);

        card.appendChild(details);

        requestsContainer.appendChild(card);

    });

}


// ======================================================
// ACTION BUTTON
// ======================================================

function createActionButton(label, className) {

    const button = document.createElement("button");

    button.type = "button";

    button.className =
        `admin-button ${className}`;

    button.textContent = label;

    return button;

}


// ======================================================
// SAVE INTERNAL NOTES
// ======================================================

async function saveNotes(requestId, notes, button) {

    const content = notes.value.trim();

    if (content.length > 3000) {

        showMessage(
            "Administrative notes cannot exceed 3,000 characters.",
            "error"
        );

        return;

    }

    button.disabled = true;

    try {

        await updateDoc(
            doc(db, "orderRequests", requestId),
            {
                adminNotes: content,
                reviewedBy: currentAdmin.uid,
                updatedAt: serverTimestamp()
            }
        );

        const request = allRequests.find(
            item => item.id === requestId
        );

        if (request) {
            request.adminNotes = content;
        }

        showMessage(
            "Administrative notes saved.",
            "success"
        );

    } catch (error) {

        console.error("Save notes error:", error);

        showMessage(
            "Unable to save administrative notes.",
            "error"
        );

    } finally {

        button.disabled = false;

    }

}


// ======================================================
// APPROVE OR REJECT REQUEST
// ======================================================

async function updateRequestStatus(
    requestId,
    newStatus,
    notes,
    button
) {

    const action = newStatus === "approved"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
        `Are you sure you want to ${action} this request?`
    );

    if (!confirmed) return;

    button.disabled = true;

    try {

        await updateDoc(
            doc(db, "orderRequests", requestId),
            {
                status: newStatus,
                adminNotes: notes.trim(),
                reviewedBy: currentAdmin.uid,
                reviewedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }
        );

        const request = allRequests.find(
            item => item.id === requestId
        );

        if (request) {

            request.status = newStatus;

            request.adminNotes = notes.trim();

        }

        renderRequests();

        showMessage(
            `Order request ${newStatus} successfully.`,
            "success"
        );

    } catch (error) {

        console.error("Request status update error:", error);

        showMessage(
            "Unable to update the request. Check your administrator permissions.",
            "error"
        );

        button.disabled = false;

    }

}


// ======================================================
// SEARCH AND FILTER
// ======================================================

searchInput.addEventListener("input", renderRequests);

statusFilter.addEventListener("change", renderRequests);

refreshButton.addEventListener("click", loadRequests);


// ======================================================
// LOGOUT
// ======================================================

logoutButton.addEventListener("click", async () => {

    logoutButton.disabled = true;

    try {

        await signOut(auth);

        window.location.replace("author-centre.html");

    } catch (error) {

        console.error("Admin logout error:", error);

        showMessage(
            "Unable to sign out. Please try again.",
            "error"
        );

        logoutButton.disabled = false;

    }

});


// ======================================================
// ADMIN AUTHORIZATION
// ======================================================

onAuthStateChanged(auth, async user => {

    if (!user || !user.emailVerified) {

        window.location.replace("author-centre.html");

        return;

    }

    try {

        const tokenResult = await user.getIdTokenResult(true);

        if (tokenResult.claims.admin !== true) {

            showMessage(
                "Access denied. This account does not have administrator privileges.",
                "error"
            );

            requestsContainer.replaceChildren();

            addText(
                requestsContainer,
                "div",
                "You are not authorised to access this page."
            );

            await signOut(auth);

            window.location.replace("author-centre.html");

            return;

        }

        currentAdmin = user;

        await loadRequests();

    } catch (error) {

        console.error("Admin authorization error:", error);

        showMessage(
            "Unable to verify administrator permissions.",
            "error"
        );

    }

});


console.log("WMF Admin Order Requests initialized.");
