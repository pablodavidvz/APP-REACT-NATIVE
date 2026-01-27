import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';

// Importar pantallas
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PrescriptionsScreen from '../screens/PrescriptionsScreen';
import StudiesScreen from '../screens/StudiesScreen';
import CertificatesScreen from '../screens/CertificatesScreen';
import MedicationSearchScreen from '../screens/MedicationSearchScreen';
import TutorScreen from '../screens/TutorScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { colors, theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Gestión de Pacientes' }}
      />
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ title: 'Escanear DNI' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Registrar Paciente' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
      <Stack.Screen 
        name="Prescriptions" 
        component={PrescriptionsScreen}
        options={{ title: 'Recetas Médicas' }}
      />
      <Stack.Screen 
        name="Studies" 
        component={StudiesScreen}
        options={{ title: 'Estudios Médicos' }}
      />
      <Stack.Screen 
        name="Certificates" 
        component={CertificatesScreen}
        options={{ title: 'Certificados Médicos' }}
      />
      <Stack.Screen 
        name="MedicationSearch" 
        component={MedicationSearchScreen}
        options={{ title: 'Buscar Medicamentos' }}
      />
      <Stack.Screen 
        name="Tutor" 
        component={TutorScreen}
        options={{ title: 'Módulo Tutores' }}
      />
    </Stack.Navigator>
  );
}
