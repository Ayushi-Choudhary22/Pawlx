import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { temporaryAdoptionService } from '@/services/temporaryAdoptionService';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { 
  FiMapPin, 
  FiCalendar, 
  FiMessageSquare, 
  FiCheckCircle, 
  FiXCircle, 
  FiUser, 
  FiPlus, 
  FiSearch, 
  FiClock, 
  FiPhone, 
  FiMail, 
  FiAlertTriangle 
} from 'react-icons/fi';

const TemporaryAdoptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Browse listings state
  const [browseListings, setBrowseListings] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [filterType, setFilterType] = useState('sitter_needed');

  // Dashboard state (My postings & requests)
  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  // Post listing form state
  const [formType, setFormType] = useState('sitter_needed');
  const [formData, setFormData] = useState({
    petName: '',
    petSpecies: 'dog',
    petBreed: '',
    startDate: '',
    endDate: '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    description: '',
  });

  // Connection request modal state
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState('');

  // Fetch browse listings
  const fetchBrowseListings = async () => {
    if (!user?.isVerified) return;
    try {
      const res = await temporaryAdoptionService.list({
        type: filterType,
        city: searchCity,
      });
      setBrowseListings(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch listings', 'error');
    }
  };

  // Fetch my dashboard data (postings, requests)
  const fetchDashboard = async () => {
    if (!user?.isVerified) return;
    try {
      const res = await temporaryAdoptionService.getMyDashboard();
      setMyListings(res.data.listings);
      setIncomingRequests(res.data.incoming);
      setOutgoingRequests(res.data.outgoing);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch dashboard', 'error');
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchBrowseListings(), fetchDashboard()]);
      setLoading(false);
    };
    init();
  }, [user?.isVerified]);

  // Handle browse search and filters
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBrowseListings();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [filterType, searchCity]);

  // Handle create listing submit
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.description) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await temporaryAdoptionService.create({
        ...formData,
        type: formType,
      });
      showToast('Temporary adoption listing posted successfully!', 'success');
      // Reset form
      setFormData({
        petName: '',
        petSpecies: 'dog',
        petBreed: '',
        startDate: '',
        endDate: '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        description: '',
      });
      // Fetch new data and switch tab
      await fetchDashboard();
      setActiveTab('mypostings');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle connection request submit
  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedListing) return;

    setSubmitting(true);
    try {
      await temporaryAdoptionService.connect(selectedListing._id, {
        message: connectionMessage,
      });
      showToast('Connection request sent successfully!', 'success');
      setConnectionModalOpen(false);
      setSelectedListing(null);
      setConnectionMessage('');
      await fetchDashboard();
      setActiveTab('myrequests');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Respond to incoming request (Accept/Reject)
  const handleRespondToRequest = async (requestId, status) => {
    try {
      await temporaryAdoptionService.respondToRequest(requestId, status);
      showToast(`Request successfully ${status}!`, 'success');
      await fetchDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to respond to request', 'error');
    }
  };

  // Check if user is verified
  if (!user?.isVerified) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-5">
        <div className="card p-8 text-center space-y-6 shadow-md border-border bg-white rounded-2xl">
          <div className="mx-auto h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <FiAlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-ink">Verification Required</h1>
            <p className="text-ink-muted max-w-md mx-auto">
              To connect for temporary pet adoption, you must complete your dummy profile verification. Enter a 12-digit Aadhar Card Number and save your address location in your profile.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" onClick={() => navigate('/profile')}>
              Verify Profile Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-2">Temporary Pet Adoption</h1>
          <p className="text-sm text-ink-muted">
            Connect with verified neighbors for temporary pet boarding and care when traveling.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            ✓ Verified Account
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'browse'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-border'
          }`}
        >
          Browse Opportunities
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'post'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-border'
          }`}
        >
          Post Availability/Requirement
        </button>
        <button
          onClick={() => setActiveTab('mypostings')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'mypostings'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-border'
          }`}
        >
          My Postings ({myListings.length})
        </button>
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'incoming'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-border'
          }`}
        >
          Incoming Requests ({incomingRequests.filter((r) => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('myrequests')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'myrequests'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-border'
          }`}
        >
          My Connection Requests ({outgoingRequests.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-xl border border-border">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilterType('sitter_needed')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  filterType === 'sitter_needed'
                    ? 'bg-primary text-white'
                    : 'bg-white text-ink-muted border border-border hover:bg-surface'
                }`}
              >
                Need Sitters (Pet Owners)
              </button>
              <button
                onClick={() => setFilterType('host_available')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  filterType === 'host_available'
                    ? 'bg-primary text-white'
                    : 'bg-white text-ink-muted border border-border hover:bg-surface'
                }`}
              >
                Available to Host (Caregivers)
              </button>
            </div>
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink-muted">
                <FiSearch size={16} />
              </span>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search city (e.g. Jaipur, Delhi)..."
                className="input pl-9 text-sm"
              />
            </div>
          </div>

          {/* Listings Grid */}
          {browseListings.length === 0 ? (
            <EmptyState
              icon={<FiMapPin size={32} />}
              title="No postings found"
              description="Be the first to create an adoption or hosting listing in this location!"
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {browseListings.map((listing) => (
                <div key={listing._id} className="card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-sm uppercase">
                        {listing.user?.avatar?.url ? (
                          <img src={listing.user.avatar.url} alt={listing.user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          listing.user?.name?.[0]
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink flex items-center gap-1.5">
                          {listing.user?.name}
                          {listing.user?.isVerified && (
                            <span className="text-emerald-600 text-xs font-bold" title="Verified Aadhar Account">✓</span>
                          )}
                        </h4>
                        <p className="text-xs text-ink-muted flex items-center gap-1">
                          <FiMapPin size={10} /> {listing.city}, {listing.state}
                        </p>
                      </div>
                    </div>

                    {/* Badge / Type */}
                    <div className="flex gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        listing.type === 'sitter_needed' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {listing.type === 'sitter_needed' ? 'Sitter Needed' : 'Host Available'}
                      </span>
                    </div>

                    {/* Details */}
                    {listing.type === 'sitter_needed' && (
                      <div className="bg-surface p-3 rounded-lg border border-border text-sm">
                        <p className="font-bold text-ink">Pet Information:</p>
                        <p className="text-ink-muted">
                          {listing.petName} ({listing.petSpecies} {listing.petBreed && `— ${listing.petBreed}`})
                        </p>
                      </div>
                    )}

                    {/* Date Details */}
                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      <FiCalendar size={14} className="text-primary" />
                      <span>
                        {new Date(listing.startDate).toLocaleDateString()} to {new Date(listing.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-ink-muted line-clamp-3">
                      {listing.description}
                    </p>
                  </div>

                  <div className="pt-6">
                    <Button 
                      variant="primary" 
                      className="w-full text-xs font-bold py-2.5" 
                      onClick={() => {
                        setSelectedListing(listing);
                        setConnectionModalOpen(true);
                      }}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'post' && (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handlePostSubmit} className="card p-6 md:p-8 space-y-6 shadow-sm border-border bg-white rounded-2xl">
            <h2 className="text-xl font-bold text-ink">Post Availability or Need</h2>
            
            <div className="space-y-2">
              <label className="label">I am looking to...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormType('sitter_needed')}
                  className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-center ${
                    formType === 'sitter_needed'
                      ? 'border-primary bg-primary-light text-primary font-bold shadow-sm'
                      : 'border-border bg-white text-ink hover:bg-surface'
                  }`}
                >
                  Find a Sitter for My Pet
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('host_available')}
                  className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-center ${
                    formType === 'host_available'
                      ? 'border-primary bg-primary-light text-primary font-bold shadow-sm'
                      : 'border-border bg-white text-ink hover:bg-surface'
                  }`}
                >
                  Offer Temporary Pet Hosting
                </button>
              </div>
            </div>

            {/* Pet info fields if sitter_needed */}
            {formType === 'sitter_needed' && (
              <div className="bg-surface p-4 rounded-xl border border-border space-y-4">
                <h4 className="text-sm font-bold text-ink mb-2">Pet Details</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="Pet Name"
                    required
                    value={formData.petName}
                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                  />
                  <div>
                    <label className="label">Species</label>
                    <select
                      className="select text-sm mt-1"
                      value={formData.petSpecies}
                      onChange={(e) => setFormData({ ...formData, petSpecies: e.target.value })}
                    >
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Breed / Mix"
                    value={formData.petBreed}
                    onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Location & Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="State"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Description / Requirements</label>
              <textarea
                rows={4}
                required
                className="input mt-1 text-sm resize-none"
                placeholder={
                  formType === 'sitter_needed'
                    ? 'Explain pet details, feeding times, habits, and what you expect from a host...'
                    : 'Tell pet owners about your space, daily schedule, past pet experience, and types of pets you can host...'
                }
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 font-semibold" isLoading={submitting}>
              Post Listing
            </Button>
          </form>
        </div>
      )}

      {activeTab === 'mypostings' && (
        <div className="space-y-6">
          {myListings.length === 0 ? (
            <EmptyState
              icon={<FiPlus size={32} />}
              title="You haven't posted any listings"
              description="Switch to the 'Post Availability/Requirement' tab to get started!"
            />
          ) : (
            <div className="space-y-6">
              {myListings.map((listing) => (
                <div key={listing._id} className="card p-6 shadow-sm border-border bg-white rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        listing.type === 'sitter_needed' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {listing.type === 'sitter_needed' ? 'Sitter Needed' : 'Host Available'}
                      </span>
                      <h3 className="font-bold text-ink mt-1.5">
                        {listing.type === 'sitter_needed' 
                          ? `Sitter for ${listing.petName} (${listing.petSpecies})` 
                          : 'Available to host pets'}
                      </h3>
                      <p className="text-xs text-ink-muted flex items-center gap-1.5 mt-0.5">
                        <FiMapPin size={12} /> {listing.city}, {listing.state}
                        <span className="text-border">|</span>
                        <FiCalendar size={12} /> {new Date(listing.startDate).toLocaleDateString()} to {new Date(listing.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-surface text-ink-muted border border-border rounded-lg">
                      {listing.status}
                    </span>
                  </div>

                  {/* Incoming requests for this listing */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-ink">Requests for this post:</h4>
                    {incomingRequests.filter((r) => r.listing?._id === listing._id).length === 0 ? (
                      <p className="text-xs text-ink-muted italic">No connection requests received for this listing yet.</p>
                    ) : (
                      <div className="grid gap-3">
                        {incomingRequests.filter((r) => r.listing?._id === listing._id).map((req) => (
                          <div key={req._id} className="p-4 bg-surface rounded-xl border border-border space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-bold text-primary uppercase">
                                  {req.sender?.avatar?.url ? (
                                    <img src={req.sender.avatar.url} alt={req.sender.name} className="h-full w-full rounded-full object-cover" />
                                  ) : (
                                    req.sender?.name?.[0]
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-ink flex items-center gap-1">
                                    {req.sender?.name}
                                    {req.sender?.isVerified && (
                                      <span className="text-emerald-600 text-xs font-bold" title="Verified Account">✓</span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-ink-muted">{req.sender?.address?.city}, {req.sender?.address?.state}</p>
                                </div>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-semibold ${
                                req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                                req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {req.status}
                              </span>
                            </div>

                            {req.message && (
                              <p className="text-sm text-ink-muted bg-white p-3 rounded-lg border border-border italic">
                                "{req.message}"
                              </p>
                            )}

                            {req.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRespondToRequest(req._id, 'accepted')}
                                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                >
                                  <FiCheckCircle size={14} /> Accept Request
                                </button>
                                <button
                                  onClick={() => handleRespondToRequest(req._id, 'rejected')}
                                  className="py-1.5 px-3 border border-red-200 hover:border-red-300 text-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                >
                                  <FiXCircle size={14} /> Decline
                                </button>
                              </div>
                            )}

                            {req.status === 'accepted' && (
                              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 space-y-1.5">
                                <p className="text-xs font-bold">✓ Connected! You can now contact this person:</p>
                                <div className="flex flex-wrap gap-4 text-xs">
                                  <span className="flex items-center gap-1">
                                    <FiPhone size={12} /> {req.sender?.phone || 'No phone provided'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FiMail size={12} /> {req.sender?.email}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.filter((r) => r.status === 'pending').length === 0 ? (
            <EmptyState
              icon={<FiCheckCircle size={32} />}
              title="All caught up!"
              description="No pending incoming connection requests."
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {incomingRequests.filter((r) => r.status === 'pending').map((req) => (
                <div key={req._id} className="card p-5 space-y-4 bg-white shadow-sm border-border rounded-xl">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        req.listing?.type === 'sitter_needed' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {req.listing?.type === 'sitter_needed' ? 'Need Sitter' : 'Offering Boarding'}
                      </span>
                      <h4 className="font-bold text-ink mt-1">
                        {req.listing?.type === 'sitter_needed' ? `Sitter for ${req.listing?.petName}` : 'Temporary pet boarding'}
                      </h4>
                      <p className="text-xs text-ink-muted">
                        Listing Dates: {new Date(req.listing?.startDate).toLocaleDateString()} to {new Date(req.listing?.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary uppercase text-xs">
                      {req.sender?.name?.[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{req.sender?.name}</p>
                      <p className="text-[10px] text-ink-muted">{req.sender?.address?.city}, {req.sender?.address?.state}</p>
                    </div>
                  </div>

                  {req.message && (
                    <p className="text-xs text-ink-muted italic bg-surface p-2.5 rounded-lg border border-border">
                      "{req.message}"
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespondToRequest(req._id, 'accepted')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <FiCheckCircle size={12} /> Accept Request
                    </button>
                    <button
                      onClick={() => handleRespondToRequest(req._id, 'rejected')}
                      className="py-2 px-3 border border-red-200 hover:border-red-300 text-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <FiXCircle size={12} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'myrequests' && (
        <div className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <EmptyState
              icon={<FiMessageSquare size={32} />}
              title="No connection requests sent"
              description="Find an opportunity in the 'Browse' tab and send a connection request!"
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {outgoingRequests.map((req) => (
                <div key={req._id} className="card p-5 space-y-4 bg-white shadow-sm border-border rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        req.listing?.type === 'sitter_needed' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {req.listing?.type === 'sitter_needed' ? 'Sitter Needed' : 'Host Available'}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-semibold border ${
                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-ink">
                        Listing by {req.receiver?.name}
                      </h4>
                      <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                        <FiMapPin size={10} /> {req.listing?.city || req.receiver?.address?.city}, {req.listing?.state || req.receiver?.address?.state}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                        <FiCalendar size={10} /> {req.listing && new Date(req.listing.startDate).toLocaleDateString()} to {req.listing && new Date(req.listing.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    {req.message && (
                      <div className="text-xs text-ink-muted italic bg-surface p-2.5 rounded-lg border border-border">
                        My Message: "{req.message}"
                      </div>
                    )}
                  </div>

                  {req.status === 'accepted' && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 space-y-1.5 mt-2">
                      <p className="text-xs font-bold">✓ Request Approved! Reach out to connect:</p>
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <FiPhone size={12} /> {req.receiver?.phone || 'No phone provided'}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold">
                          <FiMail size={12} /> {req.receiver?.email}
                        </span>
                      </div>
                    </div>
                  )}

                  {req.status === 'pending' && (
                    <div className="text-xs text-ink-muted bg-surface border border-border rounded-lg p-3 mt-2 flex items-center gap-1.5">
                      <FiClock className="animate-spin text-amber-500" />
                      <span>Awaiting response from {req.receiver?.name}. Contact details will show here once accepted.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connection Request Modal */}
      {connectionModalOpen && selectedListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl border border-border animate-fade-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-ink">Connect for Temporary Care</h3>
              <button 
                onClick={() => {
                  setConnectionModalOpen(false);
                  setSelectedListing(null);
                  setConnectionMessage('');
                }}
                className="text-ink-muted hover:text-ink transition-colors"
              >
                <FiXCircle size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-ink-muted">
                You are sending a connection request to <strong className="text-ink">{selectedListing.user?.name}</strong>.
              </p>
              <div className="bg-surface p-3 rounded-lg border border-border text-xs text-ink-muted">
                <strong>Post Details:</strong> {selectedListing.city}, {selectedListing.state} ({new Date(selectedListing.startDate).toLocaleDateString()} to {new Date(selectedListing.endDate).toLocaleDateString()})
              </div>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-4">
              <div>
                <label className="label">Introduce yourself and your pet requirements</label>
                <textarea
                  rows={4}
                  required
                  className="input mt-1 text-sm resize-none"
                  placeholder="Hi! I see you are traveling/hosting during these dates. I'd love to connect to discuss hosting/boarding details..."
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 py-2 text-xs" 
                  onClick={() => {
                    setConnectionModalOpen(false);
                    setSelectedListing(null);
                    setConnectionMessage('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 py-2 text-xs font-bold" 
                  isLoading={submitting}
                >
                  Send Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemporaryAdoptionPage;
