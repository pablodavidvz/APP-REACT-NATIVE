import axios from 'axios';

// URL base de la API - CAMBIAR según tu configuración
const API_URL = 'https://app-pacientes-server-production.up.railway.app/app-pacientes-server/api';

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
    config.headers['X-App-Version'] = '1.0.0';
    config.headers['X-App-Platform'] = 'mobile';
    return config;
  },
  (error) => {
    console.error('Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifica los datos.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 409:
          errorMessage = 'Ya existe un registro con esos datos.';
          break;
        case 500:
          errorMessage = 'Error en el servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = `Error ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = 'No se recibió respuesta del servidor.';
    }

    const customError = new Error(errorMessage);
    customError.originalError = error;
    customError.type = error.response ? 'server' : 'network';
    
    return Promise.reject(customError);
  }
);

// Función para formatear fecha
const formatDateToISO = (dateString) => {
  if (!dateString || dateString === 'No disponible') return '';
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const patientService = {
  // Verificar paciente por DNI
  checkPatientByDni: async (dni, dniScanData = null) => {
    try {
      console.log('🔍 Verificando paciente por DNI:', dni);
      
      const config = {};
      if (dniScanData) {
        config.headers = {
          'X-DNI-Data': JSON.stringify(dniScanData)
        };
      }

      const response = await API.get(`/patients/check/${dni}`, config);
      return response.data;
    } catch (error) {
      console.error('❌ Error al verificar paciente:', error);
      throw error;
    }
  },

  // Registrar nuevo paciente
  registerPatient: async (patientData) => {
    try {
      const formattedData = {
        ...patientData,
        dni: String(patientData.dni),
        peso: patientData.peso ? Number(patientData.peso) : null,
        talla: patientData.talla ? Number(patientData.talla) : null,
        email: patientData.email || null,
        telefono: patientData.telefono || null,
        calle: patientData.calle || null,
        numero: patientData.numero || null,
        piso: patientData.piso || null,
        departamento: patientData.departamento || null,
        ciudad: patientData.ciudad || null,
        provincia: patientData.provincia || null,
        cpostal: patientData.cpostal || null
      };

      const response = await API.post('/patients', formattedData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al registrar paciente:', error);
      throw error;
    }
  },

  // Actualizar paciente
  updatePatient: async (id, updatedData) => {
    try {
      const formattedData = Object.fromEntries(
        Object.entries(updatedData)
          .filter(([_, value]) => value !== '')
          .map(([key, value]) => {
            if (key === 'peso' || key === 'talla') {
              return [key, value ? Number(value) : null];
            }
            return [key, value];
          })
      );

      const response = await API.put(`/patients/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar paciente:', error);
      throw error;
    }
  },

  // Obtener recetas del paciente
  getPatientPrescriptions: async (dni) => {
    try {
      const response = await API.get(`/prescriptions/dni/${dni}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener recetas:', error);
      throw error;
    }
  },

  // Obtener estudios del paciente
  getPatientStudies: async (dni) => {
    try {
      const response = await API.get(`/prescriptions/studies/dni/${dni}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estudios:', error);
      throw error;
    }
  },

  // Obtener certificados del paciente
  getPatientCertificates: async (dni) => {
    try {
      const response = await API.get(`/prescriptions/certificates/dni/${dni}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener certificados:', error);
      throw error;
    }
  }
};

export default patientService;