import { useAuthState } from "react-firebase-hooks/auth";
import Head from "next/head";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import styles from "./chat.module.css";
import { useEffect, useState } from "react";
import getRecipientDetails from "../../utils/getRecipientDetails";
import { useRouter } from "next/router";
const RenderSingleChat = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const CanAccessIt = () => {
    var canAccess = false;
    chat.users.find((_user) => {
      if (_user === user.email) {
        return (canAccess = true);
      } else {
        return (canAccess = false);
      }
    });
    return canAccess;
  };

  if (!CanAccessIt()) router.push("/404");
  const [recipient, setRecipient] = useState({});
  var unmounted = false;
  useEffect(() => {
    if (!unmounted) {
      getRecipientDetails(chat.users, user).then((res) => {
        setRecipient(res);
      });
    }
    return () => (unmounted = true);
  }, [router.query.id]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Chat with {recipient?.name}</title>
      </Head>
      <Sidebar className={styles.sidebar} />
      <main id="mainBox">
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
      // id: JSON.stringify(await ref.get()),
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
