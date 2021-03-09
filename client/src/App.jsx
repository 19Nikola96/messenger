import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import './App.css';

function App() {
  const [yourId, setYourId] = useState('')
  const [yourName, setYourName] = useState('')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const socketRef = useRef()

  useEffect(() => {
    socketRef.current = io.connect('/')

    socketRef.current.on("your id", (id) => {
      setYourId(id)
    })

    socketRef.current.on("message", (message) => {
      receivedMessage(message)
    })
  }, [])

  const receivedMessage = (message) => {
    setMessages(oldMessages => [...oldMessages, message])
  }

  const sendMessage = (e) => {
    e.preventDefault()
    const messageObject = {
      body: {message, yourName},
      id: yourId
    }
    setMessage('')
    socketRef.current.emit("send message", messageObject)
  }

  return (
    <div className="App">
      <div className="container">
        <h1>Messenger</h1>
        <ul className="list-group border">  
          {messages.map((message, index) => {
            if (message.id === yourId) {
              return <li className="text-primary list-group-item border-0 text-end" key={index}>
                      {message.body.message} de {message.body.yourName}
                    </li>
            } else {
              return <li className="text-secondary list-group-item border-0 text-start" key={index}>
                      {message.body.message} de {message.body.yourName}
                     </li>
            }
            
          })}
        </ul>
        <form onSubmit={sendMessage}>
          <textarea placeholder="Dit un truc..." value={message} onChange={(e) => setMessage(e.target.value)} cols="30" rows="2" className="mt-5 form-control w-50 mx-auto"></textarea>
          <button className="btn btn-primary mt-2" type="submit">Envoyer</button>
        </form>
        <input className="input-group w-25 mx-auto mt-4" placeholder="Nom" type="text" value={yourName} onChange={(e) => setYourName(e.target.value)}/>
      </div>
    </div>
  );
}

export default App;
