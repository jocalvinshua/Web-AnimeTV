import { useState, useEffect, useCallback } from 'react';

export const useFetchAnime = (endpoint, params = {}, delay = 0) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mengubah object params menjadi string query (ex: ?limit=5&q=naruto)
  const queryString = new URLSearchParams(params).toString();
  const url = `https://api.jikan.moe/v4/${endpoint}${queryString ? `?${queryString}` : ''}`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      setData(json.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Jikan Hook Error:", err);
    } finally {
      setLoading(false);
    }
  }, [url, delay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};