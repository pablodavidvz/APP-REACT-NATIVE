import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';

export default function StudiesScreen() {
  const { colors } = useTheme();
  const { patient } = usePatient();
  const [studies, setStudies] = useState([
    {
      id: 1,
      tipo: 'Análisis de Sangre',
      fecha: '20/09/2024',
      laboratorio: 'Laboratorio Central',
      estado: 'Disponible',
      resultados: 'Ver PDF',
    },
    {
      id: 2,
      tipo: 'Radiografía de Tórax',
      fecha: '10/09/2024',
      laboratorio: 'Centro de Diagnóstico',
      estado: 'Disponible',
      resultados: 'Ver PDF',
    },
    {
      id: 3,
      tipo: 'Ecografía Abdominal',
      fecha: '05/09/2024',
      laboratorio: 'Imágenes Médicas SA',
      estado: 'Pendiente',
      resultados: 'En proceso',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudies = studies.filter(s =>
    s.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.laboratorio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!patient) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>
          Debes estar registrado para ver tus estudios
        </Text>
      </View>
    );
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Disponible':
        return '#22c55e';
      case 'Pendiente':
        return '#f59e0b';
      case 'En proceso':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStudyIcon = (tipo) => {
    if (tipo.toLowerCase().includes('sangre') || tipo.toLowerCase().includes('análisis')) {
      return '🩸';
    } else if (tipo.toLowerCase().includes('radiografía') || tipo.toLowerCase().includes('rayos')) {
      return '🩻';
    } else if (tipo.toLowerCase().includes('ecografía') || tipo.toLowerCase().includes('ultrasonido')) {
      return '📟';
    } else if (tipo.toLowerCase().includes('resonancia') || tipo.toLowerCase().includes('tomografía')) {
      return '🧲';
    }
    return '🔬';
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            Mis Estudios Médicos
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
            placeholder="Buscar por tipo o laboratorio..."
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

        {/* Estadísticas rápidas */}
        <View className="flex-row mb-4">
          <View className="flex-1 p-3 rounded-lg mr-2" style={{ backgroundColor: colors.card }}>
            <Text style={{ color: colors.text, opacity: 0.7, fontSize: 12 }}>Total</Text>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              {studies.length}
            </Text>
          </View>
          <View className="flex-1 p-3 rounded-lg ml-2" style={{ backgroundColor: colors.card }}>
            <Text style={{ color: colors.text, opacity: 0.7, fontSize: 12 }}>Disponibles</Text>
            <Text className="text-2xl font-bold" style={{ color: '#22c55e' }}>
              {studies.filter(s => s.estado === 'Disponible').length}
            </Text>
          </View>
        </View>

        {/* Lista de Estudios */}
        {filteredStudies.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-5xl mb-4">🔬</Text>
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {searchQuery ? 'No se encontraron estudios' : 'No hay estudios registrados'}
            </Text>
          </View>
        ) : (
          filteredStudies.map((study) => (
            <View
              key={study.id}
              className="p-4 rounded-lg mb-3"
              style={{ 
                backgroundColor: colors.card, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
            >
              <View className="flex-row items-start mb-3">
                <Text className="text-3xl mr-3">{getStudyIcon(study.tipo)}</Text>
                <View className="flex-1">
                  <Text className="text-lg font-bold mb-1" style={{ color: colors.text }}>
                    {study.tipo}
                  </Text>
                  <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>
                    📅 {study.fecha}
                  </Text>
                  <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>
                    🏥 {study.laboratorio}
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: getStatusColor(study.estado) }}
                >
                  <Text className="text-white text-xs font-semibold">
                    {study.estado}
                  </Text>
                </View>
              </View>

              {study.estado === 'Disponible' && (
                <TouchableOpacity
                  className="p-3 rounded-lg items-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white font-semibold">📄 Ver Resultados</Text>
                </TouchableOpacity>
              )}

              {study.estado === 'Pendiente' && (
                <View className="p-3 rounded-lg items-center" style={{ backgroundColor: colors.background }}>
                  <Text style={{ color: colors.text, opacity: 0.7 }}>
                    ⏳ Resultados en proceso
                  </Text>
                </View>
              )}
            </View>
          ))
        )}

        {/* Botón para cargar nuevo estudio */}
        <TouchableOpacity
          className="mt-4 p-4 rounded-lg items-center flex-row justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold text-lg mr-2">+</Text>
          <Text className="text-white font-semibold text-lg">Cargar Nuevo Estudio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}