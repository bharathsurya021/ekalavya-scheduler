import { useState, useEffect } from 'react';
import { getCollectionById } from '../api/collections';

const useFetchCollectionById = (collectionId, token) => {
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionId) {
      setLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        setLoading(true);
        const data = await getCollectionById(collectionId, token);
        setCollection(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId]);

  return { collection, loading, error };
};

export default useFetchCollectionById;
