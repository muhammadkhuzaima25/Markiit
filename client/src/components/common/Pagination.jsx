import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-border bg-white text-charcoal hover:bg-neutral disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <FiChevronLeft size={18} />
      </button>
      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
            page === currentPage
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-charcoal border-border hover:bg-neutral'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-border bg-white text-charcoal hover:bg-neutral disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
