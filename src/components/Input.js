import React, { useContext, useState } from "react";
import { FaImage } from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    try {
      if (img) {
        const storageRef = ref(storage, uuid());

        const uploadTask = uploadBytesResumable(storageRef, img)

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
                console.log("Permission error");
                break;
              case "storage/canceled":
                console.log("storage/canceled");
                break;

              case "storage/unknown":
                console.log("storage/unknown");
                break;
            }
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                    reciepient: data.user.uid,
                    isRead: false,
                  }),
                });
              })
              .catch((err) => {
                alert(err);
              });
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            reciepient: data.user.uid,
            isRead: false,
          }),
        }).catch((err) => {
          alert(err);
        });
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      }).catch((err) => {
        alert(err);
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      }).catch((err) => {
        alert(err);
      });

      setText("");
      setImg(null);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type message..."
        onChange={(e) => {
          setText(e.target.value);
        }}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <FaImage size={24} cursor="pointer" color="gray" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
