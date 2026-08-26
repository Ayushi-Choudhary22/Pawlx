const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const vaccinationService = require('../services/vaccinationService');
const medicineService = require('../services/medicineService');
const medicalRecordService = require('../services/medicalRecordService');

// ---------- Vaccinations ----------
const addVaccination = asyncHandler(async (req, res) => {
  const vaccination = await vaccinationService.addVaccination(req.user._id, req.params.petId, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, vaccination, 'Vaccination record added').send(res);
});

const getVaccinations = asyncHandler(async (req, res) => {
  const vaccinations = await vaccinationService.getVaccinations(req.user._id, req.params.petId);
  new ApiResponse(HTTP_STATUS.OK, vaccinations, 'Vaccinations fetched successfully').send(res);
});

const updateVaccination = asyncHandler(async (req, res) => {
  const vaccination = await vaccinationService.updateVaccination(
    req.user._id,
    req.params.petId,
    req.params.id,
    req.body
  );
  new ApiResponse(HTTP_STATUS.OK, vaccination, 'Vaccination record updated').send(res);
});

const deleteVaccination = asyncHandler(async (req, res) => {
  await vaccinationService.deleteVaccination(req.user._id, req.params.petId, req.params.id);
  new ApiResponse(HTTP_STATUS.OK, null, 'Vaccination record removed').send(res);
});

// ---------- Medicines ----------
const addMedicine = asyncHandler(async (req, res) => {
  const medicine = await medicineService.addMedicine(req.user._id, req.params.petId, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, medicine, 'Medicine reminder added').send(res);
});

const getMedicines = asyncHandler(async (req, res) => {
  const medicines = await medicineService.getMedicines(req.user._id, req.params.petId);
  new ApiResponse(HTTP_STATUS.OK, medicines, 'Medicines fetched successfully').send(res);
});

const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await medicineService.updateMedicine(
    req.user._id,
    req.params.petId,
    req.params.id,
    req.body
  );
  new ApiResponse(HTTP_STATUS.OK, medicine, 'Medicine reminder updated').send(res);
});

const deleteMedicine = asyncHandler(async (req, res) => {
  await medicineService.deleteMedicine(req.user._id, req.params.petId, req.params.id);
  new ApiResponse(HTTP_STATUS.OK, null, 'Medicine reminder removed').send(res);
});

// ---------- Medical Records ----------
const addRecord = asyncHandler(async (req, res) => {
  const record = await medicalRecordService.addRecord(req.user._id, req.params.petId, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, record, 'Medical record added').send(res);
});

const getRecords = asyncHandler(async (req, res) => {
  const records = await medicalRecordService.getRecords(req.user._id, req.params.petId);
  new ApiResponse(HTTP_STATUS.OK, records, 'Medical records fetched successfully').send(res);
});

const uploadAttachment = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No file provided');
  const record = await medicalRecordService.uploadAttachment(
    req.user._id,
    req.params.petId,
    req.params.id,
    req.file.buffer,
    req.file.originalname
  );
  new ApiResponse(HTTP_STATUS.OK, record, 'Document uploaded successfully').send(res);
});

module.exports = {
  addVaccination,
  getVaccinations,
  updateVaccination,
  deleteVaccination,
  addMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  addRecord,
  getRecords,
  uploadAttachment,
};
