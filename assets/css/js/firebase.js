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

// ========================================

const firebaseConfig = {

    apiKey: "AIzaSyCieYfWP-dW-XAsrxZSHJa1FTM8ACjbPFI",

    authDomain: "wise-media-freelance.firebaseapp.com",

    projectId: " wise-media-freelance",

    storageBucket: "wise-media-freelance.firebasestorage.app",

    messagingSenderId: "464478345304",

    appId: "1:464478345304:web:e6403014f73c3351f2522d"

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
