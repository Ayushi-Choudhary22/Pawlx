import { FiStar } from 'react-icons/fi';

const Rating = ({ value = 0, count, size = 14, editable = false, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => editable && onChange?.(star)}
          className={editable ? 'cursor-pointer' : 'cursor-default'}
        >
          <FiStar
            size={size}
            className={star <= Math.round(value) ? 'fill-accent text-accent' : 'text-border'}
          />
        </button>
      ))}
      {count !== undefined && <span className="text-xs text-ink-muted ml-1">({count})</span>}
    </div>
  );
};

export default Rating;
