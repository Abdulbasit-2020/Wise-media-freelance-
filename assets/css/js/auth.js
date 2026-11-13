// ============================================
// WMF AUTHENTICATION SYSTEM
// Wise Media Freelance
// Firebase Authentication
// ============================================


import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";


// ============================================
// ELEMENTS
// ============================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const authMessage = document.getElementById("authMessage");

const forgotPasswordButton =
    document.getElementById("forgotPasswordButton");

const currentYear = document.getElementById("currentYear");


// ============================================
// MESSAGE DISPLAY
// ============================================

function showMessage(message, type = "info") {

    if (!authMessage) return;

    authMessage.textContent = message;

    authMessage.className = `auth-message ${type}`;

    authMessage.style.display = "block";
}


// ============================================
// CLEAR MESSAGE
// ============================================

function clearMessage() {

    if (!authMessage) return;

    authMessage.textContent = "";

    authMessage.style.display = "none";
}


// ============================================
// PASSWORD VISIBILITY
// ============================================

document.querySelectorAll("[data-password-target]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const targetId =
                button.getAttribute("data-password-target");

            const input = document.getElementById(targetId);

            if (!input) return;

            input.type =
                input.type === "password"
                    ? "text"
                    : "password";

        });

    });


// ============================================
// TAB SWITCHING
// ============================================

function showLogin() {

    if (loginForm) loginForm.style.display = "block";

    if (registerForm) registerForm.style.display = "none";

    if (loginTab) loginTab.classList.add("active");

    if (registerTab) registerTab.classList.remove("active");

    clearMessage();

}

function showRegister() {

    if (loginForm) loginForm.style.display = "none";

    if (registerForm) registerForm.style.display = "block";

    if (loginTab) loginTab.classList.remove("active");

    if (registerTab) registerTab.classList.add("active");

    clearMessage();

}

loginTab?.addEventListener("click", showLogin);

registerTab?.addEventListener("click", showRegister);


// ============================================
// MOBILE NAVIGATION
// ============================================

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mainNavigation =
    document.getElementById("mainNavigation");

mobileMenuButton?.addEventListener("click", () => {

    const isOpen =
        mainNavigation.classList.toggle("active");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});


// ============================================
// COPYRIGHT YEAR
// ============================================

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


// ============================================
// PASSWORD VALIDATION
// ============================================

function validPassword(password) {

    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    );

}


// ============================================
// FIREBASE ERROR MESSAGES
// ============================================

function getFriendlyError(error) {

    switch (error.code) {

        case "auth/email-already-in-use":
            return "An account already exists with this email address.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/weak-password":
            return "Your password is too weak.";

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "The email address or password is incorrect.";

        case "auth/too-many-requests":
            return "Too many attempts. Please wait before trying again.";

        case "auth/network-request-failed":
            return "Network error. Check your internet connection.";

        case "auth/operation-not-allowed":
            return "Email and password authentication is not enabled in Firebase.";

        default:
            console.error(error);

            return "Something went wrong. Please try again.";

    }

}

// ============================================
// CREATE OR CHECK CLIENT FIRESTORE PROFILE
// ============================================

async function createClientProfile(user) {

    if (!user || !user.uid) {
        throw new Error("Authenticated user not found.");
    }

    if (!user.emailVerified) {
        throw new Error("Email verification is required.");
    }

    const userRef = doc(db, "users", user.uid);

    const userSnapshot = await getDoc(userRef);

    // Existing profile: do not overwrite it.
    if (userSnapshot.exists()) {

        return userSnapshot.data();

    }

    // Create a new profile for this verified user.
    const profile = {

        uid: user.uid,

        displayName:
            user.displayName ||
            user.email.split("@")[0],

        email: user.email,

        createdAt: serverTimestamp()

    };

    await setDoc(userRef, profile);

    return profile;

}
// ============================================
// REGISTRATION
// ============================================

registerForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearMessage();

    const name =
        document.getElementById("registerName")?.value.trim();

    const email =
        document.getElementById("registerEmail")?.value.trim();

    const password =
        document.getElementById("registerPassword")?.value;

    const confirmPassword =
        document.getElementById("confirmPassword")?.value;

    if (!name || !email || !password || !confirmPassword) {

        showMessage(
            "Please complete all registration fields.",
            "error"
        );

        return;

    }

    if (!validPassword(password)) {

        showMessage(
            "Password must contain at least 8 characters, including uppercase, lowercase and a number.",
            "error"
        );

        return;

    }

    if (password !== confirmPassword) {

        showMessage(
            "Your passwords do not match.",
            "error"
        );

        return;

    }

    try {

        await setPersistence(auth, browserLocalPersistence);

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name
        });

        await sendEmailVerification(user);

        await signOut(auth);

        registerForm.reset();

        showMessage(
            "Your account has been created! Please check your email and verify your email address before logging in.",
            "success"
        );

    } catch (error) {

        showMessage(
            getFriendlyError(error),
            "error"
        );

    }

});


// ============================================
// LOGIN
// ============================================

loginForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearMessage();

    const email =
        document.getElementById("loginEmail")?.value.trim();

    const password =
        document.getElementById("loginPassword")?.value;

    if (!email || !password) {

        showMessage(
            "Please enter your email address and password.",
            "error"
        );

        return;

    }

    try {

        await setPersistence(auth, browserLocalPersistence);

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        if (!user.emailVerified) {

            await sendEmailVerification(user);

            await signOut(auth);

            showMessage(
                "Please verify your email address before accessing your account. A verification email has been sent.",
                "error"
            );

            return;

        }
          // Create or retrieve the author's Firestore profile
await createClientProfile(user);
        showMessage(
    "Login successful! Opening your Author Dashboard...",
    "success"
);

loginForm.reset();

window.location.replace("author-dashboard.html");

        loginForm.reset();

    } catch (error) {

        showMessage(
            getFriendlyError(error),
            "error"
        );

    }

});


// ============================================
// FORGOT PASSWORD
// ============================================

forgotPasswordButton?.addEventListener("click", async () => {

    clearMessage();

    const email =
        document.getElementById("loginEmail")?.value.trim();

    if (!email) {

        showMessage(
            "Enter your email address in the login field first.",
            "error"
        );

        return;

    }

    try {

        await sendPasswordResetEmail(auth, email);

        showMessage(
            "If an account exists for this email address, a password reset email will be sent.",
            "success"
        );

    } catch (error) {

        showMessage(
            getFriendlyError(error),
            "error"
        );

    }

});


// ============================================
// AUTHENTICATION STATE
// ============================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log(
            "Authenticated WMF user:",
            user.uid
        );

    } else {

        console.log(
            "No user is currently signed in."
        );

    }

});


// ============================================
// INITIAL PAGE STATE
// ============================================

showLogin();

console.log(
    "WMF Authentication System Loaded."
);
