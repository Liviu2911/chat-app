interface Props {
  message: string
  username: string
  sent: boolean
}

export default function Message({message, sent, username}: Props) {
  return (
    <div
      className={`ml-8 mt-4 flex flex-col ${
        sent ? "items-end mr-8" : "items-start"
      }`}
    >
      <h4 className={`text-white opacity-50 italic`}>{username}</h4>
      <div
        className={`max-w-min min-w-[150px] p-2 rounded-full ${
          sent ? "bg-stone-700 text-stone-200" : "bg-stone-200 text-stone"
        }`}
      >
        {message}
      </div>
    </div>
  )
}
