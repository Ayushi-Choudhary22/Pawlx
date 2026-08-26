const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const petCareRoutes = require('./routes/petCareRoutes');
const vetRoutes = require('./routes/vetRoutes');
const groomingRoutes = require('./routes/groomingRoutes');
const petSitterRoutes = require('./routes/petSitterRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const temporaryAdoptionRoutes = require('./routes/temporaryAdoptionRoutes');

const app = express();

// ---------- Global Middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---------- Health Check ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'PAWLX API is running' });
});

// ---------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/pets', petCareRoutes); // nested: /api/pets/:petId/vaccinations etc.
app.use('/api/vets', vetRoutes);
app.use('/api/grooming', groomingRoutes);
app.use('/api/petsitters', petSitterRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/temporary-adoption', temporaryAdoptionRoutes);

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
