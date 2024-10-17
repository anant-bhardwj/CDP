import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username, password) => {
    const success = handleInputErrors(username, password);

    if (!success) return;

    setLoading(true);
    axios
      .post(
        "/api/auth/login",
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response) {
        const data = response.data;

        if (data.error) {
          throw new Error(data.error);
        }

        localStorage.setItem("cdp-user", JSON.stringify(data));
        setAuthUser(data);
      })
      .catch(function (error) {
        if (error.response) {
          console.error("Error status:", error.response.status); // Status code
          console.error("Error response data:", error.response.data); // Full error data
          toast.error(error.response.data.error || "Login failed");
        } else {
          console.error("Error:", error.message);
          toast.error("An unexpected error occurred");
        }
      })
      .finally(function () {
        setLoading(false);
      });
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill all the fields");
    return false;
  }
  return true;
}
