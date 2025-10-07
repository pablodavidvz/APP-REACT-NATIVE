import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';

export default function PrescriptionsScreen() {
  const { colors } = useTheme();
  const { patient } = usePatient();
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      fecha: '15/09/2024',
      medico: 'Dr. Juan Pérez',
      medicamentos: ['Ibuprofeno 600mg', 'Amoxicilina 500mg'],
      vigencia: '30 días',
    },
    {
      id: 2,
      fecha: '01/09/2024',
      medico: 'Dra. María González',
      medicamentos: ['Paracetamol 1g'],
      vigencia: 'Vencida',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrescriptions = prescriptions.filter(p =>
    p.medico.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medicamentos.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!patient) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>
          Debes estar registrado para ver tus recetas
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            Mis Recetas Médicas
          </Text>
          <Text style={{ color: colors.text, opacity: 0.7 }}>
            Paciente: {patient.nombre} {patient.apellido}
          </Text>
        </View>

        {/* Buscador */}
        <View className="mb-4">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por médico o medicamento..."
            placeholderTextColor={colors.text + '80'}
            className="p-3 rounded-lg"
            style={{ 
              backgroundColor: colors.card, 
              color: colors.text, 
              borderWidth: 1, 
              borderColor: colors.border 
            }}
          />
        </View>

        {/* Lista de Recetas */}
        {filteredPrescriptions.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-5xl mb-4">📋</Text>
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {searchQuery ? 'No se encontraron recetas' : 'No hay recetas registradas'}
            </Text>
          </View>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <View
              key={prescription.id}
              className="p-4 rounded-lg mb-3"
              style={{ 
                backgroundColor: colors.card, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold mb-1" style={{ color: colors.text }}>
                    {prescription.medico}
                  </Text>
                  <Text style={{ color: colors.text, opacity: 0.7 }}>
                    {prescription.fecha}
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: prescription.vigencia === 'Vencida' ? '#ef4444' : '#22c55e' 
                  }}
                >
                  <Text className="text-white text-xs font-semibold">
                    {prescription.vigencia}
                  </Text>
                </View>
              </View>

              <View className="mb-3">
                <Text className="font-semibold mb-2" style={{ color: colors.text }}>
                  Medicamentos:
                </Text>
                {prescription.medicamentos.map((med, index) => (
                  <View key={index} className="flex-row items-center mb-1">
                    <Text style={{ color: colors.text, opacity: 0.7 }}>• {med}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                className="p-3 rounded-lg items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white font-semibold">Ver Detalle</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Botón para nueva receta */}
        <TouchableOpacity
          className="mt-4 p-4 rounded-lg items-center flex-row justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold text-lg mr-2">+</Text>
          <Text className="text-white font-semibold text-lg">Cargar Nueva Receta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}