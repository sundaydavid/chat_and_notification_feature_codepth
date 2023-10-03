import React from "react";
import "../styles/homestyle.scss";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home = () => {
  return (
    <div className="home">
      <div className="homeContainer">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
