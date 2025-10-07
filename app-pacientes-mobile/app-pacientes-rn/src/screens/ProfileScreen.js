import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import patientService from '../services/patientService';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { patient, setPatient } = usePatient();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    nombre: patient?.nombre || '',
    apellido: patient?.apellido || '',
    telefono: patient?.telefono || '',
    email: patient?.email || '',
    direccion: patient?.direccion || '',
    obraSocial: patient?.obraSocial || '',
    numeroAfiliado: patient?.numeroAfiliado || '',
  });

  if (!patient) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          No hay ningún paciente registrado
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Registrar Paciente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = { ...patient, ...formData };
      
      if (patient.id) {
        await patientService.update(patient.id, updatedData);
      }
      
      await setPatient(updatedData);
      setEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: patient?.nombre || '',
      apellido: patient?.apellido || '',
      telefono: patient?.telefono || '',
      email: patient?.email || '',
      direccion: patient?.direccion || '',
      obraSocial: patient?.obraSocial || '',
      numeroAfiliado: patient?.numeroAfiliado || '',
    });
    setEditing(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-6">
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-4xl">
              {patient.nombre?.charAt(0)}{patient.apellido?.charAt(0)}
            </Text>
          </View>
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            {patient.nombre} {patient.apellido}
          </Text>
          <Text className="text-lg mt-1" style={{ color: colors.text, opacity: 0.7 }}>
            DNI: {patient.dni}
          </Text>
        </View>

        {/* Información Personal */}
        <View className="mb-6">
          <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>
            Información Personal
          </Text>

          <View className="p-4 rounded-lg mb-3" style={{ backgroundColor: colors.card }}>
            <Text className="text-sm mb-1" style={{ color: colors.text, opacity: 0.7 }}>Fecha de Nacimiento</Text>
            <Text className="text-base" style={{ color: colors.text }}>{patient.fechaNacimiento || 'No especificada'}</Text>
          </View>

          <View className="p-4 rounded-lg mb-3" style={{ backgroundColor: colors.card }}>
            <Text className="text-sm mb-1" style={{ color: colors.text, opacity: 0.7 }}>Sexo</Text>
            <Text className="text-base" style={{ color: colors.text }}>
              {patient.sexo === 'M' ? 'Masculino' : patient.sexo === 'F' ? 'Femenino' : 'No especificado'}
            </Text>
          </View>
        </View>

        {/* Datos de Contacto Editables */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Datos de Contacto
            </Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Teléfono</Text>
            <TextInput
              value={formData.telefono}
              onChangeText={(text) => updateField('telefono', text)}
              placeholder="Ingrese teléfono"
              placeholderTextColor={colors.text + '80'}
              keyboardType="phone-pad"
              editable={editing}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: editing ? colors.background : colors.card, 
                color: colors.text, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Email</Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="ejemplo@email.com"
              placeholderTextColor={colors.text + '80'}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={editing}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: editing ? colors.background : colors.card, 
                color: colors.text, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Dirección</Text>
            <TextInput
              value={formData.direccion}
              onChangeText={(text) => updateField('direccion', text)}
              placeholder="Calle, número, ciudad"
              placeholderTextColor={colors.text + '80'}
              editable={editing}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: editing ? colors.background : colors.card, 
                color: colors.text, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Obra Social</Text>
            <TextInput
              value={formData.obraSocial}
              onChangeText={(text) => updateField('obraSocial', text)}
              placeholder="Nombre de la obra social"
              placeholderTextColor={colors.text + '80'}
              editable={editing}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: editing ? colors.background : colors.card, 
                color: colors.text, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Número de Afiliado</Text>
            <TextInput
              value={formData.numeroAfiliado}
              onChangeText={(text) => updateField('numeroAfiliado', text)}
              placeholder="Número de afiliado"
              placeholderTextColor={colors.text + '80'}
              editable={editing}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: editing ? colors.background : colors.card, 
                color: colors.text, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
            />
          </View>

          {editing && (
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleCancel}
                className="flex-1 p-4 rounded-lg items-center"
                style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                className="flex-1 p-4 rounded-lg items-center"
                style={{ backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Guardar Cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}