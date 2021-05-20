import { db } from "../firebase";

const checkIfLightIdExists = async (lightId) => {
  const check = await db
    .collection("users")
    .where("lightID", "==", lightId)
    .get();
  return check.docs.length > 0 ? true : false;
};
export default checkIfLightIdExists;
