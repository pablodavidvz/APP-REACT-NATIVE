import axios from 'axios';

const API_URL = 'https://altaluna-backend-production.up.railway.app/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de pacientes
export const patientService = {
  // Registrar nuevo paciente
  register: async (patientData) => {
    try {
      const response = await api.post('/patients/register', patientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrar paciente' };
    }
  },

  // Obtener paciente por DNI
  getByDni: async (dni) => {
    try {
      const response = await api.get(`/patients/dni/${dni}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Paciente no encontrado' };
    }
  },

  // Actualizar paciente
  update: async (id, patientData) => {
    try {
      const response = await api.put(`/patients/${id}`, patientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar paciente' };
    }
  },

  // Obtener todos los pacientes
  getAll: async () => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener pacientes' };
    }
  },

  // Buscar medicamentos
  searchMedication: async (query) => {
    try {
      const response = await api.get(`/medications/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al buscar medicamentos' };
    }
  },
};

export default patientService;