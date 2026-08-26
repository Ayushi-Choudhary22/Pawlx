import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const SPECIES_EMOJI = {
  dog: '🐶',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  fish: '🐠',
  reptile: '🦎',
  other: '🐾',
};

const PetCard = ({ pet }) => {
  return (
    <Link to={`/pet-care/${pet._id}`} className="card p-4 hover:shadow-cardHover transition-shadow block">
      <div className="h-32 w-full rounded-lg bg-primary-light overflow-hidden mb-3 flex items-center justify-center">
        {pet.photo?.url ? (
          <img src={pet.photo.url} alt={pet.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl">{SPECIES_EMOJI[pet.species] || '🐾'}</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-ink">{pet.name}</h3>
          <p className="text-xs text-ink-muted capitalize">
            {pet.breed || pet.species} · {pet.gender}
          </p>
        </div>
        <FiHeart className="text-accent" size={16} />
      </div>
    </Link>
  );
};

export default PetCard;
