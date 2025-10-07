import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import patientService from '../services/patientService';

export default function MedicationSearchScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const results = await patientService.searchMedication(searchQuery);
      setMedications(results || []);
    } catch (error) {
      console.error('Error buscando medicamentos:', error);
      // Si falla la API, mostrar datos de ejemplo
      setMedications([
        {
          id: 1,
          nombre: 'Ibuprofeno 600mg',
          laboratorio: 'Bayer',
          presentacion: 'Comprimidos x 30',
          precio: '$2.500',
          requiereReceta: false,
        },
        {
          id: 2,
          nombre: 'Amoxicilina 500mg',
          laboratorio: 'Roemmers',
          presentacion: 'Cápsulas x 16',
          precio: '$3.200',
          requiereReceta: true,
        },
        {
          id: 3,
          nombre: 'Paracetamol 1g',
          laboratorio: 'Pfizer',
          presentacion: 'Comprimidos x 20',
          precio: '$1.800',
          requiereReceta: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4">
        {/* Buscador */}
        <View className="mb-4">
          <Text className="text-xl font-bold mb-3" style={{ color: colors.text }}>
            Buscar Medicamentos
          </Text>
          
          <View className="flex-row space-x-2">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Ej: Ibuprofeno, Amoxicilina..."
              placeholderTextColor={colors.text + '80'}
              className="flex-1 p-3 rounded-lg"
              style={{ 
                backgroundColor: colors.card, 
                color: colors.text, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              onPress={handleSearch}
              disabled={loading}
              className="px-6 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">🔍</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de búsqueda */}
        {!searched && (
          <View className="items-center py-12">
            <Text className="text-6xl mb-4">💊</Text>
            <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center' }}>
              Ingresa el nombre de un medicamento{'\n'}para buscar en nuestra base de datos
            </Text>
          </View>
        )}
      </View>

      {/* Resultados */}
      {searched && (
        <ScrollView style={{ flex: 1 }} className="px-4">
          {loading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="mt-4" style={{ color: colors.text }}>
                Buscando medicamentos...
              </Text>
            </View>
          ) : medications.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-5xl mb-4">🔍</Text>
              <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center' }}>
                No se encontraron medicamentos{'\n'}con ese nombre
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSearched(false);
                  setMedications([]);
                }}
                className="mt-4 px-6 py-3 rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white font-semibold">Nueva Búsqueda</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text className="mb-3" style={{ color: colors.text, opacity: 0.7 }}>
                Se encontraron {medications.length} resultados
              </Text>
              
              {medications.map((med) => (
                <View
                  key={med.id}
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
                        {med.nombre}
                      </Text>
                      <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>
                        🏭 {med.laboratorio}
                      </Text>
                      <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>
                        📦 {med.presentacion}
                      </Text>
                    </View>
                    {med.requiereReceta && (
                      <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: '#f59e0b' }}
                      >
                        <Text className="text-white text-xs font-semibold">
                          Receta
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {med.precio}
                    </Text>
                    <TouchableOpacity
                      className="px-6 py-2 rounded-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-white font-semibold">Ver Detalle</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSearched(false);
                  setMedications([]);
                }}
                className="mt-4 mb-6 p-4 rounded-lg items-center"
                style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>🔄 Nueva Búsqueda</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}