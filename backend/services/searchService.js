const Product = require('../models/Product');
const { Adoption } = require('../models/Adoption');
const User = require('../models/User');
const ROLES = require('../constants/roles');

const PROFESSIONAL_ROLES = [ROLES.VETERINARIAN, ROLES.PET_SITTER, ROLES.GROOMER];

/**
 * Searches products, adoption listings, and professionals in parallel and
 * returns a categorized result set, capped per category so the response
 * stays fast and the UI can render sectioned results.
 */
const globalSearch = async (query, limit = 6) => {
  if (!query || query.trim().length < 2) {
    return { products: [], adoptions: [], professionals: [] };
  }

  const regex = new RegExp(query.trim(), 'i');

  const [products, adoptions, professionals] = await Promise.all([
    Product.find({
      isActive: true,
      $or: [{ name: regex }, { description: regex }, { tags: regex }],
    })
      .select('name slug images price discountPrice rating')
      .limit(limit),

    Adoption.find({
      status: 'available',
      $or: [{ name: regex }, { breed: regex }, { species: regex }, { description: regex }],
    })
      .select('name species breed photos location status')
      .limit(limit),

    User.find({
      role: { $in: PROFESSIONAL_ROLES },
      isActive: true,
      'professionalProfile.isApproved': true,
      $or: [{ name: regex }, { 'professionalProfile.city': regex }, { 'professionalProfile.bio': regex }],
    })
      .select('name avatar role professionalProfile')
      .limit(limit),
  ]);

  return { products, adoptions, professionals };
};

module.exports = { globalSearch };
