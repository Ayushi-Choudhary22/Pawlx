/**
 * PAWLX database seed script.
 *
 * Populates a fresh database with working demo data: login-ready users
 * across every role, product categories + products, adoption listings,
 * and a few sample reviews — so the app has something to show and you
 * have known credentials to log in with immediately.
 *
 * Usage:
 *   npm run seed          # seed the database (adds to existing data)
 *   npm run seed:fresh    # wipes relevant collections first, then seeds
 *
 * Requires .env to be configured with a working MONGO_URI.
 */

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { Adoption } = require('../models/Adoption');
const Review = require('../models/Review');
const { TemporaryAdoption, TemporaryAdoptionRequest } = require('../models/TemporaryAdoption');

const ROLES = require('../constants/roles');

const WIPE_FIRST = process.argv.includes('--fresh');

const DEMO_PASSWORD = 'Password123!';

const slugify = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function seed() {
  await connectDB();

  if (WIPE_FIRST) {
    console.log('Wiping existing users, categories, products, adoption listings, reviews, temporary adoptions...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Adoption.deleteMany({}),
      Review.deleteMany({}),
      TemporaryAdoption.deleteMany({}),
      TemporaryAdoptionRequest.deleteMany({}),
    ]);
  }

  // ---------------- Users ----------------
  const usersToCreate = [
    { 
      name: 'Admin User', 
      email: 'admin@pawlx.com', 
      role: ROLES.ADMIN, 
      isVerified: true, 
      aadharNumber: '111122223333' 
    },
    { 
      name: 'Ayushi Sharma', 
      email: 'owner@pawlx.com', 
      role: ROLES.PET_OWNER, 
      isVerified: true, 
      aadharNumber: '123456789012', 
      address: { street: '15 High Street', city: 'Jodhpur', state: 'Rajasthan', zipCode: '342001', country: 'India' } 
    },
    { 
      name: 'Rohan Mehta', 
      email: 'owner2@pawlx.com', 
      role: ROLES.PET_OWNER, 
      isVerified: true, 
      aadharNumber: '987654321098', 
      address: { street: '32 Lakeview Road', city: 'Jaipur', state: 'Rajasthan', zipCode: '302001', country: 'India' } 
    },
    {
      name: 'Dr. Kavita Rao',
      email: 'vet@pawlx.com',
      role: ROLES.VETERINARIAN,
      phone: '+91 98765 43210',
      isVerified: true,
      aadharNumber: '112233445566',
      address: { street: '12 Ratanada Road', city: 'Jodhpur', state: 'Rajasthan', zipCode: '342001', country: 'India' },
      professionalProfile: {
        bio: 'Small animal veterinarian with a focus on preventive care and nutrition.',
        experienceYears: 8,
        consultationFee: 500,
        city: 'Jodhpur',
        clinicAddress: '12 Ratanada Road, near City Park, Jodhpur, Rajasthan 342001',
        offersVideoConsultation: true,
        isApproved: true,
        availability: [{ day: 'Mon-Fri', slots: ['10:00 AM', '2:00 PM', '5:00 PM'] }],
      },
    },
    {
      name: 'Dr. Arjun Singh',
      email: 'vet2@pawlx.com',
      role: ROLES.VETERINARIAN,
      phone: '+91 98765 11223',
      isVerified: true,
      aadharNumber: '665544332211',
      address: { street: '45 MI Road', city: 'Jaipur', state: 'Rajasthan', zipCode: '302001', country: 'India' },
      professionalProfile: {
        bio: 'Experienced in surgery and emergency care for dogs and cats.',
        experienceYears: 12,
        consultationFee: 700,
        city: 'Jaipur',
        clinicAddress: '45 MI Road, Jaipur, Rajasthan 302001',
        offersVideoConsultation: false,
        isApproved: true,
      },
    },
    {
      name: 'Meera Joshi',
      email: 'sitter@pawlx.com',
      role: ROLES.PET_SITTER,
      phone: '+91 98765 55667',
      isVerified: true,
      aadharNumber: '223344556677',
      address: { street: '7 Shastri Nagar', city: 'Jodhpur', state: 'Rajasthan', zipCode: '342003', country: 'India' },
      professionalProfile: {
        bio: 'Loving, experienced pet sitter — your pets will feel right at home.',
        experienceYears: 5,
        consultationFee: 300,
        city: 'Jodhpur',
        clinicAddress: '7 Shastri Nagar, Jodhpur, Rajasthan 342003',
        isApproved: true,
      },
    },
    {
      name: 'Meena Joshi',
      email: 'meena@pawlx.com',
      role: ROLES.PET_SITTER,
      phone: '+91 98765 11111',
      isVerified: true,
      aadharNumber: '334455667788',
      address: { street: '15 Sardarpura', city: 'Jodhpur', state: 'Rajasthan', zipCode: '342003', country: 'India' },
      professionalProfile: {
        bio: 'Dedicated pet sitter providing a cozy home stay environment for dogs.',
        experienceYears: 4,
        consultationFee: 250,
        city: 'Jodhpur',
        clinicAddress: '15 Sardarpura, Jodhpur, Rajasthan 342003',
        isApproved: true,
      },
    },
    {
      name: 'Sunita Vyas',
      email: 'sunita@pawlx.com',
      role: ROLES.PET_SITTER,
      phone: '+91 98765 22222',
      isVerified: true,
      aadharNumber: '445566778899',
      address: { street: '42 Chopasni Housing Board', city: 'Jodhpur', state: 'Rajasthan', zipCode: '342008', country: 'India' },
      professionalProfile: {
        bio: 'Active pet caregiver with a large backyard. Specialized in energetic dog breeds.',
        experienceYears: 7,
        consultationFee: 350,
        city: 'Jodhpur',
        clinicAddress: '42 Chopasni Housing Board, Jodhpur, Rajasthan 342008',
        isApproved: true,
      },
    },
    {
      name: 'Amit Sharma',
      email: 'amit@pawlx.com',
      role: ROLES.PET_SITTER,
      phone: '+91 98765 33333',
      isVerified: true,
      aadharNumber: '556677889900',
      address: { street: '88 Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', zipCode: '302017', country: 'India' },
      professionalProfile: {
        bio: 'Certified pet behaviorist offering cage-free pet sitting and basic training.',
        experienceYears: 6,
        consultationFee: 400,
        city: 'Jaipur',
        clinicAddress: '88 Malviya Nagar, Jaipur, Rajasthan 302017',
        isApproved: true,
      },
    },
    {
      name: 'Karan Patel',
      email: 'groomer@pawlx.com',
      role: ROLES.GROOMER,
      phone: '+91 98765 99887',
      isVerified: true,
      aadharNumber: '998877665544',
      address: { street: '23 Paota Circle', city: 'Jodhpur', state: 'Rajasthan', zipCode: '342006', country: 'India' },
      professionalProfile: {
        bio: 'Certified groomer specializing in breed-specific cuts and spa treatments.',
        experienceYears: 6,
        consultationFee: 400,
        city: 'Jodhpur',
        clinicAddress: '23 Paota Circle, Jodhpur, Rajasthan 342006',
        isApproved: true,
      },
    },
  ];

  const createdUsers = {};
  for (const userData of usersToCreate) {
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create({ ...userData, password: DEMO_PASSWORD, isActive: true, isEmailVerified: true });
      console.log(`Created user: ${userData.email} (${userData.role})`);
    } else {
      console.log(`User already exists, skipping: ${userData.email}`);
    }
    createdUsers[userData.email] = user;
  }

  // ---------------- Categories ----------------
  const categoryNames = [
    'Food', 'Medicines', 'Accessories', 'Beds', 'Toys',
    'Collars', 'Leashes', 'Bowls', 'Treats', 'Supplements',
  ];

  const categoriesByName = {};
  for (const name of categoryNames) {
    const slug = slugify(name);
    let category = await Category.findOne({ slug });
    if (!category) {
      category = await Category.create({ name, slug, description: `${name} for your pet` });
      console.log(`Created category: ${name}`);
    }
    categoriesByName[name] = category;
  }

  // ---------------- Products ----------------
  const productSeeds = [
    { name: 'Premium Grain-Free Dog Food (5kg)', category: 'Food', price: 1299, discountPrice: 1099, stock: 40, petType: ['dog'], image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&q=80', isFeatured: true },
    { name: 'Salmon & Rice Cat Food (2kg)', category: 'Food', price: 899, stock: 35, petType: ['cat'], image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80' },
    { name: 'Joint Care Supplement Chews', category: 'Supplements', price: 599, stock: 25, petType: ['dog', 'cat'], image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80' },
    { name: 'Flea & Tick Prevention Drops', category: 'Medicines', price: 449, stock: 50, petType: ['dog', 'cat'], image: 'https://images.unsplash.com/photo-1615796153287-98eacf0abb13?w=600&q=80' },
    { name: 'Orthopedic Memory Foam Pet Bed', category: 'Beds', price: 2199, discountPrice: 1799, stock: 18, petType: ['dog'], image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80', isFeatured: true },
    { name: 'Cozy Cave Cat Bed', category: 'Beds', price: 999, stock: 22, petType: ['cat'], image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&q=80' },
    { name: 'Interactive Puzzle Feeder Toy', category: 'Toys', price: 349, stock: 60, petType: ['dog'], image: 'https://images.unsplash.com/photo-1601758064878-06fa1d1a3c07?w=600&q=80' },
    { name: 'Feather Wand Cat Toy', category: 'Toys', price: 199, stock: 70, petType: ['cat'], image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&q=80' },
    { name: 'Adjustable Nylon Collar', category: 'Collars', price: 299, stock: 45, petType: ['dog', 'cat'], image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&q=80' },
    { name: 'Reflective Night-Safety Leash', category: 'Leashes', price: 399, stock: 38, petType: ['dog'], image: 'https://images.unsplash.com/photo-1601758175539-8c023f9b5f7e?w=600&q=80' },
    { name: 'Stainless Steel Double Bowl Set', category: 'Bowls', price: 549, stock: 30, petType: ['dog', 'cat'], image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=600&q=80' },
    { name: 'Freeze-Dried Chicken Training Treats', category: 'Treats', price: 349, stock: 55, petType: ['dog'], image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&q=80', isFeatured: true },
    { name: 'Dental Care Chew Sticks', category: 'Treats', price: 279, stock: 48, petType: ['dog'], image: 'https://images.unsplash.com/photo-1585846888147-3a2a94a56f0d?w=600&q=80' },
    { name: 'Multivitamin Skin & Coat Supplement', category: 'Supplements', price: 649, stock: 20, petType: ['dog', 'cat'], image: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=600&q=80' },
    { name: 'Travel Carrier Backpack', category: 'Accessories', price: 1899, stock: 15, petType: ['cat', 'rabbit'], image: '/images/dog_backpack.jpg' },
    { name: 'Waterproof Rain Coat for Dogs', category: 'Accessories', price: 799, stock: 28, petType: ['dog'], image: '/images/dog_raincoat.jpg' },
  ];

  const createdProducts = [];
  for (const p of productSeeds) {
    const slug = slugify(p.name);
    let product = await Product.findOne({ slug });
    if (!product) {
      product = await Product.create({
        name: p.name,
        slug,
        description: `High-quality ${p.name.toLowerCase()} designed for everyday comfort and care.`,
        category: categoriesByName[p.category]._id,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        petType: p.petType,
        images: [{ url: p.image }],
        isFeatured: !!p.isFeatured,
        rating: 4 + Math.random(),
        totalReviews: Math.floor(Math.random() * 30) + 5,
        totalSold: Math.floor(Math.random() * 200),
      });
      console.log(`Created product: ${p.name}`);
    }
    createdProducts.push(product);
  }

  // ---------------- Adoption listings ----------------
  const adoptionSeeds = [
    { name: 'Bruno', species: 'dog', breed: 'Labrador Mix', gender: 'male', age: { years: 2, months: 0 }, city: 'Jodhpur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1633722715568-4ac296c1e1b8?w=600&q=80', description: 'Bruno is a gentle, playful boy who loves belly rubs and long walks. Great with kids.', isVaccinated: true, isNeutered: true, adoptionType: 'permanent', reasonForRehoming: 'Moving abroad for work and unable to bring him along.', dietInfo: 'Two cups of dry kibble twice a day, loves carrots as treats.', behaviorNotes: 'Loves tennis balls and tug-of-war, very gentle with children.', medicalHistory: 'Annual checkups up to date, no known conditions.', contactNumber: '+91 90000 11111' },
    { name: 'Luna', species: 'cat', breed: 'Domestic Shorthair', gender: 'female', age: { years: 1, months: 6 }, city: 'Jaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&q=80', description: 'Luna is curious and affectionate, and loves sunny windowsills.', isVaccinated: true, isNeutered: false, adoptionType: 'foster', reasonForRehoming: 'Owner recovering from surgery, needs temporary care for 2-3 months.', dietInfo: 'Wet food once daily, dry food available throughout the day.', behaviorNotes: 'Playful with feather toys, a bit shy with strangers at first.', medicalHistory: 'First round of vaccinations done, spaying scheduled.', contactNumber: '+91 90000 22222' },
    { name: 'Rocky', species: 'dog', breed: 'Indie', gender: 'male', age: { years: 3, months: 0 }, city: 'Udaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1517849845537-4d257902861a?w=600&q=80', description: 'Rocky is loyal and protective, looking for an active family.', isVaccinated: true, isNeutered: true, adoptionType: 'permanent', dietInfo: 'Home-cooked meals with rice and chicken.', behaviorNotes: 'High energy, needs daily walks, good guard dog instincts.', medicalHistory: 'Fully vaccinated, neutered last year.', contactNumber: '+91 90000 33333' },
    { name: 'Coco', species: 'rabbit', breed: 'Dutch', gender: 'female', age: { years: 0, months: 8 }, city: 'Jodhpur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&q=80', description: 'Coco is a sweet, calm bunny who loves fresh veggies.', isVaccinated: false, isNeutered: false, adoptionType: 'foster', reasonForRehoming: 'Family member developed an allergy.', dietInfo: 'Fresh vegetables daily plus timothy hay.', behaviorNotes: 'Calm and gentle, enjoys being held.', contactNumber: '+91 90000 44444' },
    { name: 'Simba', species: 'cat', breed: 'Persian', gender: 'male', age: { years: 2, months: 3 }, city: 'Jodhpur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&q=80', description: 'Simba is a fluffy, laid-back companion who enjoys quiet homes.', isVaccinated: true, isNeutered: true, adoptionType: 'permanent', dietInfo: 'Premium dry food, grooomed weekly for his long coat.', behaviorNotes: 'Prefers calm environments, enjoys lounging by windows.', medicalHistory: 'Regular checkups, no known health issues.', contactNumber: '+91 90000 55555' },
    { name: 'Milo', species: 'dog', breed: 'Beagle', gender: 'male', age: { years: 1, months: 2 }, city: 'Jaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80', description: 'Milo is energetic and food-motivated — perfect for an active owner.', isVaccinated: true, isNeutered: false, adoptionType: 'permanent', reasonForRehoming: 'Previous owner had a change in living situation and can no longer keep a dog.', dietInfo: 'Dry kibble with occasional boiled egg as a treat.', behaviorNotes: 'Very food motivated, great for training, loves other dogs.', medicalHistory: 'Vaccinated, due for neutering.', contactNumber: '+91 90000 66666' },
  ];

  const adminUser = createdUsers['admin@pawlx.com'];
  for (const a of adoptionSeeds) {
    const existing = await Adoption.findOne({ name: a.name, breed: a.breed });
    if (!existing) {
      await Adoption.create({
        listedBy: adminUser._id,
        name: a.name,
        species: a.species,
        breed: a.breed,
        gender: a.gender,
        age: a.age,
        location: { city: a.city, state: a.state },
        photos: [{ url: a.image }],
        description: a.description,
        isVaccinated: a.isVaccinated,
        isNeutered: a.isNeutered,
        adoptionType: a.adoptionType,
        reasonForRehoming: a.reasonForRehoming,
        dietInfo: a.dietInfo,
        behaviorNotes: a.behaviorNotes,
        medicalHistory: a.medicalHistory,
        contactNumber: a.contactNumber,
        status: 'available',
      });
      console.log(`Created adoption listing: ${a.name}`);
    }
  }

  // ---------------- Sample reviews ----------------
  const ownerUser = createdUsers['owner@pawlx.com'];
  const sampleReviewProducts = createdProducts.slice(0, 5);
  const reviewComments = [
    'My pet loves this — repurchasing already!',
    'Great quality for the price, highly recommend.',
    'Noticed a real difference within a couple weeks.',
    'Good product, delivery was quick too.',
    'Exactly as described, works well.',
  ];

  for (let i = 0; i < sampleReviewProducts.length; i++) {
    const product = sampleReviewProducts[i];
    const existing = await Review.findOne({ targetType: 'product', targetId: product._id, user: ownerUser._id });
    if (!existing) {
      await Review.create({
        user: ownerUser._id,
        targetType: 'product',
        targetId: product._id,
        targetTypeRef: 'Product',
        rating: 4 + (i % 2),
        comment: reviewComments[i],
      });
      console.log(`Created review for: ${product.name}`);
    }
  }

  // ---------------- Temporary Adoption listings ----------------
  console.log('\nSeeding temporary adoption listings...');
  const owner1 = createdUsers['owner@pawlx.com'];
  const owner2 = createdUsers['owner2@pawlx.com'];
  const sitter1 = createdUsers['sitter@pawlx.com'];
  const sitter2 = createdUsers['meena@pawlx.com'];

  const tempAdoptions = [
    {
      user: owner1._id,
      type: 'sitter_needed',
      petName: 'Bruno',
      petSpecies: 'dog',
      petBreed: 'Labrador Mix',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      city: 'Jodhpur',
      state: 'Rajasthan',
      description: 'Bruno is highly energetic and friendly. Needs daily long walks and fresh water. Very friendly with other dogs.',
      status: 'active',
    },
    {
      user: owner2._id,
      type: 'sitter_needed',
      petName: 'Simba',
      petSpecies: 'cat',
      petBreed: 'Persian',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      city: 'Jaipur',
      state: 'Rajasthan',
      description: 'Simba is quiet and keeps to himself. Just needs twice daily meals and a clean litter box.',
      status: 'active',
    },
    {
      user: sitter1._id,
      type: 'host_available',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      city: 'Jodhpur',
      state: 'Rajasthan',
      description: 'Available to host any dogs in my spacious suburban house. Large gated backyard and plenty of toys.',
      status: 'active',
    },
    {
      user: sitter2._id,
      type: 'host_available',
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      city: 'Jodhpur',
      state: 'Rajasthan',
      description: 'Experienced sitter with a dedicated room for cats. Calm and peaceful apartment environment.',
      status: 'active',
    },
  ];

  for (const item of tempAdoptions) {
    const existing = await TemporaryAdoption.findOne({ user: item.user, type: item.type, petName: item.petName });
    if (!existing) {
      await TemporaryAdoption.create(item);
      console.log(`Created temporary adoption listing: ${item.petName || 'Host Availability'}`);
    }
  }

  console.log('\n=================================================');
  console.log('Seed complete! Log in with any of these accounts:');
  console.log('=================================================');
  usersToCreate.forEach((u) => console.log(`  ${u.role.padEnd(14)} ${u.email}`));
  console.log(`\nPassword for all seeded accounts: ${DEMO_PASSWORD}`);
  console.log('=================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
