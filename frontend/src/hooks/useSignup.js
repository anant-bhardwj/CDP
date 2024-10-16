import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ username, email, password, confirmPassword }) => {
    const success = handleInputErrors({
      username,
      email,
      password,
      confirmPassword,
    });

    if (!success) return;

    setLoading(true);

    axios
      .post(
        "/api/auth/signup",
        {
          username,
          email,
          password,
          confirmPassword,
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
        toast.error(error.message);
      })
      .finally(function () {
        setLoading(false);
      });
  };
  return { loading, signup };
};

export default useSignup;

function handleInputErrors({ username, email, password, confirmPassword }) {
  if (!username || !email || !password || !confirmPassword) {
    toast.error("Please fill all the fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do NOT match");
    return false;
  }

  if (password.length < 5) {
    toast.error("Password must be 5 characters or more");
    return false;
  }

  return true;
}
