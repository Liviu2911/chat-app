import { app, db } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";

type Data = {
  email: string;
  username: string;
};

interface Props {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
}

export default function SignIn({ data, setData }: Props) {
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const newData: Data = { ...data, email: user?.email || "" };
    setData(newData);
  }, [user]);

  const Popup = () => {
    const signin = (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    };

    return (
      <div>
        <button onClick={signin}>Sign In</button>
      </div>
    );
  };

  const AddUsername = ({ setData, data }: Props) => {
    const [username, setUsername] = useState("");

    const createAccount = () => {
      localStorage.setItem("username", username);
      console.log(localStorage.getItem("username"));

      setData((mydata) => ({
        ...mydata,
        username: localStorage.getItem("username") || username,
      }));

      addDoc(collection(db, "users"), {
        email: data.email,
        username,
      });
    };
    return (
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => createAccount()}>Create Account</button>
      </div>
    );
  };

  return (
    <div>
      {!user?.email ? <Popup /> : <AddUsername setData={setData} data={data} />}
    </div>
  );
}
