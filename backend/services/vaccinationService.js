const Vaccination = require('../models/Vaccination');
const Pet = require('../models/Pet');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const assertPetOwnership = async (petId, ownerId) => {
  const pet = await Pet.findOne({ _id: petId, owner: ownerId });
  if (!pet) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Pet not found');
  return pet;
};

const addVaccination = async (ownerId, petId, data) => {
  await assertPetOwnership(petId, ownerId);
  return Vaccination.create({ ...data, pet: petId });
};

const getVaccinations = async (ownerId, petId) => {
  await assertPetOwnership(petId, ownerId);
  return Vaccination.find({ pet: petId }).sort({ dateAdministered: -1 });
};

const updateVaccination = async (ownerId, petId, vaccinationId, data) => {
  await assertPetOwnership(petId, ownerId);
  const vaccination = await Vaccination.findOneAndUpdate({ _id: vaccinationId, pet: petId }, data, {
    new: true,
    runValidators: true,
  });
  if (!vaccination) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Vaccination record not found');
  return vaccination;
};

const deleteVaccination = async (ownerId, petId, vaccinationId) => {
  await assertPetOwnership(petId, ownerId);
  const vaccination = await Vaccination.findOneAndDelete({ _id: vaccinationId, pet: petId });
  if (!vaccination) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Vaccination record not found');
};

module.exports = { addVaccination, getVaccinations, updateVaccination, deleteVaccination };
