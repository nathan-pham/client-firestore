import { faker } from "@faker-js/faker";

import * as fireauth from "firebase/auth";
import * as firestore from "firebase/firestore";
import app from "./utils/firebase";

import { $, elements } from "./utils/dom";

import "@/css/globals.css";
import "@/css/index.css";

const auth = fireauth.getAuth(app);
const db = firestore.getFirestore(app);

const signIn = async () => {
    const provider = new fireauth.GoogleAuthProvider();

    try {
        const result = await fireauth.signInWithPopup(auth, provider);
        const credentials = fireauth.GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
    } catch (e) {
        console.log(e);
    }
};

const { h1, h2, p, ul, li, div, button, main } = elements;
let thingsRef;
let unsubscribe;

// prettier-ignore
const component = div({},
    main({ "id": "content" },
        h1({}, "Sign in!"),
        p({}, "User ID: null")
    ),
    div({ "class": "button-container" }, 
        button({ onClick: signIn }, "Sign in with Google"),
        button({ onClick: () => auth.signOut() }, "Sign out"),
    ),
    div({ "class": "things-container" },
        h2({}, "Your Random Things"),
        ul({}),
        button({}, "Add Random Thing")
    )
)

$("#app").appendChild(component);

auth.onAuthStateChanged((user) => {
    const h1Component = $("#content h1");
    const pComponent = $("#content p");
    const ulComponent = $(".things-container ul");

    if (user) {
        h1Component.textContent = `Hello ${user.displayName}`;
        pComponent.textContent = `User ID: ${user.uid}`;

        thingsRef = firestore.collection(db, "things");

        $(".things-container button").addEventListener("click", async () => {
            const thing = faker.random.words(3);

            try {
                await firestore.addDoc(thingsRef, {
                    uid: user.uid,
                    name: thing,
                    createdAt: firestore.serverTimestamp(),
                });
            } catch (e) {
                console.error(e);
            }
        });

        const q = firestore.query(thingsRef, firestore.where("uid", "==", user.uid), firestore.orderBy("createdAt"));
        
        unsubscribe = firestore.onSnapshot(q, (snapshot) => {
            ulComponent.innerHTML = "";

            snapshot.forEach((doc) => {
                ulComponent.appendChild(li({}, doc.data().name));
            });
        });
    } else {
        h1Component.textContent = `Sign in!`;
        pComponent.textContent = "User ID: null";
        ulComponent.innerHTML = "";

        unsubscribe && unsubscribe();
    }
});
