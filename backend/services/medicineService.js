const Medicine = require('../models/Medicine');
const Pet = require('../models/Pet');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const assertPetOwnership = async (petId, ownerId) => {
  const pet = await Pet.findOne({ _id: petId, owner: ownerId });
  if (!pet) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Pet not found');
  return pet;
};

const addMedicine = async (ownerId, petId, data) => {
  await assertPetOwnership(petId, ownerId);
  return Medicine.create({ ...data, pet: petId });
};

const getMedicines = async (ownerId, petId) => {
  await assertPetOwnership(petId, ownerId);
  return Medicine.find({ pet: petId }).sort({ isActive: -1, startDate: -1 });
};

const updateMedicine = async (ownerId, petId, medicineId, data) => {
  await assertPetOwnership(petId, ownerId);
  const medicine = await Medicine.findOneAndUpdate({ _id: medicineId, pet: petId }, data, {
    new: true,
    runValidators: true,
  });
  if (!medicine) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Medicine reminder not found');
  return medicine;
};

const deleteMedicine = async (ownerId, petId, medicineId) => {
  await assertPetOwnership(petId, ownerId);
  const medicine = await Medicine.findOneAndDelete({ _id: medicineId, pet: petId });
  if (!medicine) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Medicine reminder not found');
};

module.exports = { addMedicine, getMedicines, updateMedicine, deleteMedicine };
