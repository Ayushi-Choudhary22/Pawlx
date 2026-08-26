import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiVideo } from 'react-icons/fi';
import Rating from '@/components/common/Rating';
import Button from '@/components/common/Button';

const ProfessionalCard = ({ professional, onBook, ctaLabel = 'Book Now' }) => {
  const profile = professional.professionalProfile || {};

  return (
    <div className="card p-5 flex flex-col">
      <Link to={`/professionals/${professional._id}`} className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
        {professional.avatar?.url ? (
          <img src={professional.avatar.url} alt={professional.name} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold">
            {professional.name?.[0]}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-ink text-sm">{professional.name}</h3>
          <Rating value={profile.rating} count={profile.totalReviews} size={12} />
        </div>
      </Link>

      {profile.offersVideoConsultation && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary mb-2 w-fit">
          <FiVideo size={11} /> Video Consults
        </span>
      )}

      {profile.bio && <p className="text-sm text-ink-muted mb-3 line-clamp-2">{profile.bio}</p>}

      <div className="flex items-center gap-4 text-xs text-ink-muted mb-4">
        {profile.city && (
          <span className="flex items-center gap-1"><FiMapPin size={12} /> {profile.city}</span>
        )}
        {profile.experienceYears !== undefined && (
          <span className="flex items-center gap-1"><FiBriefcase size={12} /> {profile.experienceYears} yrs exp</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        {profile.consultationFee !== undefined && (
          <span className="text-sm font-semibold text-ink">₹{profile.consultationFee}</span>
        )}
        <div className="flex gap-2">
          <Link to={`/professionals/${professional._id}`}>
            <Button size="sm" variant="outline">View Profile</Button>
          </Link>
          <Button size="sm" onClick={() => onBook(professional)}>{ctaLabel}</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
