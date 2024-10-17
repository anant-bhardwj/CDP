import React from "react";
import useLogout from "../../hooks/useLogout";

const Home = () => {
  const { loading, logout } = useLogout();

  return (
    <div>
      <button onClick={logout}>LOGOUT</button>
    </div>
  );
};

export default Home;
