import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const MedicationSearchScreen = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 16 }}>
      <View className="items-center mb-6">
        <Ionicons name="search-outline" size={48} color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text }} className="text-2xl font-bold mt-2">
          Buscar Medicamentos
        </Text>
      </View>

      <View className="mb-4">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Ingresá el nombre del medicamento..."
          className="p-4 rounded-xl"
          style={{ 
            backgroundColor: theme.colors.card, 
            color: theme.colors.text, 
            borderWidth: 1, 
            borderColor: theme.colors.border 
          }}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <TouchableOpacity
        className="bg-blue-600 rounded-xl py-4 mb-6"
        onPress={() => {}}
      >
        <Text className="text-white text-center font-semibold">Buscar</Text>
      </TouchableOpacity>

      <View className="items-center py-12">
        <Ionicons name="flask-outline" size={64} color={theme.colors.textSecondary} />
        <Text style={{ color: theme.colors.textSecondary }} className="text-center mt-4">
          Funcionalidad en desarrollo
        </Text>
      </View>
    </ScrollView>
  );
};

export default MedicationSearchScreen;