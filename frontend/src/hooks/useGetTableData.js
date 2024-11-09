import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGetTableData = () => {
  const [tableData, setTableData] = useState({ schema: null, preview: null });
  const [loading, setLoading] = useState(false);

  const getTableData = async (tableName) => {
    setLoading(true);
    axios
      .post(
        "api/query/table-info",
        { tableName },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        const data = response.data;

        if (data.error) {
          throw new Error(data.error);
        }

        setTableData({ schema: data.schema, preview: data.rows });
        toast.success("Table data loaded successfully");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error status: ", error.response.status);
          console.error("Error response data: ", error.response.data);
          toast.error(
            error.response.data.error || "Failed to fetch table data"
          );
        } else {
          console.error("Error: ", error.message);
          toast.error("An unexpected error occured");
        }

        setTableData({ schema: null, preview: null });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { tableData, getTableData, loading };
};

export default useGetTableData;
