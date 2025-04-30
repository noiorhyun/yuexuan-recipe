'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StarRating from '../../../components/StarRating';
import styles from './page.module.css';

export default function RecipeDetailPage() {
  const params = useParams();
  const { id } = params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingError, setRatingError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Recipe not found');
          } else {
            throw new Error('Failed to fetch recipe details');
          }
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleRatingSubmit = async (newRating) => {
    if (!id || !recipe) return false;
    setRatingError('');

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRating: newRating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API Error');
      }

      const updatedRecipe = await response.json();
      setRecipe(updatedRecipe);
      setRatingError('');
      return true;

    } catch (err) {
      console.error("Rating submission failed:", err);
      setRatingError(err.message || 'Could not submit rating.');
      return false;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading recipe details...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>Error: {error}</p>
        <Link href="/recipes" className={styles.backLink}>Back to Recipes</Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>Recipe data could not be loaded.</p>
        <Link href="/recipes" className={styles.backLink}>Back to Recipes</Link>
      </div>
    );
  }

  const averageReview = recipe.reviews && recipe.reviews.length > 0
    ? (recipe.reviews.reduce((sum, rating) => sum + rating, 0) / recipe.reviews.length).toFixed(1)
    : null;
  const reviewCount = recipe.reviews ? recipe.reviews.length : 0;

  return (
    <div className={styles.container}>
      <Link href="/recipes" className={styles.backLink}>&larr; Back to Recipes</Link>
      
      <h1 className={styles.recipeName}>{recipe.name}</h1>
      
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.name} className={styles.recipeImage} />
      )}

      <div className={styles.metaInfo}>
        {recipe.category && recipe.category.length > 0 && (
          <div className={styles.categories}>
            <strong>Categories:</strong> 
            {recipe.category.map((cat, index) => (
              <span key={index} className={styles.categoryTag}>{cat}</span>
            ))}
          </div>
        )}
        <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <div className={styles.ratingDisplay}>
          {reviewCount > 0 ? (
            <p>
              <strong>Rating:</strong> {averageReview} / 5 ({reviewCount} reviews)
            </p>
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </div>

      <StarRating recipeId={id} onRatingSubmit={handleRatingSubmit} />
      {ratingError && <p className={styles.ratingError}>{ratingError}</p>}

      <div className={styles.contentColumns}>
        <div className={styles.ingredientsSection}>
          <h2>Ingredients</h2>
          <ul className={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className={styles.instructionsSection}>
          <h2>Instructions</h2>
          <ol className={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
} 