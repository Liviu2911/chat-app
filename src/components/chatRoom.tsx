import {signOut} from "firebase/auth"
import {db, app} from "../firebaseConfig"
import {getAuth} from "firebase/auth"
import {
  addDoc,
  collection,
  query,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore"

import {useState, useEffect} from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollectionData} from "react-firebase-hooks/firestore"
import Message from "./message"

type Message = {
  message: string
  received: boolean
}

interface Props {
  username: string
}

export default function ChatRoom({username}: Props) {
  const usersRef = collection(db, "users")
  const messagesRef = collection(db, "messages")
  const [message, setMessage] = useState("")

  const auth = getAuth(app)
  const [user] = useAuthState(auth)
  const queryMessages = query(messagesRef, orderBy("timeSent"), limit(25))
  const [messages] = useCollectionData(queryMessages)

  const sendMessage = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    if (message.length > 0) {
      setMessage("")

      const add = await addDoc(messagesRef, {
        text: message,
        timeSent: Timestamp.now(),
        email: user?.email,
        username,
      })
      return add
    }
  }

  const signout = () => {
    signOut(auth)
    window.location.reload()
  }

  const formStyle = {
    left: window.innerWidth >= 768 ? `${window.innerWidth / 2 - 300}px` : "",
  }

  const messagesStyle = {
    height:
      window.innerWidth >= 768 && window.innerWidth < 1920 ? `60vh` : "auto",
  }

  return (
    <div>
      <header className="flex items-center w-full h-[10vh] justify-evenly">
        <h1 className="uppercase text-stone-300 text-xl sm:text-5xl font-medium text-center">
          Chat Room
        </h1>
        <button
          onClick={() => signout()}
          className="sm:w-32 sm:h-10 w-20 h-6 font-medium text-sm sm:text-[18px] bg-stone-700 text-stone-400 rounded border-[1px] border-stone-500 transition-3 hover:text-red-500 hover:bg-stone-600"
        >
          Sign Out
        </button>
      </header>

      <div
        className="sm:w-[600px] sm:h-[600px] sm:max-h-[600px] w-full h-[60vh] bg-stone-800 sm:rounded m-center sm:mt-16 flex flex-col overflow-y-scroll"
        style={messagesStyle}
      >
        {messages &&
          messages.map(mes => (
            <Message
              username={mes.username}
              message={mes.text}
              sent={mes.email === user?.email ? true : false}
              key={mes.timeSent}
            />
          ))}
      </div>

      <form
        className="fixed flex justify-around sm:w-[600px] w-full bottom-[50px] sm:bottom-[100px]"
        style={formStyle}
      >
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="focus:outline-none sm:w-[500px] w-[80%] h-10 rounded bg-stone-800 border-1 border-stone-600 p-2 text-stone-300"
        />

        <button
          type="submit"
          onClick={e => sendMessage(e)}
          className="w-10 h-10 bg-stone-800 rounded border-1 border-stone-600"
        >
          🛸
        </button>
      </form>
    </div>
  )
}
