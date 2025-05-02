'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  const searchParams = useSearchParams(); 
  const queryFromUrl = searchParams.get('q') || '';

  console.log('[RecipesPage] Rendered. queryFromUrl:', queryFromUrl, 'sortOption:', sortOption);

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
    console.log('[RecipesPage] useEffect triggered. queryFromUrl:', queryFromUrl);
    
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = queryFromUrl
          ? `/api/recipes?q=${encodeURIComponent(queryFromUrl)}`
          : '/api/recipes';
        console.log('[RecipesPage] Fetching URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        setError(err.message);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [queryFromUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      fetchRecipes(searchQuery);
    } else {
      fetchRecipes();
    }
  };

  const getSortedRecipes = () => {
    if (!recipes) return [];
    
    const sortableRecipes = [...recipes];

    switch (sortOption) {
      case 'rating':
        sortableRecipes.sort((a, b) => {
          const avgA = a.reviews && a.reviews.length > 0 ? a.reviews.reduce((s, r) => s + r, 0) / a.reviews.length : 0;
          const avgB = b.reviews && b.reviews.length > 0 ? b.reviews.reduce((s, r) => s + r, 0) / b.reviews.length : 0;
          return avgB - avgA;
        });
        break;
      case 'reviews':
        sortableRecipes.sort((a, b) => {
          const countA = a.reviews ? a.reviews.length : 0;
          const countB = b.reviews ? b.reviews.length : 0;
          return countB - countA;
        });
        break;
      case 'cookingTime':
        sortableRecipes.sort((a, b) => a.cookingTime - b.cookingTime);
        break;
      case 'default':
      default:
        break;
    }
    return sortableRecipes;
  };

  const sortedRecipes = getSortedRecipes();

  if (loading && !isSearching) {
    return <div className={styles.loading}>Loading recipes...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      {queryFromUrl ? (
        <h1 className={styles.title}>Search Results for "{queryFromUrl}"</h1>
      ) : (
        <h1 className={styles.title}>All Recipes</h1>
      )}

      <div className={styles.sortContainer}>
        <label htmlFor="sort-select">Sort by: </label>
        <select 
          id="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="default">Default</option>
          <option value="rating">Rating (High to Low)</option>
          <option value="reviews">Reviews (Most to Fewest)</option>
          <option value="cookingTime">Cooking Time (Shortest)</option>
        </select>
      </div>
      
      <div className={styles.recipeGrid}>
        {sortedRecipes.length === 0 ? (
          <div className={styles.noResults}>
            {queryFromUrl 
              ? `No recipes found matching "${queryFromUrl}".` 
              : 'No recipes available.'
            }
          </div>
        ) : (
          sortedRecipes.map((recipe) => {
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