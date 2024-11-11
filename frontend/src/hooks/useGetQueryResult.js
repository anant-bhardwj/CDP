import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGetQueryResult = () => {
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const executeQuery = async (query, selectedTable) => {
    if (!query.trim()) {
      setQueryError("Query cannot be empty.");
      return;
    }

    setQueryError(null);
    setQueryLoading(true);
    setQueryResult(null); // Reset previous results

    try {
      const response = await axios.post(
        "/api/query/run-query",
        { query, selectedTable },
        { headers: { "Content-Type": "application/json" } }
      );
      setQueryResult(response.data);
    } catch (error) {
      console.error("Query execution error:", error);
      if (error.response) {
        setQueryError(error.response.data.error || "Failed to execute query.");
        toast.error(error.response.data.error || "Failed to execute query.");
      } else {
        setQueryError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setQueryLoading(false);
    }
  };

  return { queryLoading, queryResult, queryError, executeQuery };
};

export default useGetQueryResult;
