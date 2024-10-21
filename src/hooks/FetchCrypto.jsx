import { useEffect, useState } from "react";
import axios from "axios";

export default function FetchCrypto(url, option = {}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsync = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Adding a 1-second delay
        const response = await axios({
          url,
          method: "GET",
          ...option,
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchAsync();
  }, [url]);

  return { loading, data, error };
}