import { useEffect, useState } from "react";
import axios from "axios";

export default function FetchCrypto(url, option) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsync = async () => {
      try {
        // const response = await fetch(url, {
        //   method: "GET",
        //   headers: {
        //     // "Access-Control-Allow-Origin": "http://localhost:5173",
        //     // Accept: "application/json", // Optional, but recommended
        //   },
        //   // mode: "no-cors", // Disables CORS
        //   ...option,
        // });

        // // response
        // //   .json()
        // //   .then((data) => {
        // //     setData(data);
        // //     setLoading(false);
        // //   })
        // //   .catch((err) => {
        // //     throw err;
        // //   });
        // const responseData = await response.json();
        // setData(responseData);
        const response = await axios({
          url,
          method: "GET",
          headers: {
            // "Access-Control-Allow-Origin": "http://localhost:5173",
            // Accept: "application/json", // Optional, but recommended
          },
          // mode: "no-cors", // Disables CORS
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
