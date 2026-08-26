import { SPECIES_OPTIONS } from '@/constants';

const AdoptionFilters = ({ filters, onChange }) => {
  return (
    <div className="card p-4 space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-ink mb-2.5">Type</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input type="radio" checked={!filters.adoptionType} onChange={() => onChange({ ...filters, adoptionType: '' })} />
            All
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input
              type="radio"
              checked={filters.adoptionType === 'permanent'}
              onChange={() => onChange({ ...filters, adoptionType: 'permanent' })}
            />
            Permanent Adoption
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input
              type="radio"
              checked={filters.adoptionType === 'foster'}
              onChange={() => onChange({ ...filters, adoptionType: 'foster' })}
            />
            Foster / Temporary
          </label>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink mb-2.5">Species</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input type="radio" checked={!filters.species} onChange={() => onChange({ ...filters, species: '' })} />
            All
          </label>
          {SPECIES_OPTIONS.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer capitalize">
              <input
                type="radio"
                checked={filters.species === s}
                onChange={() => onChange({ ...filters, species: s })}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink mb-2.5">Gender</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input type="radio" checked={!filters.gender} onChange={() => onChange({ ...filters, gender: '' })} />
            All
          </label>
          {['male', 'female'].map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer capitalize">
              <input
                type="radio"
                checked={filters.gender === g}
                onChange={() => onChange({ ...filters, gender: g })}
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink mb-2.5">City</h4>
        <input
          type="text"
          placeholder="e.g. Jodhpur"
          className="input text-sm"
          value={filters.city || ''}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
        />
      </div>
    </div>
  );
};

export default AdoptionFilters;
