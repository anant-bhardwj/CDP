import React from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
import useLogout from "../hooks/useLogout.js";

const navbar = () => {
  const { loading, logout } = useLogout();
  const { authUser } = useAuthContext();
  return (
    <div className="navbar bg-base-100 justify-between">
      <a className="btn btn-ghost text-xl">{authUser.username}</a>
      <button className="btn btn-circle" onClick={logout}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 15 15"
          fill="oklch(var(--bc))"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 7.5L10.5 10.75M13.5 7.5L10.5 4.5M13.5 7.5L4 7.5M8 13.5H1.5L1.5 1.5L8 1.5"
            fill="oklch(var(--bc))"
            stroke="oklch(var(--bc))"
          />
        </svg>
      </button>
    </div>
  );
};

export default navbar;
