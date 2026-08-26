import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-border hover:bg-surface disabled:opacity-40 disabled:pointer-events-none"
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage ? 'bg-primary text-white' : 'text-ink hover:bg-surface'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-border hover:bg-surface disabled:opacity-40 disabled:pointer-events-none"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
