import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();
  const { setPatient } = usePatient();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const parsePDF417Data = (data) => {
    try {
      // El DNI argentino en formato PDF417 viene con @ como separador
      const parts = data.split('@');
      
      if (parts.length < 8) {
        throw new Error('Formato de DNI inválido');
      }

      // Extraer datos del DNI argentino
      const patientData = {
        dni: parts[4]?.trim() || '',
        nombre: parts[2]?.trim() || '',
        apellido: parts[1]?.trim() || '',
        sexo: parts[3]?.trim() || '',
        fechaNacimiento: parts[6]?.trim() || '',
        numeroTramite: parts[0]?.trim() || '',
      };

      return patientData;
    } catch (error) {
      console.error('Error al parsear DNI:', error);
      return null;
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    // Verificar que sea un código PDF417 (formato del DNI argentino)
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

    Alert.alert(
      'DNI Escaneado',
      `Nombre: ${patientData.nombre} ${patientData.apellido}\nDNI: ${patientData.dni}`,
      [
        { text: 'Cancelar', onPress: () => setScanned(false), style: 'cancel' },
        {
          text: 'Continuar Registro',
          onPress: () => {
            navigation.navigate('Register', { scannedData: patientData });
          },
        },
      ]
    );
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
        </View>
      </CameraView>

      {scanned && (
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