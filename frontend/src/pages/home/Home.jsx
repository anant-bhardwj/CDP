import React from "react";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/sidebar.jsx";
import Body from "../../components/body/Body.jsx";

const Home = () => {
  return (
    <div className="h-screen flex flex-col bg-base-300">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Body />
      </div>
    </div>
  );
};

export default Home;
