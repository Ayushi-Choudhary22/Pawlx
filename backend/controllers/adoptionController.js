const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const adoptionService = require('../services/adoptionService');

const listAdoptions = asyncHandler(async (req, res) => {
  const listings = await adoptionService.listAdoptions(req.query);
  new ApiResponse(HTTP_STATUS.OK, listings, 'Adoption listings fetched').send(res);
});

const getAdoptionById = asyncHandler(async (req, res) => {
  const listing = await adoptionService.getAdoptionById(req.params.id);
  new ApiResponse(HTTP_STATUS.OK, listing, 'Listing fetched successfully').send(res);
});

const createAdoption = asyncHandler(async (req, res) => {
  const listing = await adoptionService.createAdoption(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, listing, 'Adoption listing created').send(res);
});

const applyForAdoption = asyncHandler(async (req, res) => {
  const application = await adoptionService.applyForAdoption(
    req.params.id,
    req.user._id,
    req.body,
    req.file?.buffer
  );
  new ApiResponse(HTTP_STATUS.CREATED, application, 'Application submitted successfully').send(res);
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await adoptionService.getMyApplications(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, applications, 'Applications fetched successfully').send(res);
});

const reviewApplication = asyncHandler(async (req, res) => {
  const application = await adoptionService.reviewApplication(req.params.appId, req.body.status);
  new ApiResponse(HTTP_STATUS.OK, application, 'Application status updated').send(res);
});

module.exports = {
  listAdoptions,
  getAdoptionById,
  createAdoption,
  applyForAdoption,
  getMyApplications,
  reviewApplication,
};
