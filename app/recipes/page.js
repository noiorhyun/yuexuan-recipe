'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading recipes...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Recipes</h1>
      <div className={styles.recipeGrid}>
        {recipes.map((recipe) => (
          <div key={recipe._id} className={styles.recipeCard}>
            <h2 className={styles.recipeName}>{recipe.name}</h2>
            <div className={styles.recipeDetails}>
              <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>
            </div>
            <div className={styles.recipeContent}>
              <h3>Ingredients</h3>
              <ul className={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h3>Instructions</h3>
              <ol className={styles.instructionsList}>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 