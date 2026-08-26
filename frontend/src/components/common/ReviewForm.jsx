import { useState } from 'react';
import Rating from '@/components/common/Rating';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { reviewService } from '@/services/reviewService';

/**
 * Reusable review submission form. Works for any review target
 * (product, veterinarian, pet_sitter, groomer) — just pass targetType + targetId.
 */
const ReviewForm = ({ targetType, targetId, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to leave a review', 'info');
      return;
    }
    if (rating === 0) {
      showToast('Please select a star rating', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.create({ targetType, targetId, rating, comment });
      showToast('Review submitted, thank you!', 'success');
      setRating(0);
      setComment('');
      onSubmitted?.();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-3">
      <div>
        <label className="label mb-1">Your rating</label>
        <Rating value={rating} editable onChange={setRating} size={20} />
      </div>
      <div>
        <label className="label">Your review</label>
        <textarea
          rows={3}
          className="input resize-none"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <Button type="submit" size="sm" isLoading={isSubmitting}>
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;
