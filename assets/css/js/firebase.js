// ========================================
// WMF FIREBASE CONFIGURATION
// Wise Media Freelance
// ========================================

import { initializeApp, getApp, getApps }
    from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

import { getAuth }
    from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import { getFirestore }
    from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

import { getStorage }
    from "https://www.gstatic.com/firebasejs/13.2.0/firebase-storage.js";


// ========================================
// FIREBASE CONFIGURATION
// REPLACE THESE VALUES WITH YOUR OWN
// ========================================

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_AUTH_DOMAIN",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_STORAGE_BUCKET",

    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

    appId: "YOUR_APP_ID"

};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);


// ========================================
// INITIALIZE FIREBASE SERVICES
// ========================================

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// ========================================
// EXPORT SERVICES FOR OTHER FILES
// ========================================

export {
    app,
    auth,
    db,
    storage
};

console.log("WMF Firebase initialized successfully.");
