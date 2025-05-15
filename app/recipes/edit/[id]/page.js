'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ingredients: [''],
    instructions: [''],
    cookingTime: '',
    servings: '',
    category: [''],
    imageUrl: '',
    videoUrl: ''
  });

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }
        const data = await response.json();
        setRecipe(data);
        setFormData({
          name: data.name || '',
          ingredients: data.ingredients || [''],
          instructions: data.instructions || [''],
          cookingTime: data.cookingTime || '',
          servings: data.servings || '',
          category: data.category || [''],
          imageUrl: data.imageUrl || '',
          videoUrl: data.videoUrl || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update recipe');
      }

      // Redirect to recipe detail page after successful update
      router.push(`/recipes/${id}`);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading recipe details...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>Error: {error}</p>
        <Link href={`/recipes/${id}`} className={styles.backLink}>Back to Recipe</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/recipes/${id}`} className={styles.backLink}>&larr; Back to Recipe</Link>
        <h1>Edit Recipe</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className={styles.arrayInputGroup}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'ingredients')}
                required
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'ingredients')}
                className={styles.removeButton}
                disabled={formData.ingredients.length === 1}
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
          {formData.instructions.map((instruction, index) => (
            <div key={index} className={styles.arrayInputGroup}>
              <textarea
                value={instruction}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'instructions')}
                required
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'instructions')}
                className={styles.removeButton}
                disabled={formData.instructions.length === 1}
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
          <label>Categories</label>
          {formData.category.map((cat, index) => (
            <div key={index} className={styles.arrayInputGroup}>
              <input
                type="text"
                value={cat}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'category')}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'category')}
                className={styles.removeButton}
                disabled={formData.category.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('category')}
            className={styles.addButton}
          >
            Add Category
          </button>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="cookingTime">Cooking Time (minutes)</label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="servings">Servings</label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="videoUrl">Video URL (YouTube)</label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/recipes/${id}`} className={styles.cancelButton}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
} 