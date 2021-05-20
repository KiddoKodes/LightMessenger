import { StylesProvider } from "@material-ui/styles";
import Head from "next/head";
import Login from "./login";
import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Loading from "./loading";
import { useEffect } from "react";
import firebase from "firebase";
function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            name: user.displayName,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL,
            lightID: `${user.email
              .split("@")[0]
              .substring(0, 5)
              .toUpperCase()}${user.uid.substring(0, 5).toUpperCase()}`,
          },
          { merge: true }
        );
    }
  }, [user]);
  if (loading) return <Loading />;
  return (
    <StylesProvider injectFirst>
      <Head>
        <title>Light Chat - A cool chat app</title>
        <meta
          name="description"
          content="Light chat is an amazing chat app with best user experience"
        />
        <link rel="icon" href="/thunder.png" />
      </Head>
      {!user ? <Login /> : <Component {...pageProps} />}
    </StylesProvider>
  );
}

export default MyApp;
