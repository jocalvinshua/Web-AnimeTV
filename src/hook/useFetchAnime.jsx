import { useState, useEffect, useCallback } from 'react';

export const useFetchAnime = (endpoint, params = {}, delay = 0) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (abortController) => {
    if (!endpoint) return;
    
    setLoading(true);
    setError(null);

    const finalParams = {
      ...params,
      sfw: true,
    };

    const queryString = new URLSearchParams(finalParams).toString();
    const url = `https://api.jikan.moe/v4/${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const response = await fetch(url, { signal: abortController.signal });
      
      if (!response.ok) {
        if (response.status === 504) console.log("Server is taking too long to respond (504). Please try again.");
        if (response.status === 429) throw new Error("Too many requests (429). Please slow down.");
        throw new Error(`Error: ${response.status}`);
      }

      const json = await response.json();
      setData(json.data || []);
      setPagination(json.pagination || null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params), delay]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController);

    return () => abortController.abort();
  }, [fetchData]);

  return { data, pagination, loading, error };
};