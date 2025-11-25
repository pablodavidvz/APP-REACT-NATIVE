import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PatientProvider } from './src/contexts/PatientContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Screens
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PrescriptionsScreen from './src/screens/PrescriptionsScreen';
import CertificatesScreen from './src/screens/CertificatesScreen';
import StudiesScreen from './src/screens/StudiesScreen';
import MedicationSearchScreen from './src/screens/MedicationSearchScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <PatientProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Register"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Prescriptions" component={PrescriptionsScreen} />
            <Stack.Screen name="Certificates" component={CertificatesScreen} />
            <Stack.Screen name="Studies" component={StudiesScreen} />
            <Stack.Screen name="MedicationSearch" component={MedicationSearchScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PatientProvider>
    </ThemeProvider>
  );
}