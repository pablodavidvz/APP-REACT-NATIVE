import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
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

  const checkIfPatientExists = async (patientData) => {
    setChecking(true);
    
    try {
      console.log('🔍 Verificando si el paciente existe...');
      
      const response = await patientService.checkPatientByDNI(patientData.dni);

      setChecking(false);

      if (response.exists && response.patient) {
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

    checkIfPatientExists(patientData);
  };

  // Función para ir al registro manual
  const handleManualRegister = () => {
    navigation.navigate('Register', { scannedData: null });
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
        <View style={styles.permissionContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="camera" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.permissionTitle, { color: colors.text }]}>
            Permiso de Cámara
          </Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary || '#6B7280' }]}>
            Necesitamos acceso a la cámara para escanear tu DNI
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
          </TouchableOpacity>
          
          {/* Botón de registro manual */}
          <TouchableOpacity
            onPress={handleManualRegister}
            style={[styles.manualButton, { borderColor: colors.primary }]}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <Text style={[styles.manualButtonText, { color: colors.primary }]}>
              Registrarse sin escanear
            </Text>
          </TouchableOpacity>
        </View>
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
          {/* Header */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Escanear DNI</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Scan Area */}
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

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.manualRegisterButton}
              onPress={handleManualRegister}
            >
              <Ionicons name="create-outline" size={24} color="#fff" />
              <Text style={styles.manualRegisterText}>Ingresar datos manualmente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      {scanned && !checking && (
        <TouchableOpacity
          style={[styles.rescanButton, { backgroundColor: colors.primary }]}
          onPress={() => setScanned(false)}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
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
    marginTop: 24,
    paddingHorizontal: 40,
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
  bottomActions: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  manualRegisterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
  },
  manualRegisterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  permissionContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    gap: 10,
  },
  manualButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rescanButton: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
