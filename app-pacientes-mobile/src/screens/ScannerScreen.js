import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import patientService from '../services/patientService';

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { setPatient } = usePatient();

  const formatDateToISO = (dateString) => {
    if (!dateString || dateString === 'No disponible') return '';
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const processDniData = (data) => {
    try {
      console.log('📄 Datos escaneados:', data);

      if (data.includes('@')) {
        const parts = data.split('@');
        
        if (parts.length >= 5) {
          const dni = parts[4];
          const apellido = parts[1] || '';
          const nombre = parts[2] || '';
          const genero = parts[3] || '';
          const fechaNac = parts.length >= 7 ? parts[6] : '';

          if (/^\d{7,8}$/.test(dni)) {
            return {
              dni,
              apellido,
              nombre,
              genero,
              fechaNac
            };
          }
        }
      }
      
      const dniMatch = data.match(/\b\d{7,8}\b/);
      if (dniMatch) {
        return {
          dni: dniMatch[0],
          apellido: 'No disponible',
          nombre: 'No disponible',
          genero: 'M',
          fechaNac: 'No disponible'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error al procesar DNI:', error);
      return null;
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);

    const parsedData = processDniData(data);
    
    if (!parsedData) {
      Alert.alert(
        'Error',
        'No se pudo leer el DNI. Por favor, intenta nuevamente.',
        [{ text: 'Reintentar', onPress: () => setScanned(false) }]
      );
      setLoading(false);
      return;
    }

    try {
      const result = await patientService.checkPatientByDni(
        parsedData.dni,
        parsedData
      );

      if (result.exists && result.patient) {
        if (result.updated) {
          Alert.alert(
            'Datos actualizados',
            'Tu información se actualizó automáticamente con los datos del DNI.',
            [
              {
                text: 'Ver perfil',
                onPress: () => {
                  setPatient(result.patient);
                  navigation.replace('Profile');
                }
              }
            ]
          );
        } else {
          setPatient(result.patient);
          navigation.replace('Profile');
        }
      } else {
        const formattedData = {
          dni: parsedData.dni,
          nombre: parsedData.nombre,
          apellido: parsedData.apellido,
          sexo: parsedData.genero,
          fecnac: formatDateToISO(parsedData.fechaNac),
          fromDniScan: true
        };
        
        navigation.replace('Register', formattedData);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo verificar el DNI. Intenta nuevamente.',
        [{ text: 'Reintentar', onPress: () => setScanned(false) }]
      );
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-6" style={{ backgroundColor: theme.colors.background }}>
        <Ionicons name="camera-outline" size={80} color={theme.colors.textSecondary} />
        <Text style={{ color: theme.colors.text }} className="text-xl font-bold text-center mt-4 mb-2">
          Permiso de cámara requerido
        </Text>
        <Text style={{ color: theme.colors.textSecondary }} className="text-center mb-6">
          Necesitamos acceso a tu cámara para escanear el código del DNI
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-600 rounded-xl py-4 px-8"
        >
          <Text className="text-white font-semibold text-center">Permitir acceso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <View className="p-4" style={{ backgroundColor: theme.colors.card }}>
        <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <Ionicons name="information-circle" size={24} color="#3b82f6" />
          <Text className="ml-3 flex-1 text-blue-700 dark:text-blue-300 text-sm">
            Colocá el código de barras del DNI frente a la cámara
          </Text>