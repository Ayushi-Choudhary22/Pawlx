const { body } = require('express-validator');

const createPetValidator = [
  body('name').trim().notEmpty().withMessage('Pet name is required'),
  body('species')
    .isIn(['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other'])
    .withMessage('Please select a valid species'),
  body('gender').optional().isIn(['male', 'female', 'unknown']),
  body('birthDate').optional().isISO8601().withMessage('Birth date must be a valid date'),
];

const updatePetValidator = [
  body('name').optional().trim().notEmpty().withMessage('Pet name cannot be empty'),
  body('species')
    .optional()
    .isIn(['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other'])
    .withMessage('Please select a valid species'),
];

module.exports = { createPetValidator, updatePetValidator };
