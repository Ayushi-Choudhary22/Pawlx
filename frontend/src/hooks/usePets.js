import { useCallback, useEffect, useState } from 'react';
import { petService } from '@/services/petService';
import { useToast } from '@/context/ToastContext';

/**
 * Centralizes pet list fetching + CRUD so pages don't duplicate
 * loading/error state handling.
 */
export const usePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await petService.getMyPets();
      setPets(res.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load pets', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const addPet = async (payload) => {
    const res = await petService.createPet(payload);
    setPets((prev) => [res.data, ...prev]);
    return res.data;
  };

  const editPet = async (id, payload) => {
    const res = await petService.updatePet(id, payload);
    setPets((prev) => prev.map((p) => (p._id === id ? res.data : p)));
    return res.data;
  };

  const removePet = async (id) => {
    await petService.deletePet(id);
    setPets((prev) => prev.filter((p) => p._id !== id));
  };

  return { pets, loading, fetchPets, addPet, editPet, removePet };
};
