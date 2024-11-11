import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGetTableNames = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTableNames = useCallback(async () => {
    console.log("Fetching table names in the hook");
    setLoading(true);
    try {
      const response = await axios.get("api/query/dataset-info", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.tables) {
        console.log("Fetched tables: ", response.data.tables);
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
  }, []);

  useEffect(() => {
    getTableNames();
  }, [getTableNames]);

  return { tables, loading, refreshTables: getTableNames };
};

export default useGetTableNames;
