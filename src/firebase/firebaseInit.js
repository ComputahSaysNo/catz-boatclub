import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';

// PUT CONFIG OBJECT HERE

const firebaseApp = firebase.initializeApp(config);
firebase.analytics();

const timestamp = firebase.firestore.FieldValue.serverTimestamp;

// const db = firebase.firestore()
// const auth = firebase.auth()
// const currentUser = auth.currentUser
// const functions = firebase.app().functions('europe-west1')

export {timestamp}
export default firebaseApp.firestore()
