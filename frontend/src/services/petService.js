import axiosInstance from './axiosInstance';

export const petService = {
  getMyPets: () => axiosInstance.get('/pets').then((res) => res.data),
  getPetById: (id) => axiosInstance.get(`/pets/${id}`).then((res) => res.data),
  createPet: (payload) => axiosInstance.post('/pets', payload).then((res) => res.data),
  updatePet: (id, payload) => axiosInstance.put(`/pets/${id}`, payload).then((res) => res.data),
  deletePet: (id) => axiosInstance.delete(`/pets/${id}`).then((res) => res.data),
  uploadPhoto: (id, formData) =>
    axiosInstance
      .post(`/pets/${id}/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),

  getVaccinations: (petId) => axiosInstance.get(`/pets/${petId}/vaccinations`).then((res) => res.data),
  addVaccination: (petId, payload) =>
    axiosInstance.post(`/pets/${petId}/vaccinations`, payload).then((res) => res.data),

  getMedicines: (petId) => axiosInstance.get(`/pets/${petId}/medicines`).then((res) => res.data),
  addMedicine: (petId, payload) =>
    axiosInstance.post(`/pets/${petId}/medicines`, payload).then((res) => res.data),

  getMedicalRecords: (petId) =>
    axiosInstance.get(`/pets/${petId}/medical-records`).then((res) => res.data),
  addMedicalRecord: (petId, payload) =>
    axiosInstance.post(`/pets/${petId}/medical-records`, payload).then((res) => res.data),
};
