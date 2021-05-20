import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Button, Tooltip } from "@material-ui/core";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
export default function Home() {
  const [user] = useAuthState(auth);
  const [lightID, setLightID] = useState(null);
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((res) => {
          setLightID(res.data().lightID);
        });
    }
  }, [user]);
  const [copySuccess, setCopySuccess] = useState(null);
  const textAreaRef = useRef(null);
  function copyToClipboard(e) {
    navigator.clipboard.writeText(textAreaRef.current.textContent);
    setCopySuccess("Copied!");
  }

  const router = useRouter();
  const LetsChat = () => {
    router.push("/chat");
  };
  return (
    <main className={styles.home}>
      <div className={styles.logo}>
        <Image
          className={styles.logo}
          src="/thunder.png"
          width={90}
          height={90}
        />
        <h1>
          <span className={styles.yellow}>Light</span> Messenger
        </h1>
      </div>

      <section>
        <h1>
          <span className={styles.yellow}>Hello</span>{" "}
          {user.displayName.split(" ")[0]}
        </h1>
        <div className={styles.lightId}>
          <code>
            <span ref={textAreaRef}>{lightID}</span>
            <Tooltip title={copySuccess ? copySuccess : ""} placement="top">
              <FilterNoneIcon onClick={copyToClipboard} />
            </Tooltip>
          </code>
          <h2>
            This Is Your Light-ID. Share It With Your Friends To Start A Chat
            With Them
          </h2>
        </div>
        <Button variant="contained" className={styles.btn} onClick={LetsChat}>
          Lets Chat
        </Button>
      </section>
    </main>
  );
}
