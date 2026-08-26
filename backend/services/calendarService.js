const Appointment = require('../models/Appointment');
const GroomingBooking = require('../models/GroomingBooking');
const PetSitterBooking = require('../models/PetSitterBooking');
const Medicine = require('../models/Medicine');
const Vaccination = require('../models/Vaccination');
const Pet = require('../models/Pet');

/**
 * Builds a single unified feed of every date-based event relevant to a pet owner:
 * vet appointments, grooming bookings, pet-sitter stays, active medicine reminders,
 * and upcoming vaccination due dates. Each event is normalized to a common shape
 * so the frontend can render one calendar without knowing about five different models.
 */
const getMyCalendarEvents = async (ownerId) => {
  const pets = await Pet.find({ owner: ownerId, isActive: true }).select('_id name');
  const petIds = pets.map((p) => p._id);
  const petNameById = Object.fromEntries(pets.map((p) => [p._id.toString(), p.name]));

  const [appointments, groomingBookings, sitterBookings, medicines, vaccinations] = await Promise.all([
    Appointment.find({ owner: ownerId, status: { $ne: 'cancelled' } })
      .populate('veterinarian', 'name')
      .select('pet date timeSlot status veterinarian reason'),
    GroomingBooking.find({ owner: ownerId, status: { $ne: 'cancelled' } })
      .populate('groomer', 'name')
      .select('pet date timeSlot status groomer package'),
    PetSitterBooking.find({ owner: ownerId, status: { $ne: 'cancelled' } })
      .populate('sitter', 'name')
      .select('pet startDate endDate status sitter'),
    Medicine.find({ pet: { $in: petIds }, isActive: true }).select('pet name startDate endDate frequency'),
    Vaccination.find({ pet: { $in: petIds }, nextDueDate: { $ne: null } }).select('pet name nextDueDate'),
  ]);

  const events = [];

  appointments.forEach((a) => {
    events.push({
      id: a._id,
      type: 'vet',
      title: `Vet visit: ${petNameById[a.pet.toString()] || 'Pet'}`,
      subtitle: `with Dr. ${a.veterinarian?.name || ''} · ${a.reason}`,
      date: a.date,
      status: a.status,
      link: '/appointments',
    });
  });

  groomingBookings.forEach((g) => {
    events.push({
      id: g._id,
      type: 'grooming',
      title: `Grooming: ${petNameById[g.pet.toString()] || 'Pet'}`,
      subtitle: `${g.package} with ${g.groomer?.name || ''}`,
      date: g.date,
      status: g.status,
      link: '/appointments',
    });
  });

  sitterBookings.forEach((s) => {
    events.push({
      id: s._id,
      type: 'sitter',
      title: `Pet sitting: ${petNameById[s.pet.toString()] || 'Pet'}`,
      subtitle: `with ${s.sitter?.name || ''}`,
      date: s.startDate,
      endDate: s.endDate,
      status: s.status,
      link: '/appointments',
    });
  });

  medicines.forEach((m) => {
    events.push(...expandMedicineOccurrences(m, petNameById[m.pet.toString()] || 'Pet'));
  });

  vaccinations.forEach((v) => {
    events.push({
      id: v._id,
      type: 'vaccination',
      title: `Vaccination due: ${v.name}`,
      subtitle: petNameById[v.pet.toString()] || 'Pet',
      date: v.nextDueDate,
      status: 'due',
      link: `/pet-care/${v.pet}`,
    });
  });

  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Expands a medicine reminder into individual calendar occurrences based on its
 * frequency, capped to a reasonable window so recurring reminders don't run forever.
 * - daily/twice/thrice-daily and 'as_needed' -> one occurrence per day
 * - weekly -> one occurrence every 7 days from the start date
 */
const OCCURRENCE_WINDOW_DAYS = 60;

const expandMedicineOccurrences = (medicine, petName) => {
  const occurrences = [];
  const today = new Date();
  const windowEnd = new Date(today);
  windowEnd.setDate(windowEnd.getDate() + OCCURRENCE_WINDOW_DAYS);

  const start = new Date(medicine.startDate);
  const end = medicine.endDate ? new Date(medicine.endDate) : windowEnd;
  const rangeEnd = end < windowEnd ? end : windowEnd;
  const rangeStart = start > today ? start : today;

  if (rangeStart > rangeEnd) return occurrences;

  const stepDays = medicine.frequency === 'weekly' ? 7 : 1;
  const cursor = new Date(rangeStart);

  // Align weekly occurrences to the original start date's weekday
  if (stepDays === 7) {
    const diffDays = Math.floor((cursor - start) / (1000 * 60 * 60 * 24));
    const offset = diffDays % 7;
    if (offset !== 0) cursor.setDate(cursor.getDate() + (7 - offset));
  }

  while (cursor <= rangeEnd) {
    occurrences.push({
      id: `${medicine._id}-${cursor.toISOString().slice(0, 10)}`,
      type: 'medicine',
      title: `Medicine: ${medicine.name}`,
      subtitle: `${petName} · ${medicine.frequency.replace('_', ' ')}`,
      date: new Date(cursor),
      status: 'active',
      link: `/pet-care/${medicine.pet}`,
    });
    cursor.setDate(cursor.getDate() + stepDays);
  }

  return occurrences;
};

module.exports = { getMyCalendarEvents };
