import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5C-nsvOUs8C4BvcpHcPBNShfTWnCz3yM",
  authDomain: "fir-fyp-bf23a.firebaseapp.com",
  projectId: "fir-fyp-bf23a",
  storageBucket: "fir-fyp-bf23a.appspot.com",
  messagingSenderId: "274371607874",
  appId: "1:274371607874:web:c013030e809f7210c49cdb"
};

const FIREBASE_APP = initializeApp(firebaseConfig);

const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const FIREBASE_DB = getFirestore(FIREBASE_APP);

const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE };
