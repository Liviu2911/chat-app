import {useState} from "react"

import SignIn from "./components/signin"
import ChatRoom from "./components/chatRoom"

type Data = {
  email: string
  username: string
}

function App() {
  const [data, setData] = useState<Data>({email: "", username: ""})

  return (
    <div>
      {data.username === "" ? (
        <SignIn data={data} setData={setData} />
      ) : (
        <ChatRoom />
      )}
    </div>
  )
}

export default App
