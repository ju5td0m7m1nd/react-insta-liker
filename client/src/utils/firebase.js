import firebase from "firebase";

var config = {
  apiKey: "AIzaSyCY6U4Ro0e-CGCK10iXM-8z-_vEbeX9NuA",
  authDomain: "instabot-bb030.firebaseapp.com",
  databaseURL: "https://instabot-bb030.firebaseio.com",
  projectId: "instabot-bb030",
  storageBucket: "instabot-bb030.appspot.com",
  messagingSenderId: "374243244384"
};
firebase.initializeApp(config);

firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // ...
  } else {
    // User is signed out.
    // ...
  }
});

const db = firebase.firestore();

const saveFollower = async (userId, timestamp, count, edges) => {
  const userRef = await db.collection(userId).doc(timestamp.toString()).set({
    count,
    edges
  });

  return "done";
};

const getFollower = async userId => {
  var docRef = db.collection(userId);

  const data = await docRef.get();

  if (!data.empty) {
    return data.docs.map(d => ({ id: d.id, data: d.data() }));
  }
  return [];
};

export { saveFollower, getFollower };
