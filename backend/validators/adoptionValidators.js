const { body } = require('express-validator');

const applyForAdoptionValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('permanentAddress').trim().notEmpty().withMessage('Permanent address is required'),
  body('contactNumber').trim().notEmpty().withMessage('A contact number is required'),
  body('responsibilityAcknowledged')
    .custom((value) => value === 'true' || value === true)
    .withMessage('You must acknowledge responsibility for the pet to apply'),
];

const createAdoptionValidator = [
  body('name').trim().notEmpty().withMessage('Pet name is required'),
  body('species').trim().notEmpty().withMessage('Species is required'),
  body('description').trim().notEmpty().withMessage('A description is required'),
  body('adoptionType')
    .optional()
    .isIn(['permanent', 'foster'])
    .withMessage('Adoption type must be either permanent or foster'),
];

module.exports = { applyForAdoptionValidator, createAdoptionValidator };
