// ============================================
// LOAD AUTHOR PROFILE
// ============================================

async function loadAuthorProfile(user) {

    // Show authenticated email immediately.
    authorEmail.textContent =
        user.email || "Email unavailable";

    authorName.textContent =
        user.displayName || "Author";

    try {

        const profileRef = doc(db, "users", user.uid);

        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {

            const profile = profileSnapshot.data();

            authorName.textContent =
                profile.displayName ||
                user.displayName ||
                "Author";

            authorEmail.textContent =
                user.email ||
                profile.email ||
                "Email unavailable";

        } else {

            console.warn(
                "Author profile document does not exist:",
                user.uid
            );

            authorName.textContent =
                user.displayName || "Author";

            authorEmail.textContent =
                user.email || "Email unavailable";

            showDashboardMessage(
                "Your account is active, but your profile document was not found.",
                "error"
            );

        }

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        alert(
            "Profile Error Code: " +
            (error.code || "Unknown") +
            "\nError Details: " +
            (error.message || "No details available")
        );

        authorName.textContent =
            user.displayName || "Author";

        authorEmail.textContent =
            user.email || "Email unavailable";

        showDashboardMessage(
            "Your account is authenticated, but your profile information could not be retrieved.",
            "error"
        );

    }

}
