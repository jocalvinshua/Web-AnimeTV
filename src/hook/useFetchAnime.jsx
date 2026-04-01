// src/hook/useFetchAnime.js
import { useState, useEffect, useCallback } from 'react';

export const useFetchAnime = (endpoint, params = {}, delay = 0) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    
    setLoading(true);
    setData([]);

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

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const json = await response.json();
      setData(json.data || []);
      setPagination(json.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params), delay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, pagination, loading, error };
};