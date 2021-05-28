import { Avatar, IconButton } from "@material-ui/core";
import styles from "./ChatScreen.module.css";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "../Message";
import { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import getRecipientDetails from "../../utils/getRecipientDetails";
import TimeAgo from "timeago-react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
const ChatScreen = ({ chat, messages }) => {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [recipient, setRecipient] = useState({});
  const [user] = useAuthState(auth);
  var unmounted = false;
  useEffect(() => {
    if (!unmounted) {
      getRecipientDetails(chat.users, user).then((res) => {
        setRecipient(res);
      });
    }
    return () => (unmounted = true);
  }, []);
  useEffect(() => {
    if (!unmounted) {
      if (showEmoji) {
        document.getElementById("PickerEnd").scrollIntoView();
      }
    }
    return () => (unmounted = true);
  }, [showEmoji]);

  const router = useRouter();
  const [messagesSnap] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const shallowBack = () => {
    router.push("/chat", undefined, { shallow: true });
  };
  const showMessages = () => {
    if (messagesSnap) {
      return messagesSnap.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message
          key={message.id}
          user={message.user}
          message={message.message}
        />
      ));
    }
  };
  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL,
      })
      .then(() => {
        setInput("");
        document.getElementById("msgBox").scrollTop =
          document.getElementById("endOfmsg").offsetTop;
      });
  };
  return (
    <div className={styles.container} id="chatBox">
      <header>
        <ArrowBackRoundedIcon
          style={
            window.innerWidth > 700 ? { display: "none" } : { display: "block" }
          }
          onClick={shallowBack}
        />
        <Avatar
          className={styles.recipientPicture}
          src={recipient?.photoURL}
          alt={recipient?.name}
        />
        <div className={styles.headerInfo}>
          <h3>{recipient?.name}</h3>
          <span>
            Last Active :{" "}
            {recipient?.lastSeen?.toDate() ? (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
            ) : (
              "Unavailable"
            )}
          </span>
        </div>
        <div className={styles.headerIcons}>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </header>
      <main>
        <div id="msgBox">
          {showMessages()}
          <div
            id="endOfmsg"
            style={{ position: "relative", bottom: "0" }}
          ></div>
        </div>
      </main>
      <div className={styles.inputContainer}>
        <IconButton
          onClick={() => {
            setShowEmoji(!showEmoji);
          }}
        >
          <InsertEmoticonIcon />
        </IconButton>
        <input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage(e);
            }
          }}
        />
        {/* <IconButton>
          <MicIcon />
        </IconButton> */}
        <IconButton disabled={input === ""} type="submit" onClick={sendMessage}>
          <SendRoundedIcon />
        </IconButton>
      </div>
      <div>
        <Picker
          set="apple"
          onSelect={(e) => setInput(input + e.native)}
          style={
            showEmoji
              ? { display: "block", width: "100%" }
              : { display: "none" }
          }
          emojiSize={32}
          theme="dark"
          id="Emoji"
        />
      </div>
      <div id="PickerEnd"></div>
    </div>
  );
};

export default ChatScreen;
