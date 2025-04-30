'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchRecipes = async (query = '') => {
    try {
      const url = query 
        ? `/api/recipes/search?q=${encodeURIComponent(query)}`
        : '/api/recipes';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      fetchRecipes(searchQuery);
    } else {
      fetchRecipes();
    }
  };

  if (loading && !isSearching) {
    return <div className={styles.loading}>Loading recipes...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Recipes</h1>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
      
      <div className={styles.recipeGrid}>
        {recipes.length === 0 ? (
          <div className={styles.noResults}>
            {isSearching ? 'No recipes found matching your search.' : 'No recipes available.'}
          </div>
        ) : (
          recipes.map((recipe) => {
            // Calculate average review score
            const averageReview = recipe.reviews && recipe.reviews.length > 0
              ? (recipe.reviews.reduce((sum, rating) => sum + rating, 0) / recipe.reviews.length).toFixed(1)
              : null;
            const reviewCount = recipe.reviews ? recipe.reviews.length : 0;

            return (
              <Link key={recipe._id} href={`/recipes/${recipe._id}`} className={styles.cardLink}>
                <div className={styles.recipeCard}>
                  {recipe.imageUrl && (
                    <img src={recipe.imageUrl} alt={recipe.name} className={styles.recipeImage} />
                  )}
                  <div className={styles.cardContent}>
                    <h2 className={styles.recipeName}>{recipe.name}</h2>
                    <div className={styles.recipeDetails}>
                      {reviewCount > 0 ? (
                        <p>
                          <strong>Rating:</strong> {averageReview} / 5 
                          <span className={styles.reviewCount}>({reviewCount} reviews)</span>
                        </p>
                      ) : (
                        <p>No reviews yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
} 