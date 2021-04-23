import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Message from '../Messages/Message/Message'
import Messages from '../Messages/Messages';

import "./Chat.css";

let socket;
const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const ENDPOINT = "https://my-chat-app1234.herokuapp.com/";


  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);
    console.log(socket);

    socket.emit("join", { name, room }, () => {});
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);


  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);


  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
        socket.emit('sendMessage',message,()=>setMessage(''))
    }
  };
  console.log(message,messages)
  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room}/>
          <Messages messages={messages} name={name}/>
          <Input setMessage={setMessage} sendMessage={sendMessage} setMessages={setMessages}/>
      </div>
    </div>
  );
};

export default Chat;
