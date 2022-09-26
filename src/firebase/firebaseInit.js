import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';

const config = {
    apiKey: "AIzaSyB4NYzkwwfVv57gXJKqJVZSJjp6QjHUX8U",
    authDomain: "catz-boatclub.firebaseapp.com",
    projectId: "catz-boatclub",
    storageBucket: "catz-boatclub.appspot.com",
    messagingSenderId: "820895297874",
    appId: "1:820895297874:web:f19081fa5d0d31d9f10a8b",
    measurementId: "G-L1YLLPHYPP"
};

const firebaseApp = firebase.initializeApp(config);
firebase.analytics();

const timestamp = firebase.firestore.FieldValue.serverTimestamp;

// const db = firebase.firestore()
// const auth = firebase.auth()
// const currentUser = auth.currentUser
// const functions = firebase.app().functions('europe-west1')

export {timestamp}
export default firebaseApp.firestore()
