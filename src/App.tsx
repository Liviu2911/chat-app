import {useState} from "react"

import SignIn from "./components/signin"
import ChatRoom from "./components/chatRoom"

import {app} from "./firebaseConfig"
import {getAuth} from "firebase/auth"
import {useAuthState} from "react-firebase-hooks/auth"

type Data = {
  email: string
  username?: string
}

function App() {
  const [data, setData] = useState<Data>({email: "", username: ""})
  const auth = getAuth(app)
  const [user] = useAuthState(auth)

  return (
    <div>
      {!data?.username ? (
        <SignIn mydata={data} setData={setData} />
      ) : (
        <ChatRoom username={data.username} />
      )}
    </div>
  )
}

export default App
