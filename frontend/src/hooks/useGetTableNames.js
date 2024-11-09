import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGetTableNames = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTableNames = async () => {
      try {
        const response = await axios.get("api/query/dataset-info", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.tables) {
          setTables(response.data.tables);
        } else {
          console.log("No tables found");
          toast.error("No tables found");
        }
      } catch (error) {
        console.error("Error in fetching tables: ", error);
        toast.error("Error in fetching tables");
      } finally {
        setLoading(false);
      }
    };

    getTableNames();
  }, []);

  return { tables, loading };
};

export default useGetTableNames;
