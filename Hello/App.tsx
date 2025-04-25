import { useEffect } from "react";
import { FIREBASE_AUTH } from "./src/firebase/config";
import { connectSocket } from "./src/utils/socket";

import StackNavigator from "./src/navigation/StackNavigator";

export default function App() {
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        // Connect socket when user is authenticated
        connectSocket(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return <StackNavigator />;
}
