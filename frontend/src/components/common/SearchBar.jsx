import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10"
      />
    </div>
  );
};

export default SearchBar;
