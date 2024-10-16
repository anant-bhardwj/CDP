// import React from "react";
// import { useAuthContext } from "../context/AuthContext";
// import axios from "axios";

// const useSignup = () => {
//   const [loading, setLoading] = useState(false);
//   const { setAuthUser } = useAuthContext();

//   const signup = async ({ username, email, password, confirmPassword }) => {
//     const success = handleInputErrors({
//       username,
//       email,
//       password,
//       confirmPassword,
//     });

//     if (!success) return;

//     setLoading(true);

//     axios.post(
//       "/api/auth/signup",
//       {
//         username,
//         email,
//         password,
//         confirmPassword,
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     )
//     .then(function(response) {
//         const data = response.data;

//         if(data.error){
//             throw new Error(data.error);
//         }
//     })

//   };

//   return <div>useSignup</div>;
// };

// export default useSignup;
