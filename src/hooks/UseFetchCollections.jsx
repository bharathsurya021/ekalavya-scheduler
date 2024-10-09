import { useState, useEffect } from 'react';
import { getCollections } from '../api/collections';

const useFetchCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);
  const onDelete = async (collectionName) => {
    setCollections((prev) => prev.filter(col => col.collection_name !== collectionName));

  };
  return { collections, loading, error, onDelete };
};

export default useFetchCollections;
