import { useAuthState } from "react-firebase-hooks/auth";
import Head from "next/head";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import styles from "./chat.module.css";
import { useState } from "react";
import getRecipientDetails from "../../utils/getRecipientDetails";
const RenderSingleChat = ({ chat, messages }) => {
  const [recipient, setRecipient] = useState({});
  const [user] = useAuthState(auth);
  getRecipientDetails(chat.users, user).then((res) => {
    setRecipient(res);
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>Chat with {recipient?.name}</title>
      </Head>
      <Sidebar className={styles.sidebar} />
      <main>
        <ChatScreen chat={chat} messages={messages} />
      </main>
    </div>
  );
};

export default RenderSingleChat;
export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();
  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((message) => ({
      ...message,
      timestamp: message.timestamp.toDate().getTime(),
    }));
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
