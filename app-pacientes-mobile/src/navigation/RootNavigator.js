import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PrescriptionsScreen from '../screens/PrescriptionsScreen';
import StudiesScreen from '../screens/StudiesScreen';
import CertificatesScreen from '../screens/CertificatesScreen';
import MedicationSearchScreen from '../screens/MedicationSearchScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { theme } = useTheme();
  const { loading } = usePatient();

  if (loading) {
    return null; // O un loading screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{
          title: 'Escanear DNI',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Mi Perfil',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          title: 'Registro',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Prescriptions" 
        component={PrescriptionsScreen}
        options={{
          title: 'Recetas Médicas',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Studies" 
        component={StudiesScreen}
        options={{
          title: 'Estudios Médicos',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Certificates" 
        component={CertificatesScreen}
        options={{
          title: 'Certificados Médicos',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="MedicationSearch" 
        component={MedicationSearchScreen}
        options={{
          title: 'Buscar Medicamentos',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;