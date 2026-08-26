import { useEffect, useState } from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { productService } from '@/services/marketplaceService';
import ProductCard from '@/components/marketplace/ProductCard';
import ProductFilters from '@/components/marketplace/ProductFilters';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonLoader';

const DUMMY_PRODUCTS = [
  {
    _id: 'dummy1',
    name: 'Premium Organic Grain-Free Dog Kibble',
    slug: 'premium-organic-grain-free-dog-kibble',
    description: 'High-quality organic dog food designed for active breeds.',
    price: 1299,
    discountPrice: 1099,
    rating: 4.8,
    totalReviews: 24,
    images: [{ url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&q=80' }],
    petType: ['dog'],
    stock: 50,
  },
  {
    _id: 'dummy2',
    name: 'Salmon & Wild Rice Natural Cat Food',
    slug: 'salmon-wild-rice-natural-cat-food',
    description: 'Delectable salmon kibble with rice to support healthy skin and coat.',
    price: 899,
    rating: 4.6,
    totalReviews: 18,
    images: [{ url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80' }],
    petType: ['cat'],
    stock: 35,
  },
  {
    _id: 'dummy3',
    name: 'Orthopedic memory foam plush dog bed',
    slug: 'orthopedic-memory-foam-plush-dog-bed',
    description: 'Orthopedic foam base that contours to your pet’s body for ultimate comfort.',
    price: 2199,
    discountPrice: 1799,
    rating: 4.9,
    totalReviews: 32,
    images: [{ url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80' }],
    petType: ['dog'],
    stock: 12,
  },
  {
    _id: 'dummy4',
    name: 'Interactive Treat Dispenser Feeder Toy',
    slug: 'interactive-treat-dispenser-feeder-toy',
    description: 'Stimulate your pet’s brain and reward them with treats while playing.',
    price: 349,
    rating: 4.5,
    totalReviews: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1601758064878-06fa1d1a3c07?w=600&q=80' }],
    petType: ['dog'],
    stock: 80,
  },
  {
    _id: 'dummy5',
    name: 'Adjustable Heavy-Duty Nylon Collar',
    slug: 'adjustable-heavy-duty-nylon-collar',
    description: 'Soft and breathable padded collar perfect for daily walks.',
    price: 299,
    rating: 4.4,
    totalReviews: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&q=80' }],
    petType: ['dog', 'cat'],
    stock: 60,
  },
  {
    _id: 'dummy6',
    name: 'Luxury Travel Carrier Backpack',
    slug: 'luxury-travel-carrier-backpack',
    description: 'Comfortable backpack carrier with mesh panels for airflow.',
    price: 1899,
    rating: 4.7,
    totalReviews: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80' }],
    petType: ['cat', 'rabbit'],
    stock: 15,
  }
];

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.list({ ...filters, search, page });
        setProducts(res.data.products);
        setPages(res.data.pages);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [filters, search, page]);

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink mb-1">Marketplace</h1>
        <p className="text-sm text-ink-muted">Everything your pet needs, curated and delivered.</p>
      </div>

      <SearchBar
        value={search}
        onChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search for food, toys, accessories..."
        className="mb-6 max-w-md"
      />

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <ProductFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />

        <div>
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-6">
                <strong>Dummy Products Active:</strong> No live products are currently loaded in the database. Below are dummy shop products for demonstration.
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {DUMMY_PRODUCTS.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
