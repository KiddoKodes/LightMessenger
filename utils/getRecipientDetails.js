import { db } from "../firebase";

const getRecipientDetails = async (users, userLoggedIn) => {
  var recipientDetails = null;
  const currentUser = await db.collection("users").doc(userLoggedIn?.uid).get();
  const recipient = users?.filter(
    (userToBeFiltered) => userToBeFiltered !== currentUser?.data().email
  )[0];
  recipientDetails = await db
    .collection("users")
    .where("email", "==", recipient)
    .get();
  return recipientDetails.docs.length > 0
    ? recipientDetails.docs[0].data()
    : { email: recipient };
};
export default getRecipientDetails;
