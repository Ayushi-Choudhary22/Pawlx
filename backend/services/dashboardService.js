const Pet = require('../models/Pet');
const Appointment = require('../models/Appointment');
const Vaccination = require('../models/Vaccination');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

/**
 * Aggregates everything the pet-owner dashboard needs into a single call
 * so the frontend doesn't have to fire off half a dozen requests on load.
 */
const getOwnerDashboard = async (userId) => {
  const pets = await Pet.find({ owner: userId, isActive: true });
  const petIds = pets.map((p) => p._id);

  const [upcomingAppointments, dueVaccinations, activeMedicines, recentOrders, unreadNotifications] =
    await Promise.all([
      Appointment.find({ owner: userId, status: { $in: ['pending', 'confirmed'] } })
        .sort({ date: 1 })
        .limit(5)
        .populate('pet', 'name photo')
        .populate('veterinarian', 'name'),
      Vaccination.find({ pet: { $in: petIds }, nextDueDate: { $gte: new Date() } })
        .sort({ nextDueDate: 1 })
        .limit(5)
        .populate('pet', 'name photo'),
      Medicine.find({ pet: { $in: petIds }, isActive: true }).populate('pet', 'name photo'),
      Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      Notification.countDocuments({ user: userId, isRead: false }),
    ]);

  return {
    totalPets: pets.length,
    pets,
    upcomingAppointments,
    dueVaccinations,
    activeMedicines,
    recentOrders,
    unreadNotifications,
  };
};

module.exports = { getOwnerDashboard };
