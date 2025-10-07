import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import patientService from '../services/patientService';

export default function RegisterScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { setPatient } = usePatient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Datos del formulario
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    sexo: '',
    telefono: '',
    email: '',
    direccion: '',
    obraSocial: '',
    numeroAfiliado: '',
  });

  // Si vienen datos escaneados, pre-llenar el formulario
  useEffect(() => {
    if (route.params?.scannedData) {
      const scanned = route.params.scannedData;
      setFormData(prev => ({
        ...prev,
        dni: scanned.dni || '',
        nombre: scanned.nombre || '',
        apellido: scanned.apellido || '',
        fechaNacimiento: scanned.fechaNacimiento || '',
        sexo: scanned.sexo || '',
      }));
    }
  }, [route.params]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.dni || !formData.nombre || !formData.apellido || !formData.fechaNacimiento) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios del Paso 1');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!formData.telefono || !formData.email) {
      Alert.alert('Error', 'Por favor complete teléfono y email');
      return;
    }

    setLoading(true);
    try {
      const result = await patientService.register(formData);
      await setPatient(result.patient || formData);
      
      Alert.alert(
        'Registro Exitoso',
        'El paciente ha sido registrado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo registrar el paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4">
        {/* Indicador de pasos */}
        <View className="flex-row justify-center mb-6">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: step === 1 ? colors.primary : colors.card }}
            >
              <Text style={{ color: step === 1 ? '#fff' : colors.text }}>1</Text>
            </View>
            <View
              className="w-16 h-1"
              style={{ backgroundColor: step === 2 ? colors.primary : colors.border }}
            />
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: step === 2 ? colors.primary : colors.card }}
            >
              <Text style={{ color: step === 2 ? '#fff' : colors.text }}>2</Text>
            </View>
          </View>
        </View>

        <Text className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
          {step === 1 ? 'Datos Personales' : 'Datos de Contacto'}
        </Text>

        {step === 1 ? (
          // PASO 1: Datos personales
          <View>
            <View className="mb-4">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>DNI *</Text>
              <TextInput
                value={formData.dni}
                onChangeText={(text) => updateField('dni', text)}
                placeholder="Ingrese DNI"
                placeholderTextColor={colors.text + '80'}
                keyboardType="numeric"
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Nombre *</Text>
              <TextInput
                value={formData.nombre}
                onChangeText={(text) => updateField('nombre', text)}
                placeholder="Ingrese nombre"
                placeholderTextColor={colors.text + '80'}
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Apellido *</Text>
              <TextInput
                value={formData.apellido}
                onChangeText={(text) => updateField('apellido', text)}
                placeholder="Ingrese apellido"
                placeholderTextColor={colors.text + '80'}
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Fecha de Nacimiento *</Text>
              <TextInput
                value={formData.fechaNacimiento}
                onChangeText={(text) => updateField('fechaNacimiento', text)}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.text + '80'}
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="mb-6">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Sexo</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => updateField('sexo', 'M')}
                  className="flex-1 p-3 rounded-lg items-center"
                  style={{ 
                    backgroundColor: formData.sexo === 'M' ? colors.primary : colors.card,
                    borderWidth: 1,
                    borderColor: colors.border 
                  }}
                >
                  <Text style={{ color: formData.sexo === 'M' ? '#fff' : colors.text }}>Masculino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateField('sexo', 'F')}
                  className="flex-1 p-3 rounded-lg items-center"
                  style={{ 
                    backgroundColor: formData.sexo === 'F' ? colors.primary : colors.card,
                    borderWidth: 1,
                    borderColor: colors.border 
                  }}
                >
                  <Text style={{ color: formData.sexo === 'F' ? '#fff' : colors.text }}>Femenino</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleNextStep}
              className="p-4 rounded-lg items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-semibold text-lg">Siguiente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // PASO 2: Datos de contacto
          <View>
            <View className="mb-4">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Teléfono *</Text>
              <TextInput
                value={formData.telefono}
                onChangeText={(text) => updateField('telefono', text)}
                placeholder="Ingrese teléfono"
                placeholderTextColor={colors.text + '80'}
                keyboardType="phone-pad"
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Email *</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                placeholder="ejemplo@email.com"
                placeholderTextColor={colors.text + '80'}
                keyboardType="email-address"
                autoCapitalize="none"
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Dirección</Text>
              <TextInput
                value={formData.direccion}
                onChangeText={(text) => updateField('direccion', text)}
                placeholder="Calle, número, ciudad"
                placeholderTextColor={colors.text + '80'}
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Obra Social</Text>
              <TextInput
                value={formData.obraSocial}
                onChangeText={(text) => updateField('obraSocial', text)}
                placeholder="Nombre de la obra social"
                placeholderTextColor={colors.text + '80'}
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="mb-6">
              <Text className="mb-2 font-semibold" style={{ color: colors.text }}>Número de Afiliado</Text>
              <TextInput
                value={formData.numeroAfiliado}
                onChangeText={(text) => updateField('numeroAfiliado', text)}
                placeholder="Número de afiliado"
                placeholderTextColor={colors.text + '80'}
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setStep(1)}
                className="flex-1 p-4 rounded-lg items-center"
                style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>Atrás</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="flex-1 p-4 rounded-lg items-center"
                style={{ backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-lg">Registrar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}