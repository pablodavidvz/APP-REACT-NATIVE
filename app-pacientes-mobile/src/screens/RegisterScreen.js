import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import patientService from '../services/patientService';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { setPatient } = usePatient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const dniData = route.params || {};
  const fromDniScan = dniData.fromDniScan;

  const [formData, setFormData] = useState({
    dni: dniData.dni || '',
    nombre: dniData.nombre || '',
    apellido: dniData.apellido || '',
    sexo: dniData.sexo || 'M',
    fecnac: dniData.fecnac || '',
    email: '',
    telefono: '',
    calle: '',
    numero: '',
    piso: '',
    departamento: '',
    ciudad: '',
    provincia: '',
    cpostal: '',
    peso: '',
    talla: '',
    idobrasocial: 'SIN OBRA SOCIAL'
  });

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.dni) newErrors.dni = 'DNI requerido';
    if (!formData.nombre) newErrors.nombre = 'Nombre requerido';
    if (!formData.apellido) newErrors.apellido = 'Apellido requerido';
    if (!formData.fecnac) newErrors.fecnac = 'Fecha de nacimiento requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await patientService.registerPatient(formData);
      if (result.success && result.patient) {
        setPatient(result.patient);
        Alert.alert('Éxito', 'Registro completado correctamente', [
          { text: 'Ver perfil', onPress: () => navigation.replace('Profile') }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, label, options = {}) => {
    const isReadOnly = fromDniScan && ['dni', 'nombre', 'apellido', 'sexo', 'fecnac'].includes(name);
    
    return (
      <View className="mb-4">
        <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-1">
          {label} {options.required && <Text className="text-red-500">*</Text>}
          {isReadOnly && <Ionicons name="lock-closed" size={12} color={theme.colors.textSecondary} />}
        </Text>
        <TextInput
          value={formData[name]}
          onChangeText={(text) => setFormData({...formData, [name]: text})}
          editable={!isReadOnly}
          className="p-3 rounded-lg"
          style={{ 
            backgroundColor: isReadOnly ? theme.colors.background : theme.colors.card,
            color: theme.colors.text,
            borderWidth: 1,
            borderColor: errors[name] ? theme.colors.error : theme.colors.border
          }}
          placeholder={options.placeholder || label}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType={options.keyboardType || 'default'}
        />
        {errors[name] && (
          <Text className="text-red-500 text-xs mt-1">{errors[name]}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-3">
            <Ionicons name="person-add" size={32} color={theme.colors.primary} />
          </View>
          <Text style={{ color: theme.colors.text }} className="text-2xl font-bold">
            Registro de Paciente
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-center mt-2">
            {step === 1 ? 'Información Personal' : 'Información de Contacto'}
          </Text>
        </View>

        {fromDniScan && (
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <Text className="ml-2 flex-1 text-blue-700 dark:text-blue-300 text-sm">
                Los campos con candado fueron obtenidos del DNI y no pueden modificarse
              </Text>
            </View>
          </View>
        )}

        <View className="flex-row justify-center mb-6">
          <View className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'} mr-2`} />
          <View className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        </View>

        {step === 1 && (
          <View>
            {renderInput('dni', 'DNI', { required: true, keyboardType: 'numeric' })}
            {renderInput('nombre', 'Nombre', { required: true })}
            {renderInput('apellido', 'Apellido', { required: true })}
            {renderInput('fecnac', 'Fecha de Nacimiento (AAAA-MM-DD)', { required: true })}
            
            <View className="mb-4">
              <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-1">
                Sexo <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => !fromDniScan && setFormData({...formData, sexo: 'M'})}
                  className={`flex-1 py-3 rounded-lg ${formData.sexo === 'M' ? 'bg-blue-600' : ''}`}
                  style={{ borderWidth: 1, borderColor: theme.colors.border }}
                  disabled={fromDniScan}
                >
                  <Text className={`text-center font-semibold ${formData.sexo === 'M' ? 'text-white' : ''}`} 
                    style={{ color: formData.sexo === 'M' ? 'white' : theme.colors.text }}>
                    Masculino
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => !fromDniScan && setFormData({...formData, sexo: 'F'})}
                  className={`flex-1 py-3 rounded-lg ${formData.sexo === 'F' ? 'bg-blue-600' : ''}`}
                  style={{ borderWidth: 1, borderColor: theme.colors.border }}
                  disabled={fromDniScan}
                >
                  <Text className={`text-center font-semibold ${formData.sexo === 'F' ? 'text-white' : ''}`}
                    style={{ color: formData.sexo === 'F' ? 'white' : theme.colors.text }}>
                    Femenino
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            {renderInput('email', 'Email', { keyboardType: 'email-address', placeholder: 'ejemplo@correo.com' })}
            {renderInput('telefono', 'Teléfono', { keyboardType: 'phone-pad' })}
            {renderInput('calle', 'Calle')}
            {renderInput('numero', 'Número')}
            {renderInput('ciudad', 'Ciudad')}
            {renderInput('provincia', 'Provincia')}
          </View>
        )}

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            onPress={() => step === 1 ? navigation.goBack() : setStep(1)}
            className="flex-1 py-4 rounded-xl"
            style={{ backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }}
            disabled={loading}
          >
            <Text style={{ color: theme.colors.text }} className="text-center font-semibold">
              {step === 1 ? 'Cancelar' : 'Atrás'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={step === 1 ? handleNext : handleRegister}
            className="flex-1 bg-blue-600 py-4 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">
                {step === 1 ? 'Siguiente' : 'Registrarse'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;