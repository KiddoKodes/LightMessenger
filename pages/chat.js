import Head from "next/head";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Chat.module.css";
const chat = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Light Messenger | Chat With Your Friends</title>
      </Head>
      <Sidebar />
    </div>
  );
};
export default chat;
