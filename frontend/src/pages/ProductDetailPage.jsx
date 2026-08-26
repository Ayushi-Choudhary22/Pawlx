import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowLeft } from 'react-icons/fi';
import { productService, cartService, wishlistService } from '@/services/marketplaceService';
import { useToast } from '@/context/ToastContext';
import Rating from '@/components/common/Rating';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import ReviewsSection from '@/components/common/ReviewsSection';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    productService
      .getBySlug(slug)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/marketplace'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    try {
      await cartService.addItem(product._id, quantity);
      showToast('Added to cart', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Please log in first', 'error');
    }
  };

  const handleWishlist = async () => {
    try {
      await wishlistService.toggle(product._id);
      showToast('Wishlist updated', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Please log in first', 'error');
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  const price = product.discountPrice || product.price;
  const images = product.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=700&q=80' }];

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6"
      >
        <FiArrowLeft size={14} /> Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="rounded-card overflow-hidden bg-surface h-96 mb-3">
            <img src={images[activeImage].url} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 rounded-lg overflow-hidden border-2 ${
                    activeImage === i ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs text-primary font-medium uppercase tracking-wide">
            {product.category?.name}
          </span>
          <h1 className="text-2xl font-bold text-ink mt-1 mb-2">{product.name}</h1>
          <Rating value={product.rating} count={product.totalReviews} />

          <div className="flex items-baseline gap-2 mt-4 mb-5">
            <span className="text-2xl font-bold text-ink">₹{price}</span>
            {product.discountPrice && (
              <span className="text-base text-ink-muted line-through">₹{product.price}</span>
            )}
          </div>

          <p className="text-sm text-ink-muted leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-ink-muted">
                −
              </button>
              <span className="px-4 text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 text-ink-muted">
                +
              </button>
            </div>
            <span className="text-xs text-ink-muted">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              icon={<FiShoppingCart size={16} />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            <Button variant="outline" icon={<FiHeart size={16} />} onClick={handleWishlist}>
              Wishlist
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-2xl">
        <ReviewsSection targetType="product" targetId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
