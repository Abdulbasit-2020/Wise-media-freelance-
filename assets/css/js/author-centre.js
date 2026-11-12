// ==========================================
// WMF AUTHOR CENTRE
// CLIENT DASHBOARD FRONTEND
// ==========================================


// ==========================================
// 1. MOBILE NAVIGATION
// ==========================================

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mainNavigation =
    document.getElementById("mainNavigation");


if (mobileMenuButton && mainNavigation) {

    mobileMenuButton.addEventListener("click", () => {

        const isActive =
            mainNavigation.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            isActive ? "true" : "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            isActive ? "Close navigation" : "Open navigation"
        );

        mobileMenuButton.textContent =
            isActive ? "✕" : "☰";

    });


    const navigationLinks =
        mainNavigation.querySelectorAll("a");

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



// ==========================================
// 2. AUTHENTICATION TABS
// ==========================================

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");


function showLoginForm() {

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    loginForm.classList.add("active");

    registerForm.classList.remove("active");

    clearAuthMessage();

}


function showRegisterForm() {

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    registerForm.classList.add("active");

    loginForm.classList.remove("active");

    clearAuthMessage();

}


if (loginTab && registerTab) {

    loginTab.addEventListener(
        "click",
        showLoginForm
    );

    registerTab.addEventListener(
        "click",
        showRegisterForm
    );

}



// ==========================================
// 3. AUTHENTICATION MESSAGE
// ==========================================

const authMessage =
    document.getElementById("authMessage");


function showAuthMessage(message, type = "info") {

    if (!authMessage) return;

    authMessage.textContent = message;

    authMessage.className =
        "auth-message " + type;

}


function clearAuthMessage() {

    if (!authMessage) return;

    authMessage.textContent = "";

    authMessage.className = "auth-message";

}



// ==========================================
// 4. PASSWORD VISIBILITY
// ==========================================

const passwordToggleButtons =
    document.querySelectorAll(".password-toggle");


passwordToggleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetId =
            button.dataset.passwordTarget;

        const passwordInput =
            document.getElementById(targetId);

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



// ==========================================
// 5. LOGIN FORM
// ==========================================

if (loginForm) {

    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        if (!email || !password) {

            showAuthMessage(
                "Please complete all required fields.",
                "error"
            );

            return;

        }


        showAuthMessage(
            "The WMF account sign-in system is not connected yet. " +
            "Firebase Authentication will be integrated before " +
            "real account sign-in becomes available.",
            "info"
        );

    });

}



// ==========================================
// 6. REGISTRATION FORM
// ==========================================

if (registerForm) {

    registerForm.addEventListener("submit", event => {

        event.preventDefault();


        const fullName =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // CHECK REQUIRED FIELDS

        if (
            !fullName ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            showAuthMessage(
                "Please complete all required fields.",
                "error"
            );

            return;

        }


        // CHECK PASSWORD MATCH

        if (password !== confirmPassword) {

            showAuthMessage(
                "The passwords do not match. Please check and try again.",
                "error"
            );

            return;

        }


        // FRONTEND ONLY — NO ACCOUNT CREATED

        showAuthMessage(
            "Your details passed the basic form checks, but " +
            "account registration is not available yet. " +
            "Firebase Authentication must be connected first.",
            "info"
        );

    });

}



// ==========================================
// 7. FORGOT PASSWORD
// ==========================================

const forgotPasswordButton =
    document.getElementById("forgotPasswordButton");


if (forgotPasswordButton) {

    forgotPasswordButton.addEventListener("click", () => {

        showAuthMessage(
            "Password recovery will become available after " +
            "Firebase Authentication is configured.",
            "info"
        );

    });

}



// ==========================================
// 8. COPYRIGHT YEAR
// ==========================================

const currentYear =
    document.getElementById("currentYear");


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}



// ==========================================
// END OF AUTHOR CENTRE JAVASCRIPT
// ==========================================
