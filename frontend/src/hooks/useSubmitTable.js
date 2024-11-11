import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const useSubmitTable = () => {
  const [loading, setLoading] = useState(false);

  const submitTable = async (newTable, file) => {
    const success = handleInputErrors(newTable, file);

    if (!success) return;

    const formData = new FormData();
    formData.append("tableName", newTable);
    formData.append("csvFile", file);

    setLoading(true);
    axios
      .post("api/query/upload-table", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        const data = response;

        if (data.error) {
          throw new Error(data.error);
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.error("Error status: ", error.response.status);
          console.error("Error response data: ", error.response.data);
          toast.error(error.response.data.error || "Table creation failed");
        } else {
          console.error("Error:", error.message);
          toast.error("An unexpected error occurred");
        }
      })
      .finally(function () {
        setLoading(false);
      });
  };
  return { loading, submitTable };
};

export default useSubmitTable;

function handleInputErrors(newTable, file) {
  if (!newTable || !file) {
    toast.error("Please fill all the fields");
    return false;
  }
  return true;
}
