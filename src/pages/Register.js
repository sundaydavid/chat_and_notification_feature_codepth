import React, { useState } from "react";
import { auth, storage, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa6";

const Register = () => {
  const [err, setError] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const file = e.target[2].files[0];
    const password = e.target[3].value;

    try {
      setIsLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

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
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});

            setIsLoading(false);
            history("/");
          });
        }
      );
    } catch (err) {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="fromContainer">
      <div className="formWrapper">
        <form onSubmit={handleSubmit}>
          <label className="profile" htmlFor="file">
            {image ? (
              <img
                src={image}
                alt=""
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  padding: "2px",
                }}
              />
            ) : (
              <FaImage
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#03DAC6",
                  padding: "10px",
                  objectFit: "contain",
                }}
                color="#fafafa"
              />
            )}
          </label>
          {err && (
            <span
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "5px 15px",
                marginBottom: "10px",
                fontWeight: "bold",
                borderRadius: "10px",
              }}
            >
              Something went wrong, please try again
            </span>
          )}

          {isLoading ? (
            <span
              style={{
                backgroundColor: "transparent",
                color: "#03DAC6",
                padding: "5px 15px",
                marginBottom: "10px",
                fontWeight: "bold",
                borderRadius: "10px",
              }}
            >
              Loaing... please wait!
            </span>
          ) : (
            <></>
          )}

          <input type="text" placeholder="Username" />

          <input type="email" placeholder="Email" />
          <input
            type="file"
            id="file"
            onChange={onImageChange}
            style={{ display: "none" }}
          />

          <input type="password" placeholder="Password" />

          <input type="submit" value="Register" />
        </form>
        <p>
          Already have an account?{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
