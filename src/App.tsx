import React, { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, db } from "./firebaseConfig";
import SignIn from "./components/signin";

type Data = {
  email: string;
  username: string;
};

function App() {
  const [data, setData] = useState<Data>({ email: "", username: "" });
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const collectionRef = collection(db, "users");

  const signout = () => {
    signOut(auth);
    window.location.reload();
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      {data.username === "" ? (
        <SignIn data={data} setData={setData} />
      ) : (
        <button onClick={() => signout()}>Sign Out</button>
      )}
    </div>
  );
}

export default App;
