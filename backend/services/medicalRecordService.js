const MedicalRecord = require('../models/MedicalRecord');
const Pet = require('../models/Pet');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const { uploadToCloudinary } = require('../helpers/uploadToCloudinary');

const assertPetOwnership = async (petId, ownerId) => {
  const pet = await Pet.findOne({ _id: petId, owner: ownerId });
  if (!pet) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Pet not found');
  return pet;
};

const addRecord = async (ownerId, petId, data) => {
  await assertPetOwnership(petId, ownerId);
  return MedicalRecord.create({ ...data, pet: petId });
};

const getRecords = async (ownerId, petId) => {
  await assertPetOwnership(petId, ownerId);
  return MedicalRecord.find({ pet: petId })
    .populate('veterinarian', 'name')
    .sort({ recordDate: -1 });
};

const uploadAttachment = async (ownerId, petId, recordId, fileBuffer, fileName) => {
  await assertPetOwnership(petId, ownerId);
  const record = await MedicalRecord.findOne({ _id: recordId, pet: petId });
  if (!record) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Medical record not found');

  const { url, publicId } = await uploadToCloudinary(fileBuffer, 'pawlx/medical-records');
  record.attachments.push({ url, publicId, fileName });
  await record.save();

  return record;
};

module.exports = { addRecord, getRecords, uploadAttachment };
