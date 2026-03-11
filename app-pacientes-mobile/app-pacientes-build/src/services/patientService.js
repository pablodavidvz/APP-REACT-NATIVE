import axios from 'axios';

// URL base de la API - IP LOCAL
const API_URL = 'https://api.recetasalud.ar/app-pacientes-server/api';

// Configuración de axios
const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para requests
API.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
API.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status);
    return response;
  },
  (error) => {
    let errorMessage = 'Error de conexión.';
    
    if (error.response) {
      console.error('❌ Error response:', error.response.status);
      errorMessage = error.response.data?.message || `Error ${error.response.status}`;
    } else if (error.request) {
      console.error('❌ No response');
      errorMessage = 'No se recibió respuesta del servidor.';
    }

    const customError = new Error(errorMessage);
    customError.originalError = error;
    
    return Promise.reject(customError);
  }
);

const patientService = {
  // Registrar nuevo paciente
  register: async (patientData) => {
    try {
      console.log('📝 Registrando nuevo paciente:', patientData);
      const response = await API.post('/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      throw error;
    }
  },

  // Verificar paciente por DNI con datos del escaneo
  checkPatientWithDNIData: async (dni, dniData) => {
    try {
      console.log('🔍 Verificando paciente:', dni);
      const response = await API.post(`/patients/check/${dni}`, dniData);
      return response.data;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  },

  // Verificar si existe por DNI (método simple)
  checkPatientByDNI: async (dni) => {
    try {
      console.log('🔍 Verificando DNI simple:', dni);
      const response = await API.get(`/patients/check/${dni}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al verificar DNI:', error);
      return { exists: false };
    }
  },

  // Crear nuevo paciente
  createPatient: async (patientData) => {
    try {
      console.log('📝 Creando paciente:', patientData);
      const response = await API.post('/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  },

  // Actualizar paciente
  updatePatient: async (patientId, updateData) => {
    try {
      const response = await API.put(`/patients/${patientId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener obras sociales
  getObrasSociales: async () => {
    try {
      console.log('🏥 Obteniendo obras sociales...');
      const response = await API.get('/obras-sociales');
      // El backend devuelve { success, count, data: [...] }
      const obrasSociales = response.data.data || response.data || [];
      console.log(`✅ Se obtuvieron ${obrasSociales.length} obras sociales`);
      // Mapear campos para compatibilidad (sigla -> nombre display)
      return obrasSociales.map(os => ({
        id: os.id,
        nombre: os.descripcion || os.nombre,
        sigla: os.sigla,
        estado: os.estado
      }));
    } catch (error) {
      console.error('❌ Error al obtener obras sociales:', error);
      return [];
    }
  },

  // Buscar obras sociales por término
  searchObrasSociales: async (searchTerm) => {
    try {
      console.log('🔍 Buscando obras sociales:', searchTerm);
      const response = await API.get(`/obras-sociales/search?q=${encodeURIComponent(searchTerm)}`);
      const obrasSociales = response.data.data || response.data || [];
      return obrasSociales.map(os => ({
        id: os.id,
        nombre: os.descripcion || os.nombre,
        sigla: os.sigla,
        estado: os.estado
      }));
    } catch (error) {
      console.error('❌ Error al buscar obras sociales:', error);
      return [];
    }
  },

  // Obtener recetas por DNI
  getPrescriptionsByDNI: async (dni) => {
    try {
      const response = await API.get(`/prescriptions/dni/${dni}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estudios por DNI
  getStudiesByDNI: async (dni) => {
    try {
      const response = await API.get(`/prescriptions/studies/dni/${dni}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener certificados por DNI
  getCertificatesByDNI: async (dni) => {
    try {
      const response = await API.get(`/prescriptions/certificates/dni/${dni}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar medicamentos
  searchMedication: async (searchTerm) => {
    try {
      console.log('🔍 Buscando medicamento:', searchTerm);
      
      const mockMedications = [
        {
          id: 1,
          nombre: 'Ibuprofeno 600mg',
          laboratorio: 'Bayer',
          presentacion: 'Comprimidos x 30',
          precio: 2500,
          requiereReceta: false
        },
        {
          id: 2,
          nombre: 'Amoxicilina 500mg',
          laboratorio: 'Roemmers',
          presentacion: 'Cápsulas x 16',
          precio: 3200,
          requiereReceta: true
        },
        {
          id: 3,
          nombre: 'Paracetamol 1g',
          laboratorio: 'Pfizer',
          presentacion: 'Comprimidos x 20',
          precio: 1800,
          requiereReceta: false
        },
        {
          id: 4,
          nombre: 'Omeprazol 20mg',
          laboratorio: 'Gador',
          presentacion: 'Cápsulas x 14',
          precio: 2100,
          requiereReceta: false
        },
        {
          id: 5,
          nombre: 'Atorvastatina 20mg',
          laboratorio: 'Pfizer',
          presentacion: 'Comprimidos x 30',
          precio: 4500,
          requiereReceta: true
        }
      ];

      const results = mockMedications.filter(med => 
        med.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log(`✅ Se encontraron ${results.length} medicamentos`);
      
      return {
        success: true,
        results: results,
        count: results.length
      };
    } catch (error) {
      console.error('❌ Error buscando medicamentos:', error);
      throw error;
    }
  },
};

export default patientService;
