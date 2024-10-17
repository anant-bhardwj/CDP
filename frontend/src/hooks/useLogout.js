import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    axios
      .post(
        "/api/auth/logout",
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response) {
        const data = response.data;

        if (data.error) {
          throw new Error(data.error);
        }

        localStorage.removeItem("cdp-user");
        setAuthUser(null);
      })
      .catch(function (error) {
        if (error.response) {
          console.error("Error status:", error.response.status); // Status code
          console.error("Error response data:", error.response.data); // Full error data
          toast.error(error.response.data.error || "Logout failed");
        } else {
          console.error("Error:", error.message);
          toast.error("An unexpected error occurred");
        }
      })
      .finally(function () {
        setLoading(false);
      });
  };
  return { loading, logout };
};

export default useLogout;
