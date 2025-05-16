'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/my-recipes', {
          credentials: 'include'
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, [router]);

  if (loading) {
    return <div className={styles.loading}>Loading your recipes...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>{error}</p>
        <Link href="/profile" className={styles.backLink}>Back to Profile</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Recipes</h1>
        <Link href="/recipes/add" className={styles.createButton}>
          Create New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't published any recipes yet.</p>
          <Link href="/recipes/add" className={styles.createButton}>
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div className={styles.recipesGrid}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.recipeCard}>
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className={styles.recipeImage}
                />
              )}
              <div className={styles.recipeContent}>
                <h2 className={styles.recipeName}>{recipe.name}</h2>
                <div className={styles.recipeMeta}>
                  <span>Cooking Time: {recipe.cookingTime} mins</span>
                  <span>Servings: {recipe.servings}</span>
                </div>
                {recipe.category && recipe.category.length > 0 && (
                  <div className={styles.categories}>
                    {recipe.category.map((cat, index) => (
                      <span key={index} className={styles.categoryTag}>
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.recipeActions}>
                  <Link
                    href={`/recipes/${recipe._id}`}
                    className={styles.viewButton}
                  >
                    View Recipe
                  </Link>
                  <Link
                    href={`/recipes/edit/${recipe._id}`}
                    className={styles.editButton}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 