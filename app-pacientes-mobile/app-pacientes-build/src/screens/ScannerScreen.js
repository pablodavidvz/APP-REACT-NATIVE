import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import patientService from '../services/patientService';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [checking, setChecking] = useState(false);
  const { colors } = useTheme();
  const { setPatient } = usePatient();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const parsePDF417Data = (data) => {
    try {
      const parts = data.split('@');
      
      if (parts.length < 8) {
        throw new Error('Formato de DNI inválido');
      }

      const patientData = {
        dni: parts[4]?.trim() || '',
        nombre: parts[2]?.trim() || '',
        apellido: parts[1]?.trim() || '',
        sexo: parts[3]?.trim() || '',
        fecnac: parts[6]?.trim() || '',
        numeroTramite: parts[0]?.trim() || '',
      };

      return patientData;
    } catch (error) {
      console.error('Error al parsear DNI:', error);
      return null;
    }
  };

  // ✅ VERIFICAR SI EL PACIENTE YA EXISTE
  const checkIfPatientExists = async (patientData) => {
    setChecking(true);
    
    try {
      console.log('🔍 Verificando si el paciente existe...');
      
      // Verificar por DNI de forma simple
      const response = await patientService.checkPatientByDNI(patientData.dni);

      setChecking(false);

      if (response.exists && response.patient) {
        // ✅ PACIENTE YA EXISTE - INICIAR SESIÓN AUTOMÁTICAMENTE
        console.log('✅ Paciente encontrado, iniciando sesión...');
        
        await setPatient(response.patient);
        
        Alert.alert(
          '¡Bienvenido!',
          `Hola ${response.patient.nombre} ${response.patient.apellido}`,
          [
            {
              text: 'Continuar',
              onPress: () => {
                setScanned(false);
                navigation.navigate('Home');
              }
            }
          ]
        );
      } else {
        // ❌ PACIENTE NO EXISTE - IR AL REGISTRO
        console.log('❌ Paciente no encontrado, ir al registro');
        
        Alert.alert(
          'DNI Escaneado',
          `Nombre: ${patientData.nombre} ${patientData.apellido}\nDNI: ${patientData.dni}\n\nNo está registrado. ¿Desea registrarse?`,
          [
            { 
              text: 'Cancelar', 
              onPress: () => setScanned(false), 
              style: 'cancel' 
            },
            {
              text: 'Registrarse',
              onPress: () => {
                navigation.navigate('Register', { scannedData: patientData });
              },
            },
          ]
        );
      }
    } catch (error) {
      setChecking(false);
      console.error('❌ Error al verificar paciente:', error);
      
      // Si hay error en la verificación, ir al registro
      Alert.alert(
        'DNI Escaneado',
        `Nombre: ${patientData.nombre} ${patientData.apellido}\nDNI: ${patientData.dni}`,
        [
          { 
            text: 'Cancelar', 
            onPress: () => setScanned(false), 
            style: 'cancel' 
          },
          {
            text: 'Continuar',
            onPress: () => {
              navigation.navigate('Register', { scannedData: patientData });
            },
          },
        ]
      );
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    if (type !== 'pdf417' && type !== 256) {
      Alert.alert(
        'Código inválido',
        'Por favor, escanee el código de barras del DNI argentino',
        [{ text: 'Reintentar', onPress: () => setScanned(false) }]
      );
      return;
    }

    const patientData = parsePDF417Data(data);

    if (!patientData || !patientData.dni) {
      Alert.alert(
        'Error',
        'No se pudo leer la información del DNI. Intente nuevamente.',
        [{ text: 'Reintentar', onPress: () => setScanned(false) }]
      );
      return;
    }

    // ✅ VERIFICAR SI EL PACIENTE EXISTE
    checkIfPatientExists(patientData);
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.text }]}>
          Necesitamos permiso para usar la cámara
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['pdf417'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.instructions}>
            Coloque el código de barras del DNI dentro del marco
          </Text>
          
          {checking && (
            <View style={styles.checkingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.checkingText}>Verificando paciente...</Text>
            </View>
          )}
        </View>
      </CameraView>

      {scanned && !checking && (
        <TouchableOpacity
          style={[styles.rescanButton, { backgroundColor: colors.primary }]}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Escanear Nuevamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 300,
    height: 200,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  checkingContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  checkingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rescanButton: {
    position: 'absolute',
    bottom: 40,
    padding: 15,
    borderRadius: 8,
  },
});