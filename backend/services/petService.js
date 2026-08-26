const Pet = require('../models/Pet');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const { uploadToCloudinary, deleteFromCloudinary } = require('../helpers/uploadToCloudinary');

const createPet = async (ownerId, petData) => {
  return Pet.create({ ...petData, owner: ownerId });
};

const getPetsByOwner = async (ownerId) => {
  return Pet.find({ owner: ownerId, isActive: true }).sort({ createdAt: -1 });
};

const getPetById = async (petId, ownerId) => {
  const pet = await Pet.findOne({ _id: petId, owner: ownerId });
  if (!pet) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Pet not found');
  return pet;
};

const updatePet = async (petId, ownerId, updates) => {
  const pet = await Pet.findOneAndUpdate({ _id: petId, owner: ownerId }, updates, {
    new: true,
    runValidators: true,
  });
  if (!pet) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Pet not found');
  return pet;
};

const deletePet = async (petId, ownerId) => {
  const pet = await Pet.findOneAndUpdate(
    { _id: petId, owner: ownerId },
    { isActive: false },
    { new: true }
  );
  if (!pet) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Pet not found');
  return pet;
};

const uploadPetPhoto = async (petId, ownerId, fileBuffer) => {
  const pet = await Pet.findOne({ _id: petId, owner: ownerId });
  if (!pet) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Pet not found');

  if (pet.photo?.publicId) {
    await deleteFromCloudinary(pet.photo.publicId);
  }

  const { url, publicId } = await uploadToCloudinary(fileBuffer, 'pawlx/pets');
  pet.photo = { url, publicId };
  await pet.save();

  return pet;
};

module.exports = { createPet, getPetsByOwner, getPetById, updatePet, deletePet, uploadPetPhoto };
