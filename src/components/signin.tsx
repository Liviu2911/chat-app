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
import {useCollectionData} from "react-firebase-hooks/firestore"

type Data = {
  email: string
  username?: string
}

interface Props {
  mydata?: Data | undefined
  setData: React.Dispatch<React.SetStateAction<Data>>
}

export default function SignIn({mydata, setData}: Props) {
  const auth = getAuth(app)
  const usersRef = collection(db, "users")
  const [user] = useAuthState(auth)
  const [users] = useCollectionData(usersRef)
  const [addUsername, setAddUsername] = useState(false)

  useEffect(() => {
    console.log(user)
    if (user) {
      const q = query(usersRef, where("email", "==", user.email))
      const check = async () => {
        const data = await getDocs(q)
        const username: string[] = []
        data.forEach(doc => username.push(doc.data().username))
        setData({email: user.email || "", username: username[0]})
      }
      check()
    }
  }, [user])

  const Popup = ({setData}: Props) => {
    const signin = async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const provider = new GoogleAuthProvider()

      const checkEmail = async () => {
        const data = await getDocs(usersRef)
        let newShowUsername: boolean = true
        data.forEach(doc => {
          if (doc.data().email === user?.email && newShowUsername === true) {
            newShowUsername = false
            setData({
              username: doc.data().username,
              email: doc.data().email,
            })
            console.log(mydata)
          }
        })
        setAddUsername(newShowUsername)
      }
      return signInWithPopup(auth, provider).then(() => {
        checkEmail()
      })
    }

    return (
      <div className="m-center center w-48 h-12 bg-stone-600 rounded text-stone-300 mt-48 sm:mt-96 transition hover:bg-stone-7 00 hover:text-stone-200 cursor-pointer">
        <button onClick={signin} className="text-xl">
          Sign In
        </button>
      </div>
    )
  }

  const AddUsername = () => {
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const createAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      const q = query(usersRef, where("username", "==", username))
      const count = await getCountFromServer(q)

      if (username.length < 2) setError("short")
      else if (count.data().count > 0) setError("username")
      else {
        setAddUsername(false)

        setData({username, email: user?.email || ""})
        return await addDoc(usersRef, {
          email: user?.email,
          username,
        })
      }
    }

    const ErrorMessage = () => {
      return (
        <div>
          <p className="text-red-500 text-sm absolute w-[300px] left-[100px] text-center">
            {error === "short"
              ? "Username must be at least 2 characters long"
              : "Username alredy exists"}
          </p>
        </div>
      )
    }

    return (
      <form className="sm:w-[500px] sm:h-48 sm:mt-[10%] mt-[25%] w-[75%] h-32 m-center bg-stone-800 flex flex-col justify-around items-center rounded relative">
        <input
          type="text"
          placeholder="Enter an username..."
          value={username}
          onChange={e => {
            setUsername(e.target.value)
            setError("")
          }}
          className="w-[75%] h-8 rounded bg-stone-700 border-1 border-stone-500 focus:outline-none p-3 text-stone-300 placeholder:italic placeholder:text-stone-500"
        />
        {error !== "" && <ErrorMessage />}
        <button
          type="submit"
          onClick={e => createAccount(e)}
          className="text-stone-300 text-xl hover:text-sky-700 transition-3 font-medium uppercase"
        >
          Create Account
        </button>
      </form>
    )
  }

  return (
    <div>{addUsername ? <AddUsername /> : <Popup setData={setData} />}</div>
  )
}
