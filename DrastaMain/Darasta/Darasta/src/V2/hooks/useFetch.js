import { useState, useEffect } from 'react';

const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();       // Create an AbortController
    const signal = controller.signal;               // Get the signal for fetch
  
    const fetchData = async () => {
      try {
        const fetchOptions = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          credentials: 'include',
          signal,                                    // Attach signal to fetch
          ...options,
        };
  
        const response = await fetch(url, fetchOptions);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const result = await response.json();
        setData(result);                            // Only runs if still mounted
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);                    // Ignore if it's a cancel
        }
      } finally {
        setLoading(false);                          // Don't update if aborted
      }
    };
  
    fetchData();
  
    return () => controller.abort();                // Cleanup: abort fetch on unmount
  }, [url, method, JSON.stringify(options), reload]);
  

  return { data, loading, error };
};

export default useFetch;

