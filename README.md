# PAWLX 🐾 — Modern B2C Pet Care Ecosystem

[![Website Status](https://img.shields.io/badge/Status-Live%20Online-success?style=for-the-badge)](https://pawlx-xfoa.vercel.app/)
[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://pawlx-xfoa.vercel.app/)
[![Backend Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://pawlx-backend.onrender.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://cloud.mongodb.com/)

> **🌐 Live Website**: [**https://pawlx-xfoa.vercel.app/**](https://pawlx-xfoa.vercel.app/)  
> **⚡ Backend API**: [**https://pawlx-backend.onrender.com**](https://pawlx-backend.onrender.com)  
> The application is **live and fully functional** with a production backend and cloud database! Real users can register, log in, browse, book services, and place orders.

---

## 🌟 Overview

**PAWLX** is an all-in-one pet ecosystem built on the **MERN** stack that connects pet owners with top-rated veterinary care, certified groomers, trusted pet sitters, an adoption and foster network, a curated pet marketplace, and an intelligent AI pet-care assistant.

---

## 🚀 Live Demo Credentials

You can create your own real account on the [Registration Page](https://pawlx-xfoa.vercel.app/register) or log in with any of these pre-seeded demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@pawlx.com` | `Password123!` |
| **Pet Owner** | `owner@pawlx.com` | `Password123!` |
| **Veterinarian** | `vet@pawlx.com` | `Password123!` |
| **Pet Sitter** | `sitter@pawlx.com` | `Password123!` |
| **Groomer** | `groomer@pawlx.com` | `Password123!` |

---

## ✨ Key Features

### 🐾 1. Pet Care & Digital Health Records
- **Multi-Pet Management**: Register multiple pets (dogs, cats, birds, rabbits, etc.) with detailed profiles (breed, age, gender, weight, photo).
- **Vaccination Logs**: Track vaccination history with due dates, batch numbers, and upcoming alerts.
- **Medicine & Prescriptions**: Maintain medication schedules, dosages, and frequency reminders.
- **Medical Records**: Digital storage for clinical visit summaries, allergies, and diagnostic notes.

### 🩺 2. Veterinary Care & Online Booking
- **Find Verified Vets**: Search veterinarians by city, specialization, rating, and consultation fee.
- **Appointment Scheduling**: Book in-clinic or video consultation time slots.
- **Real-Time Queue**: Track live queue numbers and appointment statuses (pending, confirmed, completed).

### ✂️ 3. Professional Grooming Services
- **Certified Groomers**: Browse certified groomers with transparent service packages (bath, breed styling, nail trim, spa).
- **Custom Time Slots**: Select preferred time slots with instant confirmation.

### 🏡 4. Trusted Pet Sitting & Boarding
- **Verified Sitters**: Explore background-verified pet sitters with reviews, experience, and pricing.
- **Cage-Free Boarding & Daycare**: Request home stays or daycare with custom dates and pet preferences.

### 🐶 5. Pet Adoption & Foster Care
- **Adoption Listings**: Browse pets looking for a loving home with search and filters (species, breed, location).
- **Adoption Applications**: Submit adoption applications directly to pet listers with full background details.
- **Temporary Adoption / Foster Network**: Sitter-needed and host-available matching for temporary care.
- **Post a Pet for Adoption**: Pet owners and shelters can list pets with medical history and vaccination status.

### 🛍️ 6. Curated Pet Marketplace
- **Product Catalog**: Explore pet food, supplements, toys, beds, collars, leashes, and accessories.
- **Advanced Filtering**: Filter by category, pet type (dog, cat, etc.), price range, and sort by rating or price.
- **Cart & Wishlist**: Real-time cart state management with discount calculations and item saving.
- **Order Management & Tracking**: Checkout system with address selection, stock deduction, and tracking history.
- **Ratings & Reviews**: Verified product reviews with star ratings.

### 🤖 7. AI Pet-Care Assistant
- **24/7 Instant Answers**: Powered by AI to answer questions about nutrition, breed care, behavior, and wellness tips.
- **Veterinary Safety Guardrails**: Built-in safety system prompt that ensures medical deferrals for emergency situations.

### 🔐 8. Authentication & Role-Based Access
- **Multi-Role System**: Dedicated views and capabilities for Pet Owners, Vets, Sitters, Groomers, and Admins.
- **Secure Auth**: JWT tokens, bcrypt hashed passwords, password reset flows, and email verification.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons & Animation**: [React Icons](https://react-icons.github.io/react-icons/), [Framer Motion](https://www.framer.com/motion/)
- **Forms & State**: React Hook Form, Context API (AuthContext, ToastContext)
- **Deployment**: [Vercel](https://vercel.com/) (with SPA routing configuration)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose](https://mongoosejs.com/)
- **Architecture**: Enterprise MVC (`routes → controllers → services → models`)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **File Storage**: Cloudinary & Multer
- **Email Service**: Nodemailer (SMTP)
- **Deployment**: [Render](https://render.com/)

---

## 💻 Local Development Setup

If you want to run PAWLX locally on your machine:

### Prerequisites
- Node.js (>= 18.0.0)
- npm (>= 9.0.0)
- MongoDB instance (local or MongoDB Atlas connection string)

### 1. Clone the repository
```bash
git clone https://github.com/Ayushi-Choudhary22/Pawlx.git
cd Pawlx
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
npm install
```

Configure your `backend/.env` with your MongoDB URI:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pawlx?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_RESET_SECRET=your_reset_secret
```

Seed initial products, categories, and sample accounts:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 3. Configure Frontend
In a new terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
