'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
// Import styles from the main recipes page for the cards
import recipeListStyles from '../../recipes/page.module.css'; 
// Import styles specific to this page (optional, for title etc.)
import categoryStyles from './page.module.css'; 

export default function CategoryDetailPage() {
  const params = useParams();
  // Decode the category name from the URL
  const categoryName = params.categoryName ? decodeURIComponent(params.categoryName) : null;
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryName) {
      setError('Category name not found in URL.');
      setLoading(false);
      return;
    }

    const fetchRecipesByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch recipes using the API endpoint with the category query parameter
        const response = await fetch(`/api/recipes?category=${encodeURIComponent(categoryName)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipes for this category');
        }
        const data = await response.json();
        setRecipes(data.recipes || []); // Ensure recipes is always an array
      } catch (err) {
        setError(err.message);
        setRecipes([]); // Clear recipes on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesByCategory();
  }, [categoryName]); // Re-run effect if categoryName changes

  // Capitalize the first letter for display
  const displayCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : 'Category';

  if (loading) {
    return <div className={recipeListStyles.loading}>Loading {displayCategoryName} recipes...</div>;
  }

  if (error) {
    return <div className={recipeListStyles.error}>Error: {error}</div>;
  }

  return (
    <div className={categoryStyles.container}> 
      <Link href="/categories" className={categoryStyles.backLink}>&larr; Back to Categories</Link>
      <h1 className={categoryStyles.title}>{displayCategoryName} Recipes</h1>

      {/* Reuse the recipe grid and card structure/styles from recipes page */}
      <div className={recipeListStyles.recipeGrid}>
        {recipes.length === 0 ? (
          <div className={recipeListStyles.noResults}>
            No recipes found in the {displayCategoryName} category.
          </div>
        ) : (
          recipes.map((recipe) => {
            // Calculate average review and count
            const averageReview = recipe.reviews && recipe.reviews.length > 0
              ? (recipe.reviews.reduce((sum, rating) => sum + rating, 0) / recipe.reviews.length).toFixed(1)
              : null;
            const reviewCount = recipe.reviews ? recipe.reviews.length : 0;

            // Link to the individual recipe detail page
            return (
              <Link key={recipe._id} href={`/recipes/${recipe._id}`} className={recipeListStyles.cardLink}>
                <div className={recipeListStyles.recipeCard}>
                  {recipe.imageUrl && (
                    <img src={recipe.imageUrl} alt={recipe.name} className={recipeListStyles.recipeImage} />
                  )}
                  <div className={recipeListStyles.cardContent}>
                    <h2 className={recipeListStyles.recipeName}>{recipe.name}</h2>
                    <div className={recipeListStyles.recipeDetails}>
                      {reviewCount > 0 ? (
                        <p>
                          <strong>Rating:</strong> {averageReview} / 5
                          <span className={recipeListStyles.reviewCount}>({reviewCount} reviews)</span>
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