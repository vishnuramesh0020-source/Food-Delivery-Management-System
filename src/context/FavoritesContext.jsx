import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const FavoritesContext = createContext(null);
const STORAGE_KEY_FAVORITES = 'biterate_favorites';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return stored ? JSON.parse(stored) : [1, 2]; // default favorites
    } catch (e) {
      console.error('Failed to load favorites', e);
      return [1, 2];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (foodItem) => {
    const id = foodItem.id;
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        toast.info(`Removed "${foodItem.name}" from favorites`);
        return prev.filter((favId) => favId !== id);
      } else {
        toast.success(`Saved "${foodItem.name}" to favorites ❤️`);
        return [...prev, id];
      }
    });
  };

  const isFavorite = (foodId) => {
    return favorites.includes(foodId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
