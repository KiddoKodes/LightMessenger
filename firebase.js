import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyAZs3RzVWPFjxV8BcdXq2JvgzBK7jCi5Ak",
  authDomain: "light-messenger-2d925.firebaseapp.com",
  projectId: "light-messenger-2d925",
  storageBucket: "light-messenger-2d925.appspot.com",
  messagingSenderId: "858341716393",
  appId: "1:858341716393:web:6df1e151be1cb895e6d4b8",
  measurementId: "G-7N5VZGNFN9",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { db, auth, provider };
