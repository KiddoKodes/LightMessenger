import { db } from "../firebase";

const getRecipientDetails = async (users, userLoggedIn) => {
  var recipientDetails = null;
  const currentUserLightID = await db
    .collection("users")
    .doc(userLoggedIn?.uid)
    .get();
  const recipient = users?.filter(
    (userToBeFiltered) =>
      userToBeFiltered !== currentUserLightID?.data().lightID
  )[0];
  recipientDetails = await db
    .collection("users")
    .where("lightID", "==", recipient)
    .get();

  return recipientDetails.docs.length > 0
    ? recipientDetails.docs[0].data()
    : null;
};
export default getRecipientDetails;
