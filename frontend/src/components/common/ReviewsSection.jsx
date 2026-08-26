import { useCallback, useEffect, useState } from 'react';
import { reviewService } from '@/services/reviewService';
import ReviewForm from '@/components/common/ReviewForm';
import ReviewList from '@/components/common/ReviewList';
import Loader from '@/components/common/Loader';

/**
 * Self-contained reviews block: fetches reviews for the given target,
 * renders the list, and lets the logged-in user submit their own.
 * Usage: <ReviewsSection targetType="product" targetId={product._id} />
 */
const ReviewsSection = ({ targetType, targetId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewService.getForTarget(targetType, targetId);
      setReviews(res.data);
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink">
          Reviews {reviews.length > 0 && <span className="text-ink-muted font-normal">({reviews.length})</span>}
        </h3>
        {avgRating && (
          <span className="text-sm text-ink-muted">
            <span className="font-semibold text-ink">{avgRating}</span> / 5 average
          </span>
        )}
      </div>

      <div className="mb-6">
        <ReviewForm targetType={targetType} targetId={targetId} onSubmitted={fetchReviews} />
      </div>

      {loading ? <Loader /> : <ReviewList reviews={reviews} />}
    </div>
  );
};

export default ReviewsSection;
