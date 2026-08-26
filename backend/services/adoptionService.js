const { Adoption, AdoptionApplication } = require('../models/Adoption');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const { uploadToCloudinary } = require('../helpers/uploadToCloudinary');

const listAdoptions = async (filters = {}) => {
  const query = { status: 'available' };
  if (filters.species) query.species = filters.species;
  if (filters.gender) query.gender = filters.gender;
  if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');
  if (filters.adoptionType) query.adoptionType = filters.adoptionType;
  return Adoption.find(query).sort({ createdAt: -1 });
};

const getAdoptionById = async (id) => {
  const adoption = await Adoption.findById(id).populate('listedBy', 'name phone');
  if (!adoption) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Adoption listing not found');
  return adoption;
};

const createAdoption = async (userId, data) => Adoption.create({ ...data, listedBy: userId });

/**
 * Submits a full adoption/foster application, including adopter verification
 * details and an optional ID proof file uploaded to Cloudinary.
 */
const applyForAdoption = async (adoptionId, applicantId, applicationData, idProofBuffer) => {
  const adoption = await Adoption.findById(adoptionId);
  if (!adoption) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Adoption listing not found');

  let idProof;
  if (idProofBuffer) {
    const { url, publicId } = await uploadToCloudinary(idProofBuffer, 'pawlx/adoption-id-proofs');
    idProof = { url, publicId };
  }

  return AdoptionApplication.create({
    adoption: adoptionId,
    applicant: applicantId,
    message: applicationData.message,
    fullName: applicationData.fullName,
    permanentAddress: applicationData.permanentAddress,
    contactNumber: applicationData.contactNumber,
    emergencyContactName: applicationData.emergencyContactName,
    emergencyContactNumber: applicationData.emergencyContactNumber,
    previousPetExperience: applicationData.previousPetExperience,
    responsibilityAcknowledged: applicationData.responsibilityAcknowledged === 'true' || applicationData.responsibilityAcknowledged === true,
    idProof,
  });
};

const getMyApplications = async (applicantId) =>
  AdoptionApplication.find({ applicant: applicantId }).populate('adoption').sort({ createdAt: -1 });

const reviewApplication = async (applicationId, status) => {
  const application = await AdoptionApplication.findById(applicationId);
  if (!application) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Application not found');

  application.status = status;
  await application.save();

  if (status === 'approved') {
    await Adoption.findByIdAndUpdate(application.adoption, { status: 'adopted' });
  }

  return application;
};

module.exports = {
  listAdoptions,
  getAdoptionById,
  createAdoption,
  applyForAdoption,
  getMyApplications,
  reviewApplication,
};
