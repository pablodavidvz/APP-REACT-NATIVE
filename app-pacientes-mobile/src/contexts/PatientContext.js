import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patient, setPatientState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar paciente desde AsyncStorage al iniciar
  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      const storedPatient = await AsyncStorage.getItem('@patient_data');
      if (storedPatient) {
        setPatientState(JSON.parse(storedPatient));
      }
    } catch (error) {
      console.error('Error al cargar paciente:', error);
    } finally {
      setLoading(false);
    }
  };

  const setPatient = async (patientData) => {
    try {
      if (patientData) {
        await AsyncStorage.setItem('@patient_data', JSON.stringify(patientData));
      } else {
        await AsyncStorage.removeItem('@patient_data');
      }
      setPatientState(patientData);
    } catch (error) {
      console.error('Error al guardar paciente:', error);
    }
  };

  const clearPatient = async () => {
    try {
      await AsyncStorage.removeItem('@patient_data');
      setPatientState(null);
    } catch (error) {
      console.error('Error al limpiar paciente:', error);
    }
  };

  return (
    <PatientContext.Provider value={{ patient, setPatient, clearPatient, loading }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient debe usarse dentro de PatientProvider');
  }
  return context;
};

export default PatientContext;