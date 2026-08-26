import { Link } from 'react-router-dom';
import { FiMapPin, FiCheckCircle } from 'react-icons/fi';

const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', bird: '🐦', rabbit: '🐰', fish: '🐠', reptile: '🦎', other: '🐾' };

const AdoptionCard = ({ pet }) => {
  return (
    <Link to={`/adoption/${pet._id}`} className="card overflow-hidden group block">
      <div className="relative h-44 bg-secondary-light overflow-hidden">
        {pet.photos?.[0]?.url ? (
          <img
            src={pet.photos[0].url}
            alt={pet.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-5xl">
            {SPECIES_EMOJI[pet.species] || '🐾'}
          </div>
        )}
        {pet.isVaccinated && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/95 text-secondary text-xs font-medium px-2 py-1 rounded-full">
            <FiCheckCircle size={11} /> Vaccinated
          </span>
        )}
        <span
          className={`absolute top-2.5 right-2.5 text-xs font-medium px-2 py-1 rounded-full ${
            pet.adoptionType === 'foster' ? 'bg-accent text-white' : 'bg-primary text-white'
          }`}
        >
          {pet.adoptionType === 'foster' ? 'Foster' : 'Adopt'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink">{pet.name}</h3>
        <p className="text-xs text-ink-muted capitalize mb-2">
          {pet.breed || pet.species} · {pet.gender}
          {pet.age?.years ? ` · ${pet.age.years}y ${pet.age.months || 0}m` : ''}
        </p>
        {pet.location?.city && (
          <p className="flex items-center gap-1 text-xs text-ink-muted">
            <FiMapPin size={11} /> {pet.location.city}
            {pet.location.state ? `, ${pet.location.state}` : ''}
          </p>
        )}
      </div>
    </Link>
  );
};

export default AdoptionCard;
