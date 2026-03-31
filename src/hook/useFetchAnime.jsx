import { useState, useEffect, useCallback } from 'react';

export const useFetchAnime = (endpoint, params = {}, delay = 0) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryString = new URLSearchParams(params).toString();
  const url = `https://api.jikan.moe/v4/${endpoint}${queryString ? `?${queryString}` : ''}`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData([]);

    try {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const json = await response.json();
      
      setData(json.data || []);
      setPagination(json.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, delay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data, pagination, loading, error, refetch: fetchData };
};