const { TemporaryAdoption, TemporaryAdoptionRequest } = require('../models/TemporaryAdoption');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const { createNotification } = require('./notificationService');

/**
 * Create a temporary adoption listing
 */
const createListing = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  
  if (!user.isVerified) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Profile verification (Aadhar Card Number) is required to list pets for temporary adoption.'
    );
  }

  const listing = await TemporaryAdoption.create({
    user: userId,
    type: data.type,
    petName: data.petName || '',
    petSpecies: data.petSpecies || '',
    petBreed: data.petBreed || '',
    startDate: data.startDate,
    endDate: data.endDate,
    city: data.city || user.address?.city || '',
    state: data.state || user.address?.state || '',
    description: data.description,
    status: 'active',
  });

  return listing;
};

/**
 * List listings matching criteria
 */
const listListings = async (userId, query = {}) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');

  if (!user.isVerified) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Profile verification (Aadhar Card Number) is required to search and view temporary adoption listings.'
    );
  }

  const matchQuery = { status: 'active' };
  
  // Don't show user's own listings in browse page
  matchQuery.user = { $ne: userId };

  if (query.type) {
    matchQuery.type = query.type;
  }
  
  if (query.city) {
    matchQuery.city = new RegExp(query.city.trim(), 'i');
  }

  const listings = await TemporaryAdoption.find(matchQuery)
    .populate('user', 'name avatar isVerified address')
    .sort({ createdAt: -1 });

  return listings;
};

/**
 * Send a connection request to a listing owner
 */
const sendConnectionRequest = async (senderId, listingId, data) => {
  const sender = await User.findById(senderId);
  if (!sender) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Sender not found');

  if (!sender.isVerified) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Profile verification is required to send connection requests.'
    );
  }

  const listing = await TemporaryAdoption.findById(listingId);
  if (!listing) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Listing not found');

  if (listing.status !== 'active') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This listing is no longer active.');
  }

  if (listing.user.toString() === senderId.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'You cannot send a connection request to your own listing.');
  }

  // Check if a request already exists
  const existingRequest = await TemporaryAdoptionRequest.findOne({
    listing: listingId,
    sender: senderId,
  });

  if (existingRequest) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'You have already sent a request for this listing.');
  }

  const request = await TemporaryAdoptionRequest.create({
    listing: listingId,
    sender: senderId,
    receiver: listing.user,
    message: data.message || '',
    status: 'pending',
  });

  // Notify the receiver
  await createNotification({
    user: listing.user,
    type: 'sitter_booking',
    title: 'New Connection Request',
    message: `${sender.name} sent you a connection request for your temporary adoption post.`,
    link: '/temporary-adoption',
  });

  return request;
};

/**
 * Get dashboard data: user listings, incoming requests, and outgoing requests
 */
const getMyDashboard = async (userId) => {
  const listings = await TemporaryAdoption.find({ user: userId }).sort({ createdAt: -1 });

  // Incoming requests: requests where user is the receiver
  const incomingRaw = await TemporaryAdoptionRequest.find({ receiver: userId })
    .populate('sender', 'name email phone avatar isVerified address')
    .populate('listing')
    .sort({ createdAt: -1 });

  // Outgoing requests: requests where user is the sender
  const outgoingRaw = await TemporaryAdoptionRequest.find({ sender: userId })
    .populate('receiver', 'name email phone avatar isVerified address')
    .populate('listing')
    .sort({ createdAt: -1 });

  // Redact email and phone numbers unless request is accepted
  const incoming = incomingRaw.map((req) => {
    const obj = req.toObject();
    if (obj.status !== 'accepted' && obj.sender) {
      delete obj.sender.email;
      delete obj.sender.phone;
    }
    return obj;
  });

  const outgoing = outgoingRaw.map((req) => {
    const obj = req.toObject();
    if (obj.status !== 'accepted' && obj.receiver) {
      delete obj.receiver.email;
      delete obj.receiver.phone;
    }
    return obj;
  });

  return {
    listings,
    incoming,
    outgoing,
  };
};

/**
 * Respond to a connection request
 */
const respondToRequest = async (userId, requestId, status) => {
  if (!['accepted', 'rejected'].includes(status)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid status response.');
  }

  const request = await TemporaryAdoptionRequest.findById(requestId)
    .populate('sender', 'name')
    .populate('receiver', 'name');
    
  if (!request) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Request not found');

  // Verify that the logged-in user is the receiver
  if (request.receiver._id.toString() !== userId.toString()) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'You are not authorized to respond to this request.');
  }

  request.status = status;
  await request.save();

  // Create notification for sender
  await createNotification({
    user: request.sender._id,
    type: 'sitter_booking',
    title: `Connection Request ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
    message: `${request.receiver.name} has ${status} your connection request. ${
      status === 'accepted' ? 'You can now view their contact details.' : ''
    }`,
    link: '/temporary-adoption',
  });

  return request;
};

module.exports = {
  createListing,
  listListings,
  sendConnectionRequest,
  getMyDashboard,
  respondToRequest,
};
