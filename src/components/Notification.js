import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotification] = useState([]);
  const { currentUser } = useContext(AuthContext);

  async function getChats(db) {
    const chatsCols = collection(db, "chats");
    const chatSnapshot = await getDocs(chatsCols);
    const chatList = chatSnapshot.docs.map((doc) => doc.data().messages);

    setNotification(chatList);
    return chatList;
  }

  useEffect(() => {
    getChats(db);
  }, [currentUser.uid]);

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-bell-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
        </svg>

        {notifications.map((firstArray) => {
          const data = firstArray.map(
            (doc) => doc.reciepient === currentUser.uid
          );
          return (
            <span className="notification-count" key={data.id}>
              <span>{data?.length}</span>
            </span>
          );
        })}
      </div>

      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              //   onClick={() => markAllNotificationsAsRead(notifications)}
            >
              Mark all as read
            </div>
          </div>
          {notifications.map((firstArray) => {
            const data = firstArray.map(
              (doc) => doc.reciepient === currentUser.uid
            );

            if (data.length === 0)
              return (
                <span style={{ paddingLeft: 20 }}>No notifications yet</span>
              );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
