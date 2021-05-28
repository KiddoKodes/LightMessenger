import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  ClickAwayListener,
  IconButton,
} from "@material-ui/core";
import ChatBubble from "@material-ui/icons/ChatBubbleTwoTone";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Close from "@material-ui/icons/CloseTwoTone";
import styles from "./Sidebar.module.css";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import checkIfUserExists from "../../utils/checkIfUserExists";
import ChatBox from "../Chat";
import { useRouter } from "next/router";
const Sidebar = (props) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userChatsReference = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatsReference);
  const [modeOfNewChat, setModeOfNewChat] = useState("LightID");
  const [chatsSnap, setChatSnap] = useState(chatsSnapshot);
  useEffect(() => setChatSnap(chatsSnapshot), [chatsSnapshot]);
  const dialogToggler = () => {
    setNewChatId({ id: "", error: null });
    document.getElementById("background").classList.toggle("invisible");
    document.getElementById("dialog").classList.toggle("invisible");
  };
  const [newChatId, setNewChatId] = useState({
    id: "",
    error: null,
  });
  const [open, setOpen] = useState(false);
  const [isExists, setExists] = useState(null);
  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  const createChat = (e) => {
    e.preventDefault();
    if (modeOfNewChat === "EmailID") {
      if (!newChatId.id || newChatId.id.split("@")[1] !== "gmail.com")
        return setNewChatId({
          ...newChatId,
          error:
            "Provider of this email id is not gmail. So you cannot add it.",
        });
    } else if (modeOfNewChat === "LightID") {
      if (
        !newChatId.id ||
        newChatId.id.length !== 10 ||
        newChatId.id !== newChatId.id.toUpperCase()
      )
        return setNewChatId({ ...newChatId, error: "Invalid Light ID" });
    }

    db.collection("users")
      .doc(user.uid)
      .get()
      .then((res) => {
        if (modeOfNewChat === "EmailID") {
          if (newChatId.id === res.data().email) {
            return setNewChatId({
              ...newChatId,
              error: "You cannot chat with yourself",
            });
          }
        } else {
          if (newChatId.id === res.data().lightID) {
            return setNewChatId({
              ...newChatId,
              error: "You cannot chat with yourself",
            });
          }
        }
        if (modeOfNewChat === "EmailID") {
          
          if (checkIfChatAlreadyExists(newChatId.id)) {
            return setNewChatId({
              ...newChatId,
              error: "Chat Already Exists",
            });
          } else {
            db.collection("chats")
              .add({
                users: [res.data().email, newChatId.id],
              })
              .then(() => {
                dialogToggler();
              });
          }
        } else {
          db.collection("users")
            .where("lightID", "==", newChatId.id)
            .get()
            .then((response) => {
              
                checkIfChatAlreadyExists(response.docs[0].data().email)
              );
              if (checkIfChatAlreadyExists(response.docs[0].data().email)) {
                return setNewChatId({
                  ...newChatId,
                  error: "Chat Already Exists",
                });
              }
              checkIfUserExists(newChatId.id, modeOfNewChat).then((res) => {
                setExists(res);
              });
              if (isExists) {
                db.collection("chats")
                  .add({
                    users: [res.data().email, response.docs[0].data().email],
                  })
                  .then(() => {
                    dialogToggler();
                  });
              } else {
                return setNewChatId({
                  ...newChatId,
                  error: `There is no user with given ${modeOfNewChat}`,
                });
              }
            });
        }
      })
      .catch((e) => {
        return setNewChatId({ ...newChatId, error: "Something went wrong.." });
      });
  };
  const checkIfChatAlreadyExists = (recipientEmailID) => {
    var isAlreadyExists = null;
    chatsSnapshot?.docs.find((chat) => {
      chat.data().users.find((user) => {
        if (user === recipientEmailID) {
          
          isAlreadyExists = true;
        } else isAlreadyExists = false;
      });
    });
    return isAlreadyExists;
  };
  const signOut = () => {
    auth.signOut();
  };
  return (
    <div className={`${styles.container} ${props.className}`}>
      <div id="background" className="invisible" />
      <header className={styles.header}>
        <div className={styles.leftHandle}>
          <Avatar
            className={styles.userAvatar}
            src={user?.photoURL}
            alt={user?.displayName}
          />
        </div>

        <div className={styles.iconActions}>
          <IconButton>
            <ChatBubble className={styles.headerIcons} />
          </IconButton>
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className={styles.userDropDown}>
              <IconButton onClick={handleClick}>
                <MoreVertIcon className={styles.headerIcons} />
              </IconButton>
              {open ? (
                <div className={styles.dropdown}>
                  <Button variant="outlined">Update Profile Picture</Button>
                  <Button variant="outlined" onClick={signOut}>
                    Logout
                  </Button>
                </div>
              ) : null}
            </div>
          </ClickAwayListener>
        </div>
      </header>

      <Button
        variant="contained"
        className={styles.wideBtn}
        onClick={dialogToggler}
      >
        Start a new chat
      </Button>
      <div id="dialog" className="invisible">
        <h1>Start A New Chat</h1>
        <IconButton className="dialogIcon" onClick={dialogToggler}>
          <Close />
        </IconButton>
        {newChatId.error !== null ? (
          <span style={{ color: "yellow" }}>{newChatId.error}</span>
        ) : (
          ""
        )}
        <form>
          {modeOfNewChat === "LightID" ? (
            <input
              placeholder="Light-ID Of Your Friend"
              value={newChatId.id}
              onChange={(e) => setNewChatId({ id: e.target.value })}
            />
          ) : (
            <input
              placeholder="Email-ID Of Your Friend"
              type="email"
              value={newChatId.id}
              onChange={(e) => setNewChatId({ id: e.target.value })}
            />
          )}

          <Button variant="contained" onClick={createChat} type="submit">
            Go
          </Button>
        </form>
        <div
          onClick={() =>
            modeOfNewChat === "LightID"
              ? setModeOfNewChat("EmailID")
              : setModeOfNewChat("LightID")
          }
          style={{
            display: "block",
            marginBottom: "2rem",
            color: "yellow",
            cursor: "pointer",
          }}
        >
          {modeOfNewChat === "LightID"
            ? "Start a new chat with email"
            : "Start a new chat with lightID"}
        </div>
      </div>
      <div className={styles.chatSection}>
        {chatsSnap?.docs.map((chat, index) => (
          <ChatBox key={index} id={chat.id} users={chat.data().users} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
