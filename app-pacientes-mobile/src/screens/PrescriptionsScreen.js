import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import { useNavigation } from '@react-navigation/native';
import patientService from '../services/patientService';

const PrescriptionsScreen = () => {
  const { theme } = useTheme();
  const { patient } = usePatient();
  const navigation = useNavigation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient) {
      loadPrescriptions();
    }
  }, [patient]);

  const loadPrescriptions = async () => {
    try {
      const data = await patientService.getPatientPrescriptions(patient.dni);
      setPrescriptions(data.prescriptions || []);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) {
    return (
      <View className="flex-1 justify-center items-center p-6" style={{ backgroundColor: theme.colors.background }}>
        <Ionicons name="warning-outline" size={64} color={theme.colors.textSecondary} />
        <Text style={{ color: theme.colors.text }} className="text-xl font-bold text-center mt-4">
          Sesión requerida
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Scanner')} className="bg-blue-600 mt-4 px-6 py-3 rounded-xl">
          <Text className="text-white font-semibold">Escanear DNI</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 16 }}>
      <View className="items-center mb-6">
        <Ionicons name="medical-outline" size={48} color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text }} className="text-2xl font-bold mt-2">Recetas Médicas</Text>
      </View>

      {prescriptions.length === 0 ? (
        <View className="items-center py-12">
          <Ionicons name="documents-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={{ color: theme.colors.textSecondary }} className="text-center mt-4">
            No hay recetas médicas disponibles
          </Text>
        </View>
      ) : (
        prescriptions.map((prescription, index) => (
          <View key={index} className="rounded-xl p-4 mb-4" style={{ backgroundColor: theme.colors.card }}>
            <Text style={{ color: theme.colors.text }} className="font-bold">{prescription.medication}</Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-sm">{prescription.date}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default PrescriptionsScreen;