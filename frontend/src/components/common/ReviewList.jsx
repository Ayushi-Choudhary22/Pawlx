import { useState } from 'react';
import { FiThumbsUp } from 'react-icons/fi';
import Rating from '@/components/common/Rating';
import EmptyState from '@/components/common/EmptyState';
import { reviewService } from '@/services/reviewService';

const ReviewList = ({ reviews, onHelpfulMarked }) => {
  const [markedIds, setMarkedIds] = useState(new Set());

  const handleHelpful = async (id) => {
    if (markedIds.has(id)) return;
    try {
      await reviewService.markHelpful(id);
      setMarkedIds((prev) => new Set(prev).add(id));
      onHelpfulMarked?.(id);
    } catch (error) {
      // Silently ignore — non-critical action
    }
  };

  if (reviews.length === 0) {
    return <EmptyState title="No reviews yet" description="Be the first to share your experience." />;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            {review.user?.avatar?.url ? (
              <img src={review.user.avatar.url} alt={review.user.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold">
                {review.user?.name?.[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-ink">{review.user?.name}</p>
              <Rating value={review.rating} size={11} />
            </div>
            <span className="text-xs text-ink-muted ml-auto">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          {review.comment && <p className="text-sm text-ink-muted leading-relaxed mb-2">{review.comment}</p>}

          <button
            onClick={() => handleHelpful(review._id)}
            disabled={markedIds.has(review._id)}
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-primary disabled:text-primary transition-colors"
          >
            <FiThumbsUp size={12} />
            Helpful {markedIds.has(review._id) ? review.helpfulCount + 1 : review.helpfulCount > 0 ? `(${review.helpfulCount})` : ''}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
