import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import moment from "moment";
import { useEffect } from "react";
const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
  return (
    <div
      style={
        TypeOfMessage === Sender
          ? { alignSelf: "flex-end" }
          : { alignSelf: "flex-start" }
      }
    >
      <TypeOfMessage style={styles.message}>
        {message.message}
        <br />
        <span style={{ fontSize: "10px" }}>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </span>
      </TypeOfMessage>
    </div>
  );
};
const styles = {
  message: {
    width: "fit-content",
    padding: "1rem 1rem",
    borderRadius: "10px",
    margin: "1rem",
    minWidth: "60px",
    position: "relative",
    textAlign: "right",
    wordBreak: "break-all",
    maxWidth: "50vw",
  },
};
export default Message;
const Sender = (props) => (
  <p
    style={{
      ...props.style,
      marginLeft: "auto",
      background: "whitesmoke",
      color: "black",
    }}
  >
    {props.children}
  </p>
);
const Receiver = (props) => (
  <p
    style={{
      ...props.style,
      textAlign: "left",
      background: "hsl(0,0%,10%)",
    }}
  >
    {props.children}
  </p>
);
