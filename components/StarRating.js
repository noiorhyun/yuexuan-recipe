'use client';

import { useState } from 'react';
import styles from './StarRating.module.css';

const StarRating = ({ totalStars = 5, recipeId, onRatingSubmit }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(0); // Could be initialized with user's previous rating if available
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleMouseOver = (rating) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = async (rating) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitMessage('');
    setCurrentRating(rating); // Visually update immediately

    try {
      const success = await onRatingSubmit(rating); // Call the callback passed from the parent
      if (success) {
        setSubmitMessage('Rating submitted successfully!');
        // Optionally disable further rating for this session
      } else {
        setSubmitMessage('Failed to submit rating. Please try again.');
        setCurrentRating(0); // Revert visual update on failure
      }
    } catch (error) { 
      console.error("Rating submission error:", error);
      setSubmitMessage('An error occurred. Please try again.');
      setCurrentRating(0); // Revert visual update on error
    } finally {
      setIsSubmitting(false);
      // Hide message after a delay
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  return (
    <div className={styles.starRatingContainer}>
      <h4>Rate this recipe:</h4>
      <div className={styles.starsWrapper}>
        {[...Array(totalStars)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <span
              key={ratingValue}
              className={`${styles.star} ${
                ratingValue <= (hoverRating || currentRating)
                  ? styles.filled
                  : styles.empty
              }`}
              onMouseOver={() => handleMouseOver(ratingValue)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(ratingValue)}
              style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              ★
            </span>
          );
        })}
      </div>
      {submitMessage && <p className={styles.submitMessage}>{submitMessage}</p>}
    </div>
  );
};

export default StarRating; 