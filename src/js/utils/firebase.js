import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBn7VzYhaFShByJwADridRCcWfe_vHxQsU",
    authDomain: "fireship-4f2cb.firebaseapp.com",
    projectId: "fireship-4f2cb",
    storageBucket: "fireship-4f2cb.appspot.com",
    messagingSenderId: "831143085046",
    appId: "1:831143085046:web:d89d788235cd9fd0d03dd7",
    measurementId: "G-XQTCQS5YVM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
