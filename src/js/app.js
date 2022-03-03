import * as firebaseAuth from "firebase/auth";
import firebaseApp from "./utils/firebase";

import { $, elements } from "./utils/dom";

import "@/css/globals.css";
import "@/css/index.css";

const auth = firebaseAuth.getAuth(firebaseApp);

const signIn = async () => {
    const provider = new firebaseAuth.GoogleAuthProvider();

    try {
        const result = await firebaseAuth.signInWithPopup(auth, provider);
        const credentials = firebaseAuth.GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
    } catch (e) {
        console.log(e);
    }
};

const { h1, p, div, button, main } = elements;

// prettier-ignore
const component = div({},
    main({ id: "content" },
        h1({}, "Sign in!"),
        p({}, "User ID: null")
    ),
    div({ "class": "button-container" }, 
        button({ onClick: signIn }, "Sign in with Google"),
        button({ onClick: () => auth.signOut() }, "Sign out")    
    )
)

$("#app").appendChild(component);

auth.onAuthStateChanged((user) => {
    if (user) {
        $("#content h1").replaceWith(h1({}, `Hello ${user.displayName}`));
        $("#content p").replaceWith(p({}, `User ID: ${user.uid}`));
    } else {
        $("#content h1").replaceWith(h1({}, "Sign in!"));
        $("#content p").replaceWith(p({}, "User ID: null"));
    }
});
