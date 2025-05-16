'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const categories = [
  'Chinese',
  'Thai',
  'Japanese',
  'Mexican',
  'Italian',
  'Indian',
  'Desserts',
  'Brunch',
  'Vegan'
];

export default function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [''],
    instructions: [''],
    cookingTime: '',
    servings: '',
    category: [],
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

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory && !recipe.category.includes(selectedCategory)) {
      setRecipe(prev => ({
        ...prev,
        category: [...prev.category, selectedCategory]
      }));
    }
    // Reset the select value
    e.target.value = '';
  };

  const removeCategory = (categoryToRemove) => {
    setRecipe(prev => ({
      ...prev,
      category: prev.category.filter(cat => cat !== categoryToRemove)
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
      category: recipe.category.map(cat => cat.trim()).filter(cat => cat !== '')
    };

    if (!recipeData.name || recipeData.ingredients.length === 0 || recipeData.instructions.length === 0 || !recipeData.cookingTime || !recipeData.servings || recipeData.category.length === 0) {
      setError('Please fill in all required fields (Name, Ingredients, Instructions, Cooking Time, Servings, and at least one Category).');
      return;
    }

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error(data.error || 'Failed to add recipe');
      }

      if (data._id) {
        router.push(`/recipes/${data._id}`);
      } else {
        throw new Error('Failed to create recipe: No recipe ID returned');
      }
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
          <label htmlFor="category">Categories <span className={styles.required}>*</span></label>
          <select
            id="category"
            name="category"
            onChange={handleCategoryChange}
            className={styles.categorySelect}
            required={recipe.category.length === 0}
          >
            <option value="">Select a category</option>
            {categories
              .filter(category => !recipe.category.includes(category))
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
          <div className={styles.selectedCategories}>
            {recipe.category.map((category) => (
              <div key={category} className={styles.categoryTag}>
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className={styles.removeCategoryButton}
                  aria-label={`Remove ${category} category`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {recipe.category.length === 0 && (
            <small className={styles.helpText}>Please select at least one category</small>
          )}
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