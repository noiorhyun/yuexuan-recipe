'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [''],
    instructions: [''],
    cookingTime: '',
    servings: '',
    category: '',
    imageUrl: '',
    videoUrl: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setRecipe(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const addArrayItem = (field) => {
    setRecipe(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setRecipe(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const recipeData = {
      ...recipe,
      cookingTime: parseInt(recipe.cookingTime, 10) || 0,
      servings: parseInt(recipe.servings, 10) || 0,
      ingredients: recipe.ingredients.filter(item => item.trim() !== ''),
      instructions: recipe.instructions.filter(item => item.trim() !== ''),
      category: recipe.category.split(',').map(cat => cat.trim()).filter(cat => cat !== '')
    };

    if (!recipeData.name || recipeData.ingredients.length === 0 || recipeData.instructions.length === 0 || !recipeData.cookingTime || !recipeData.servings) {
      setError('Please fill in all required fields (Name, Ingredients, Instructions, Cooking Time, Servings).');
      return;
    }

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add recipe');
      }

      router.push('/recipes');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add New Recipe</h1>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imageUrl">Image URL (Optional)</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="videoUrl">Video URL (Optional)</label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={recipe.videoUrl}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Categories (Optional, comma-separated)</label>
          <input
            type="text"
            id="category"
            name="category"
            value={recipe.category}
            onChange={handleInputChange}
            placeholder="e.g., Dinner, Quick, Chinese"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className={styles.arrayItem}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeArrayItem('ingredients', index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('ingredients')}
            className={styles.addButton}
          >
            Add Ingredient
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>Instructions</label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className={styles.arrayItem}>
              <textarea
                value={instruction}
                onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                rows={3}
              />
              <button
                type="button"
                onClick={() => removeArrayItem('instructions', index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('instructions')}
            className={styles.addButton}
          >
            Add Step
          </button>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="servings">Number of Servings</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={recipe.servings}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Add Recipe
          </button>
          <button
            type="button"
            onClick={() => router.push('/recipes')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 