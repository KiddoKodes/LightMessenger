import { db } from "../firebase";

const checkIfUserExists = async (id, mode) => {
  if (mode === "EmailID") {
    const check = await db.collection("users").where("email", "==", id).get();
    return check.docs.length > 0 ? true : false;
  } else {
    const check = await db.collection("users").where("lightID", "==", id).get();
    return check.docs.length > 0 ? true : false;
  }
};
export default checkIfUserExists;
