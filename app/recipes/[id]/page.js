'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Helper function to get YouTube embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.substring(1);
    }
  } catch (error) {
    console.error("Error parsing video URL:", error);
    return null; // Not a valid URL or doesn't match expected formats
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const { id } = params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

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

  useEffect(() => {
    // Fetch current user info
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/profile');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      // Redirect to recipes page after successful deletion
      window.location.href = '/recipes';
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setReviewError('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || reviewRating === 0) {
      setReviewError('Please provide both a comment and a rating');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');

    try {
      // First, upload the image if one is selected
      let imageUrl = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Then submit the review with the image URL and rating
      const response = await fetch(`/api/recipes/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          comment: newReview.trim(),
          imageUrl,
          rating: reviewRating
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const updatedRecipe = await response.json();
      setRecipe(updatedRecipe);
      setNewReview('');
      setSelectedImage(null);
      setImagePreview(null);
      setReviewRating(0);
      setReviewError('');
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewIndex) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsDeletingReview(true);
    setDeleteError('');

    try {
      const response = await fetch(`/api/recipes/${id}/reviews`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewIndex }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }

      const updatedRecipe = await response.json();
      setRecipe(updatedRecipe);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeletingReview(false);
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

  // Calculate average rating and review count
  const validReviews = recipe.reviews ? recipe.reviews.filter(review => review.rating) : [];
  const reviewCount = validReviews.length;
  const averageReview = reviewCount > 0
    ? (validReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1)
    : '0.0';

  // Determine YouTube embed URL
  const videoEmbedUrl = getYouTubeEmbedUrl(recipe.videoUrl);

  return (
    <div className={styles.container}>
      <div className={styles.headerActions}>
        <Link href="/recipes" className={styles.backLink}>&larr; Back to Recipes</Link>
        <div className={styles.actionButtons}>
          <Link href={`/recipes/edit/${recipe._id}`} className={styles.editButton}>
            <FaEdit />
          </Link>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            disabled={isDeleting}
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <h1 className={styles.recipeName}>{recipe.name}</h1>
      
      {/* Conditionally render Video or Image */}
      {videoEmbedUrl ? (
        <div className={styles.videoContainer}>
          <iframe 
            className={styles.videoEmbed}
            src={videoEmbedUrl}
            title={`${recipe.name} Video`}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          ></iframe>
        </div>
      ) : recipe.imageUrl ? (
        <img src={recipe.imageUrl} alt={recipe.name} className={styles.recipeImage} />
      ) : null} 
      {/* If neither video nor image exists, nothing is rendered here */}

      <div className={styles.metaInfo}>
        {recipe.category && recipe.category.length > 0 && (
          <div className={styles.categories}>
            <strong>Categories:</strong> 
            {recipe.category.map((cat, index) => (
              <span key={index} className={styles.categoryTag}>{cat}</span>
            ))}
          </div>
        )}
        <p><strong>Author:</strong> {recipe.authorName}</p>
        <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <div className={styles.ratingDisplay}>
          {reviewCount > 0 ? (
            <p>
              <strong>Rating:</strong> {averageReview} / 5 ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </p>
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </div>

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

      {/* Reviews Section */}
      <div className={styles.reviewsSection}>
        <h2>Reviews</h2>
        
        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
          <div className={styles.ratingSection}>
            <label className={styles.ratingLabel}>Rate this recipe:</label>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={styles.starButton}
                >
                  {star <= reviewRating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your experience with this recipe..."
            className={styles.reviewInput}
            required
          />
          
          <div className={styles.imageUploadSection}>
            <label htmlFor="reviewImage" className={styles.imageUploadLabel}>
              {imagePreview ? 'Change Image' : 'Add Image (optional)'}
            </label>
            <input
              type="file"
              id="reviewImage"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.imageInput}
            />
            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className={styles.removeImageButton}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {reviewError && <p className={styles.reviewError}>{reviewError}</p>}
          <button
            type="submit"
            className={styles.submitReviewButton}
            disabled={isSubmittingReview || !newReview.trim() || reviewRating === 0}
          >
            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {/* Reviews List */}
        <div className={styles.reviewsList}>
          {recipe.reviews && recipe.reviews.length > 0 ? (
            recipe.reviews
              .filter(review => review.comment && review.comment.trim().length > 0)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((review, index) => (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewAuthor}>
                        {review.username || 'Anonymous'}
                      </span>
                      <span className={styles.reviewDate}>
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                      {review.rating && (
                        <div className={styles.reviewRating}>
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                      )}
                    </div>
                    {currentUser && review.username === currentUser.username && (
                      <button
                        onClick={() => handleDeleteReview(index)}
                        className={styles.deleteReviewButton}
                        disabled={isDeletingReview}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                  {review.imageUrl && (
                    <div className={styles.reviewImageContainer}>
                      <img 
                        src={review.imageUrl} 
                        alt="Review" 
                        className={styles.reviewImage}
                      />
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p className={styles.noReviews}>No reviews yet. Be the first to share your experience!</p>
          )}
          {deleteError && <p className={styles.reviewError}>{deleteError}</p>}
        </div>
      </div>
    </div>
  );
} 