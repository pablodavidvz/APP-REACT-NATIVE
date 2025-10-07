import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import { useNavigation } from '@react-navigation/native';
import patientService from '../services/patientService';

const CertificatesScreen = () => {
  const { theme } = useTheme();
  const { patient } = usePatient();
  const navigation = useNavigation();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient) {
      loadCertificates();
    }
  }, [patient]);

  const loadCertificates = async () => {
    try {
      const data = await patientService.getPatientCertificates(patient.dni);
      setCertificates(data.certificates || []);
    } catch (error) {
      console.error('Error al cargar certificados:', error);
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
        <Ionicons name="clipboard-outline" size={48} color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text }} className="text-2xl font-bold mt-2">Certificados Médicos</Text>
      </View>

      {certificates.length === 0 ? (
        <View className="items-center py-12">
          <Ionicons name="document-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={{ color: theme.colors.textSecondary }} className="text-center mt-4">
            No hay certificados médicos disponibles
          </Text>
        </View>
      ) : (
        certificates.map((cert, index) => (
          <View key={index} className="rounded-xl p-4 mb-4" style={{ backgroundColor: theme.colors.card }}>
            <Text style={{ color: theme.colors.text }} className="font-bold">{cert.type}</Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-sm">{cert.date}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default CertificatesScreen;