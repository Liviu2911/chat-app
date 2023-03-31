import {app, db} from "../firebaseConfig"
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import {getAuth} from "firebase/auth"
import {useAuthState} from "react-firebase-hooks/auth"
import {useEffect, useState} from "react"
import {
  addDoc,
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore"

type Data = {
  email: string
  username: string
}

interface Props {
  data: Data
  setData: React.Dispatch<React.SetStateAction<Data>>
}

export default function SignIn({data, setData}: Props) {
  const [showUsername, setShowUsername] = useState(false)
  const auth = getAuth(app)
  const [user] = useAuthState(auth)

  useEffect(() => {
    setData({...data, email: user?.email || "craa"})

    const justCheckin = async () => {
      const collRef = collection(db, "users")
      const q = query(collRef, where("email", "==", user?.email || ""))
      const snapshot = await getCountFromServer(q)
      const moreData = await getDocs(q)

      moreData.forEach(item => {
        console.log(item.data())
      })

      if (snapshot.data().count === 0) {
        setTimeout(() => {
          setShowUsername(true)
        }, 1500)
      } else {
        setShowUsername(false)

        setData({...data, username: user?.displayName || "hello"})
      }
    }

    if (user?.email !== undefined) {
      justCheckin()
      setTimeout(() => {
        setShowUsername(true)
      }, 1500)
    } else {
      setShowUsername(false)
    }
  }, [user])

  useEffect(() => {
    setData({...data, username: localStorage.getItem("username") || ""})
  }, [])

  const Popup = () => {
    const signin = (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider)
    }

    return (
      <div className="m-center center w-48 h-12 bg-stone-600 rounded text-stone-300 mt-48 sm:mt-96 transition hover:bg-stone-7 00 hover:text-stone-200 cursor-pointer">
        <button onClick={signin} className="text-xl">
          Sign In
        </button>
      </div>
    )
  }

  const AddUsername = ({setData, data}: Props) => {
    const [username, setUsername] = useState("")
    const [errormsg, setErrorMsg] = useState(false)
    localStorage.setItem("username", username)

    const createAccount = async () => {
      const collRef = collection(db, "users")
      const q = query(collRef, where("username", "==", username))
      const snapshot = await getCountFromServer(q)

      if (snapshot.data().count === 0) {
        setData(mydata => ({
          ...mydata,
          username: localStorage.getItem("username") || username,
        }))

        addDoc(collection(db, "users"), {
          email: data.email,
          username,
        })
      } else {
        setErrorMsg(true)
      }
    }

    return (
      <div className="m-center mt-[20vh] sm:mt-[45vh] flex flex-col justify-around items-center gap-4 bg-stone-600 w-72 sm:w-96 h-32 rounded relative">
        <input
          type="text"
          placeholder="username..."
          onChange={e => {
            setUsername(e.target.value)
            setErrorMsg(false)
          }}
          className="focus:outline-none w-[75%] h-8 border-[1px] border-stone-500 bg-stone-700 rounded-md p-2 text-stone-400 focus:text-stone-300 transition placeholder:italic placeholder:text-stone-500"
        />
        {errormsg && (
          <p className="text-red-500 absolute text-xs">
            username must be at least 2 characters long
          </p>
        )}
        <button
          onClick={() =>
            username.length > 1 ? createAccount() : setErrorMsg(true)
          }
          className="text-stone-400 w-[50%] h-8 bg-stone-700 border-[1px] border-stone-500 rounded transition hover:text-stone-200 hover:bg-stone-500"
        >
          Create Account
        </button>
      </div>
    )
  }

  return (
    <div>
      {showUsername ? <AddUsername setData={setData} data={data} /> : <Popup />}
    </div>
  )
}
