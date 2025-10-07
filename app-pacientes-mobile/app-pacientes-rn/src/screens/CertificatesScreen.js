import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';

export default function CertificatesScreen() {
  const { colors } = useTheme();
  const { patient } = usePatient();
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      tipo: 'Certificado Médico',
      fecha: '25/09/2024',
      medico: 'Dr. Juan Pérez',
      motivo: 'Reposo por gripe',
      dias: '3 días',
      vigencia: 'Vigente',
    },
    {
      id: 2,
      tipo: 'Certificado de Aptitud Física',
      fecha: '15/09/2024',
      medico: 'Dra. María González',
      motivo: 'Actividad deportiva',
      dias: 'N/A',
      vigencia: 'Vigente',
    },
    {
      id: 3,
      tipo: 'Certificado Médico',
      fecha: '01/09/2024',
      medico: 'Dr. Carlos Rodríguez',
      motivo: 'Control post-operatorio',
      dias: '7 días',
      vigencia: 'Vencido',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCertificates = certificates.filter(c =>
    c.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.medico.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.motivo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!patient) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>
          Debes estar registrado para ver tus certificados
        </Text>
      </View>
    );
  }

  const getCertificateIcon = (tipo) => {
    if (tipo.toLowerCase().includes('aptitud')) {
      return '💪';
    } else if (tipo.toLowerCase().includes('reposo')) {
      return '🛏️';
    } else if (tipo.toLowerCase().includes('vacuna')) {
      return '💉';
    }
    return '📄';
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            Mis Certificados Médicos
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
            placeholder="Buscar por tipo, médico o motivo..."
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
              {certificates.length}
            </Text>
          </View>
          <View className="flex-1 p-3 rounded-lg ml-2" style={{ backgroundColor: colors.card }}>
            <Text style={{ color: colors.text, opacity: 0.7, fontSize: 12 }}>Vigentes</Text>
            <Text className="text-2xl font-bold" style={{ color: '#22c55e' }}>
              {certificates.filter(c => c.vigencia === 'Vigente').length}
            </Text>
          </View>
        </View>

        {/* Lista de Certificados */}
        {filteredCertificates.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-5xl mb-4">📋</Text>
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {searchQuery ? 'No se encontraron certificados' : 'No hay certificados registrados'}
            </Text>
          </View>
        ) : (
          filteredCertificates.map((certificate) => (
            <View
              key={certificate.id}
              className="p-4 rounded-lg mb-3"
              style={{ 
                backgroundColor: colors.card, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-start flex-1">
                  <Text className="text-3xl mr-3">{getCertificateIcon(certificate.tipo)}</Text>
                  <View className="flex-1">
                    <Text className="text-lg font-bold mb-1" style={{ color: colors.text }}>
                      {certificate.tipo}
                    </Text>
                    <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>
                      👨‍⚕️ {certificate.medico}
                    </Text>
                    <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>
                      📅 {certificate.fecha}
                    </Text>
                  </View>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: certificate.vigencia === 'Vigente' ? '#22c55e' : '#ef4444' 
                  }}
                >
                  <Text className="text-white text-xs font-semibold">
                    {certificate.vigencia}
                  </Text>
                </View>
              </View>

              <View 
                className="p-3 rounded-lg mb-3"
                style={{ backgroundColor: colors.background }}
              >
                <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13, marginBottom: 4 }}>
                  <Text style={{ fontWeight: '600' }}>Motivo:</Text> {certificate.motivo}
                </Text>
                {certificate.dias !== 'N/A' && (
                  <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>
                    <Text style={{ fontWeight: '600' }}>Duración:</Text> {certificate.dias}
                  </Text>
                )}
              </View>

              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="flex-1 p-3 rounded-lg items-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white font-semibold">📄 Ver PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 p-3 rounded-lg items-center"
                  style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}
                >
                  <Text style={{ color: colors.text, fontWeight: '600' }}>↗️ Compartir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Botón para solicitar nuevo certificado */}
        <TouchableOpacity
          className="mt-4 p-4 rounded-lg items-center flex-row justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold text-lg mr-2">+</Text>
          <Text className="text-white font-semibold text-lg">Solicitar Certificado</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}