import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import patientService from '../services/patientService';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { patient, setPatient, clearPatient } = usePatient();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: patient?.email || '',
    telefono: patient?.telefono || '',
    calle: patient?.calle || '',
    numero: patient?.numero || '',
    piso: patient?.piso || '',
    departamento: patient?.departamento || '',
    ciudad: patient?.ciudad || '',
    provincia: patient?.provincia || '',
    cpostal: patient?.cpostal || '',
    peso: patient?.peso?.toString() || '',
    talla: patient?.talla?.toString() || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await patientService.updatePatient(patient.id, formData);
      if (result.success) {
        setPatient(result.patient);
        setEditing(false);
        Alert.alert('Éxito', 'Tus datos se actualizaron correctamente');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            clearPatient();
            navigation.replace('Home');
          }
        }
      ]
    );
  };

  if (!patient) {
    navigation.replace('Home');
    return null;
  }

  return (
    <ScrollView 
      className="flex-1" 
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View 
        className="rounded-2xl p-6 mb-6"
        style={{ backgroundColor: theme.colors.card }}
      >
        <View className="items-center mb-4">
          <View className="w-20 h-20 rounded-full bg-blue-600 items-center justify-center mb-3">
            <Text className="text-white text-3xl font-bold">
              {patient.nombre.charAt(0)}{patient.apellido.charAt(0)}
            </Text>
          </View>
          <Text style={{ color: theme.colors.text }} className="text-2xl font-bold">
            {patient.nombre} {patient.apellido}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
            DNI: {patient.dni}
          </Text>
        </View>
      </View>

      <View 
        className="rounded-2xl p-6 mb-6"
        style={{ backgroundColor: theme.colors.card }}
      >
        <Text style={{ color: theme.colors.text }} className="text-xl font-bold mb-4">
          Datos Personales
        </Text>
        
        <View className="mb-3">
          <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-1">
            Sexo
          </Text>
          <Text style={{ color: theme.colors.text }} className="text-base">
            {patient.sexo === 'M' ? 'Masculino' : 'Femenino'}
          </Text>
        </View>
        
        <View className="mb-3">
          <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-1">
            Fecha de Nacimiento
          </Text>
          <Text style={{ color: theme.colors.text }} className="text-base">
            {patient.fecnac}
          </Text>
        </View>
      </View>

      <View 
        className="rounded-2xl p-6 mb-6"
        style={{ backgroundColor: theme.colors.card }}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold">
            Información de Contacto
          </Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Ionicons name="pencil" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View className="gap-4">
          <View>
            <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-1">
              Email
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              editable={editing}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: editing ? theme.colors.background : 'transparent',
                color: theme.colors.text,
                borderWidth: editing ? 1 : 0,
                borderColor: theme.colors.border
              }}
              placeholder="email@ejemplo.com"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-1">
              Teléfono
            </Text>
            <TextInput
              value={formData.telefono}
              onChangeText={(text) => setFormData({...formData, telefono: text})}
              editable={editing}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: editing ? theme.colors.background : 'transparent',
                color: theme.colors.text,
                borderWidth: editing ? 1 : 0,
                borderColor: theme.colors.border
              }}
              placeholder="Número de teléfono"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-1">
              Dirección
            </Text>
            <TextInput
              value={formData.calle}
              onChangeText={(text) => setFormData({...formData, calle: text})}
              editable={editing}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: editing ? theme.colors.background : 'transparent',
                color: theme.colors.text,
                borderWidth: editing ? 1 : 0,
                borderColor: theme.colors.border
              }}
              placeholder="Calle"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        {editing && (
          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              onPress={() => {
                setEditing(false);
                setFormData({
                  email: patient?.email || '',
                  telefono: patient?.telefono || '',
                  calle: patient?.calle || '',
                });
              }}
              className="flex-1 py-3 rounded-xl"
              style={{ backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border }}
              disabled={loading}
            >
              <Text style={{ color: theme.colors.text }} className="text-center font-semibold">
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-blue-600 py-3 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold">Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 rounded-xl py-4 mb-6"
      >
        <Text className="text-white text-center font-semibold">Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;