export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://pawlx-backend.onrender.com/api'
    : 'http://localhost:5000/api');

export const ROLES = {
  ADMIN: 'admin',
  PET_OWNER: 'pet_owner',
  VETERINARIAN: 'veterinarian',
  PET_SITTER: 'pet_sitter',
  GROOMER: 'groomer',
};

export const SPECIES_OPTIONS = ['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other'];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Pet Care', path: '/pet-care' },
  { label: 'Adoption', path: '/adoption' },
  { label: 'Temporary Adoption', path: '/temporary-adoption' },
  { label: 'Pet Sitters', path: '/pet-sitters' },
  { label: 'Grooming', path: '/grooming' },
  { label: 'AI Assistant', path: '/ai-assistant' },
];
