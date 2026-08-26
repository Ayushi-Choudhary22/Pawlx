const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const petService = require('../services/petService');

// @desc    Add a new pet
// @route   POST /api/pets
// @access  Private
const createPet = asyncHandler(async (req, res) => {
  const pet = await petService.createPet(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, pet, 'Pet added successfully').send(res);
});

// @desc    Get all pets belonging to logged-in user
// @route   GET /api/pets
// @access  Private
const getMyPets = asyncHandler(async (req, res) => {
  const pets = await petService.getPetsByOwner(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, pets, 'Pets fetched successfully').send(res);
});

// @desc    Get single pet profile
// @route   GET /api/pets/:id
// @access  Private
const getPetById = asyncHandler(async (req, res) => {
  const pet = await petService.getPetById(req.params.id, req.user._id);
  new ApiResponse(HTTP_STATUS.OK, pet, 'Pet fetched successfully').send(res);
});

// @desc    Update pet profile
// @route   PUT /api/pets/:id
// @access  Private
const updatePet = asyncHandler(async (req, res) => {
  const pet = await petService.updatePet(req.params.id, req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.OK, pet, 'Pet updated successfully').send(res);
});

// @desc    Soft-delete a pet
// @route   DELETE /api/pets/:id
// @access  Private
const deletePet = asyncHandler(async (req, res) => {
  await petService.deletePet(req.params.id, req.user._id);
  new ApiResponse(HTTP_STATUS.OK, null, 'Pet removed successfully').send(res);
});

// @desc    Upload / replace pet photo
// @route   POST /api/pets/:id/photo
// @access  Private
const uploadPetPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No image file provided');
  }
  const pet = await petService.uploadPetPhoto(req.params.id, req.user._id, req.file.buffer);
  new ApiResponse(HTTP_STATUS.OK, pet, 'Pet photo updated').send(res);
});

module.exports = { createPet, getMyPets, getPetById, updatePet, deletePet, uploadPetPhoto };
