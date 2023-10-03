import React, { useContext } from "react";
import { FaEllipsis } from "react-icons/fa6";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import Notification from "./Notification";

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>

        <div className="chatIcons">
          <Notification/>
          {/* <FaEllipsis size={24} color="#fafafa" /> */}
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
