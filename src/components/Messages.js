import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const [messages, setMessage] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => { 
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessage(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages &&
        messages.map((m) => {
          return <Message message={m} key={m.id} />;
        })}
    </div>
  );
};

export default Messages;
