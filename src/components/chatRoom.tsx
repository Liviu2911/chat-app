import {signOut} from "firebase/auth"
import {db, app} from "../firebaseConfig"
import {getAuth} from "firebase/auth"
import {addDoc, collection, getDocs, query, where} from "firebase/firestore"

import {useState} from "react"

export default function ChatRoom() {
  const auth = getAuth(app)
  const signout = () => {
    localStorage.removeItem("username")
    signOut(auth)
    window.location.reload()
  }

  return (
    <div>
      <header className="flex items-center w-full h-[10vh] justify-evenly">
        <h1 className="uppercase text-stone-300 text-5xl font-medium text-center">
          Chat Room
        </h1>
        <button
          onClick={() => signout()}
          className="w-32 h-10 bg-stone-700 text-stone-400 rounded border-[1px] border-stone-500 transition-3 hover:text-red-500 hover:bg-stone-600"
        >
          Sign Out
        </button>
      </header>
    </div>
  )
}
