import { Avatar, StylesProvider } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import getRecipientDetails from "../../utils/getRecipientDetails";
import styles from "./ChatBox.module.css";
import { useRouter } from "next/router";
const ChatBox = ({ id, users }) => {
  const [recipient, setRecipient] = useState({});
  const router = useRouter();
  const viewChat = () => {
    router.push(`/chat/${id}`);
  };
  const [userLoggedIn] = useAuthState(auth);
  useEffect(() => {
    getRecipientDetails(users, userLoggedIn).then((res) => {
      setRecipient(res);
    });
  }, []);
  return (
    <div className={styles.chat} onClick={viewChat}>
      <Avatar src={recipient?.photoURL} alt={recipient?.name} />
      <p>{recipient.name ? recipient?.name : recipient?.email}</p>
    </div>
  );
};

export default ChatBox;
