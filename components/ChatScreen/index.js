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
import { useRef, useState } from "react";
import firebase from "firebase";
import getRecipientDetails from "../../utils/getRecipientDetails";
import TimeAgo from "timeago-react";
import { route } from "next/dist/next-server/server/router";
const ChatScreen = ({ chat, messages }) => {
  const [input, setInput] = useState("");
  const [recipient, setRecipient] = useState({});
  const [user] = useAuthState(auth);
  getRecipientDetails(chat.users, user).then((res) => {
    setRecipient(res);
  });
  const router = useRouter();
  const endOfMessages = useRef(null);
  const [messagesSnap] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const scrollToBottom = () => {
    endOfMessages.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
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
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    scrollToBottom();
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
          src={recipient.photoURL}
          alt={recipient.name}
        />
        <div className={styles.headerInfo}>
          <h3>{recipient.name}</h3>
          <span>
            Last Active :{" "}
            {recipient?.lastSeen?.toDate() ? (
              <TimeAgo datetime={recipient.lastSeen?.toDate()} />
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
        <div>
          {showMessages()}
          <div ref={endOfMessages}></div>
        </div>
      </main>
      <div className={styles.inputContainer}>
        <IconButton>
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
        <IconButton>
          <MicIcon />
        </IconButton>
        <IconButton type="submit" onClick={sendMessage}>
          <SendRoundedIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatScreen;
