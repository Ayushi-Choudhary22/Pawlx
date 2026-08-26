import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import Rating from '@/components/common/Rating';
import { useToast } from '@/context/ToastContext';
import { cartService, wishlistService } from '@/services/marketplaceService';

const ProductCard = ({ product }) => {
  const { showToast } = useToast();
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await cartService.addItem(product._id, 1);
      showToast('Added to cart', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Please log in first', 'error');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    try {
      await wishlistService.toggle(product._id);
      showToast('Wishlist updated', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Please log in first', 'error');
    }
  };

  return (
    <Link to={`/marketplace/${product.slug}`} className="card overflow-hidden group block">
      <div className="relative h-40 bg-surface overflow-hidden">
        <img
          src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80'}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:text-accent transition-colors"
        >
          <FiHeart size={15} />
        </button>
      </div>
      <div className="p-3.5">
        <h3 className="text-sm font-medium text-ink truncate">{product.name}</h3>
        <Rating value={product.rating} count={product.totalReviews} size={12} />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-ink text-sm">₹{price}</span>
            {hasDiscount && (
              <span className="text-xs text-ink-muted line-through">₹{product.price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="h-8 w-8 rounded-lg bg-primary-light text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          >
            <FiShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
