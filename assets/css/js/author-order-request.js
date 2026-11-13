import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";


const messageBox = document.getElementById("orderRequestsMessage");
const requestsList = document.getElementById("orderRequestsList");


function showMessage(message) {
    if (messageBox) {
        messageBox.textContent = message;
    }
}


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


function formatDate(timestamp) {
    if (!timestamp || typeof timestamp.toDate !== "function") {
        return "Date not available";
    }

    return timestamp.toDate().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


function statusLabel(status) {
    const labels = {
        submitted: "Submitted — awaiting review",
        under_review: "Under review",
        approved: "Approved",
        rejected: "Rejected"
    };

    return labels[status] || "Status: " + (status || "Unknown");
}


function paymentLabel(status) {
    const labels = {
        unpaid: "Payment not yet made",
        pending: "Payment verification pending",
        paid: "Payment verified"
    };

    return labels[status] || "Payment: " + (status || "Not available");
}


function renderRequests(requests) {
    if (!requestsList) return;

    requestsList.innerHTML = "";

    if (requests.length === 0) {
        showMessage("You have not submitted any order requests yet.");

        return;
    }

    showMessage("");

    requests.forEach(request => {
        const card = document.createElement("article");

        card.className = "order-request-card";

        card.innerHTML = `
            <div class="request-card-header">
                <h3>${escapeHTML(request.serviceName || "Service request")}</h3>
                <span class="request-status">
                    ${escapeHTML(statusLabel(request.status))}
                </span>
            </div>

            <p>
                <strong>Book title:</strong>
                ${escapeHTML(request.bookTitle || "Not provided")}
            </p>

            <p>
                <strong>Genre:</strong>
                ${escapeHTML(request.bookGenre || "Not provided")}
            </p>

            <p>
                <strong>Submitted:</strong>
                ${escapeHTML(formatDate(request.createdAt))}
            </p>

            <p>
                <strong>Payment:</strong>
                ${escapeHTML(paymentLabel(request.paymentStatus))}
            </p>

            ${
                request.adminNotes
                    ? `
                        <div class="admin-feedback">
                            <strong>Message from WMF:</strong>
                            <p>${escapeHTML(request.adminNotes)}</p>
                        </div>
                    `
                    : ""
            }
        `;

        requestsList.appendChild(card);
    });
}


async function loadOrderRequests(user) {
    try {
        showMessage("Loading your order requests...");

        const requestsQuery = query(
            collection(db, "orderRequests"),
            where("ownerUid", "==", user.uid)
        );

        const snapshot = await getDocs(requestsQuery);

        const requests = snapshot.docs.map(document => ({
            id: document.id,
            ...document.data()
        }));

        requests.sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() || 0;
            const dateB = b.createdAt?.toMillis?.() || 0;

            return dateB - dateA;
        });

        renderRequests(requests);

    } catch (error) {
        console.error("Order request loading error:", error);

        showMessage(
            "We could not load your order requests. Please refresh the page or try again later."
        );
    }
}


onAuthStateChanged(auth, async user => {
    if (!user) {
        window.location.href = "author-centre.html";
        return;
    }

    if (!user.emailVerified) {
        showMessage("Please verify your email address before accessing your requests.");
        return;
    }

    await loadOrderRequests(user);
});
