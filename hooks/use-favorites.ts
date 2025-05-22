import { useState, useEffect } from 'react';
import { NewsArticle } from "@/lib/newsapi";

export type FavoriteArticle = NewsArticle & {
  addedAt: string;
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem('news-favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('news-favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

  // Check if an article is in favorites
  const isFavorite = (articleUrl: string): boolean => {
    return favorites.some(fav => fav.url === articleUrl);
  };

  // Add an article to favorites
  const addToFavorites = (article: NewsArticle): void => {
    if (!isFavorite(article.url)) {
      const favoriteArticle: FavoriteArticle = {
        ...article,
        addedAt: new Date().toISOString()
      };
      setFavorites(prev => [...prev, favoriteArticle]);
    }
  };

  // Remove an article from favorites
  const removeFromFavorites = (articleUrl: string): void => {
    setFavorites(prev => prev.filter(article => article.url !== articleUrl));
  };

  // Toggle favorite status
  const toggleFavorite = (article: NewsArticle): void => {
    if (isFavorite(article.url)) {
      removeFromFavorites(article.url);
    } else {
      addToFavorites(article);
    }
  };

  // Get all favorites
  const getFavorites = (): FavoriteArticle[] => {
    return favorites;
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavorites
  };
};