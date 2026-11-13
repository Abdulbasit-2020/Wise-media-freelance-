// ======================================================
// WMF - WISE MEDIA FREELANCE
// AUTHOR CENTRE AUTHENTICATION
// File: public/assets/js/auth.js
// ======================================================

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


// ======================================================
// 1. GET HTML ELEMENTS
// ======================================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const authMessage = document.getElementById("authMessage");
const forgotPasswordButton = document.getElementById("forgotPasswordButton");

const currentYear = document.getElementById("currentYear");


// ======================================================
// 2. DISPLAY MESSAGES
// ======================================================

function showMessage(message, type = "error") {
  if (!authMessage) return;

  authMessage.textContent = message;

  authMessage.className = `auth-message ${type}`;

  authMessage.style.display = "block";
}


function clearMessage() {
  if (!authMessage) return;

  authMessage.textContent = "";
  authMessage.style.display = "none";
}


// ======================================================
// 3. FIREBASE ERROR MESSAGES
// ======================================================

function getFriendlyError(error) {

  const errorCode = error?.code || "";

  const errorMessages = {

    "auth/email-already-in-use":
      "This email address already has an account. Please sign in.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/weak-password":
      "Your password is too weak. Use at least 6 characters.",

    "auth/user-not-found":
      "No account was found with this email address.",

    "auth/wrong-password":
      "The password you entered is incorrect.",

    "auth/invalid-credential":
      "Incorrect email or password. Please check your details.",

    "auth/too-many-requests":
      "Too many attempts. Please wait a while and try again.",

    "auth/network-request-failed":
      "Network error. Check your internet connection.",

    "auth/user-disabled":
      "This account has been disabled. Please contact support.",

    "auth/operation-not-allowed":
      "Email and password authentication is not enabled in Firebase.",

    "auth/requires-recent-login":
      "Please sign in again before performing this action.",

    "firestore/permission-denied":
      "Firebase denied access. Please check your Firestore security rules.",

    "permission-denied":
      "Firebase denied access. Please check your Firestore security rules.",

    "unavailable":
      "Firebase is temporarily unavailable. Please try again."
  };

  return errorMessages[errorCode] ||
    error?.message ||
    "Something went wrong. Please try again.";

}


// ======================================================
// 4. FIRESTORE CLIENT PROFILE
// ======================================================

async function createClientProfile(user) {

  if (!user) {
    throw new Error("No authenticated user was provided.");
  }

  if (!user.emailVerified) {
    throw new Error("Please verify your email address first.");
  }

  const userRef = doc(db, "users", user.uid);

  const userSnapshot = await getDoc(userRef);

  // Do not overwrite an existing profile.
  if (userSnapshot.exists()) {
    return userSnapshot.data();
  }

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


// ======================================================
// 5. SWITCH BETWEEN LOGIN AND REGISTRATION
// ======================================================

function showLogin() {

  clearMessage();

  if (loginForm) {
    loginForm.style.display = "block";
  }

  if (registerForm) {
    registerForm.style.display = "none";
  }

  if (loginTab) {
    loginTab.classList.add("active");
  }

  if (registerTab) {
    registerTab.classList.remove("active");
  }

}


function showRegister() {

  clearMessage();

  if (loginForm) {
    loginForm.style.display = "none";
  }

  if (registerForm) {
    registerForm.style.display = "block";
  }

  if (loginTab) {
    loginTab.classList.remove("active");
  }

  if (registerTab) {
    registerTab.classList.add("active");
  }

}


loginTab?.addEventListener("click", showLogin);

registerTab?.addEventListener("click", showRegister);


// ======================================================
// 6. PASSWORD VISIBILITY
// ======================================================

document.querySelectorAll("[data-password-target]").forEach(button => {

  button.addEventListener("click", () => {

    const targetId = button.dataset.passwordTarget;

    const passwordInput = document.getElementById(targetId);

    if (!passwordInput) return;

    if (passwordInput.type === "password") {

      passwordInput.type = "text";

      button.textContent = "Hide";

    } else {

      passwordInput.type = "password";

      button.textContent = "Show";

    }

  });

});


// ======================================================
// 7. MOBILE NAVIGATION
// ======================================================

const mobileMenuButton =
  document.getElementById("mobileMenuButton");

const mainNavigation =
  document.getElementById("mainNavigation");


if (mobileMenuButton && mainNavigation) {

  mobileMenuButton.addEventListener("click", () => {

    const isExpanded =
      mobileMenuButton.getAttribute("aria-expanded") === "true";

    mobileMenuButton.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );

    mainNavigation.classList.toggle("active");

  });

}


// ======================================================
// 8. COPYRIGHT YEAR
// ======================================================

if (currentYear) {

  currentYear.textContent = new Date().getFullYear();

}


// ======================================================
// 9. REGISTRATION
// ======================================================

if (registerForm) {

  registerForm.addEventListener("submit", async (event) => {

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

    const submitButton =
      registerForm.querySelector('button[type="submit"]');

    if (!name || !email || !password || !confirmPassword) {

      showMessage("Please complete all registration fields.");

      return;

    }

    if (password.length < 6) {

      showMessage("Your password must contain at least 6 characters.");

      return;

    }

    if (password !== confirmPassword) {

      showMessage("Your passwords do not match.");

      return;

    }

    try {

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";
      }

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
        "Your account has been created. Please check your email and verify your email address before signing in.",
        "success"
      );

      showLogin();

      showMessage(
        "Your account has been created. Please check your email and verify your email address before signing in.",
        "success"
      );

    } catch (error) {

      console.error("Registration error:", error);

      showMessage(getFriendlyError(error));

    } finally {

      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent = "Create Account";

      }

    }

  });

}


// ======================================================
// 10. LOGIN
// ======================================================

if (loginForm) {

  loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearMessage();

    const email =
      document.getElementById("loginEmail")?.value.trim();

    const password =
      document.getElementById("loginPassword")?.value;

    const submitButton =
      loginForm.querySelector('button[type="submit"]');

    if (!email || !password) {

      showMessage("Please enter your email and password.");

      return;

    }

    try {

      if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent = "Signing in...";

      }

      await setPersistence(auth, browserLocalPersistence);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // Require email verification.
      if (!user.emailVerified) {

        await signOut(auth);

        showMessage(
          "Please verify your email address before signing in. Check your inbox for the verification link."
        );

        return;

      }

      // Create or retrieve the user's Firestore profile.
      await createClientProfile(user);

      showMessage(
        "Login successful! Opening your Author Dashboard...",
        "success"
      );

      loginForm.reset();

        window.location.href = new URL(
  "author-dashboard.html",
  window.location.href
).href;  ;

    } catch (error) {

      console.error("Login error:", error);

      showMessage(getFriendlyError(error));

    } finally {

      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent = "Login";

      }

    }

  });

}


// ======================================================
// 11. FORGOT PASSWORD
// ======================================================

if (forgotPasswordButton) {

  forgotPasswordButton.addEventListener("click", async () => {

    clearMessage();

    const email =
      document.getElementById("loginEmail")?.value.trim();

    if (!email) {

      showMessage(
        "Please enter your email address in the email field first."
      );

      return;

    }

    try {

      forgotPasswordButton.disabled = true;

      await sendPasswordResetEmail(auth, email);

      showMessage(
        "A password reset link has been sent to your email address.",
        "success"
      );

    } catch (error) {

      console.error("Password reset error:", error);

      showMessage(getFriendlyError(error));

    } finally {

      forgotPasswordButton.disabled = false;

    }

  });

}


// ======================================================
// 12. CHECK EXISTING AUTHENTICATION SESSION
// ======================================================

onAuthStateChanged(auth, (user) => {

  if (user && user.emailVerified) {

    // An already authenticated user should go to the dashboard.
    window.location.replace("author-dashboard.html");

  }

});


// ======================================================
// 13. INITIAL PAGE STATE
// ======================================================

showLogin();

console.log("WMF Author Centre authentication initialized.");
