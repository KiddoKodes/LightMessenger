import { Button } from "@material-ui/core";
import Image from "next/image";
import { auth, provider } from "../firebase";
import styles from "../styles/Login.module.css";
const Login = () => {
  const signIn = () => {
    auth.signInWithRedirect(provider).catch(alert);
  };
  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <div className={styles.loginHead}>
          <Image
            src="/thunder.png"
            width="196px"
            height="196px"
            className={styles.loginImg}
          />
          <h1>
            <span>Light</span> Messenger
          </h1>
        </div>
        <Button
          className={styles.loginBtn}
          variant="contained"
          onClick={signIn}
        >
          Sign In With Google
        </Button>
      </div>
    </div>
  );
};
export default Login;
