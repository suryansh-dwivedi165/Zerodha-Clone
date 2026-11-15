import { useEffect, useState } from "react";
import apiClient from "./api";

const useApiData = (endpoint, refreshKey = 0) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await apiClient.get(endpoint, {
          signal: controller.signal,
        });

        if (!Array.isArray(response.data)) {
          throw new Error(`Invalid response from ${endpoint}`);
        }

        setData(response.data);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          setError(`Unable to load data from ${endpoint}. Check the backend connection and try again.`);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [endpoint, refreshKey]);

  return { data, isLoading, error };
};

export default useApiData;
