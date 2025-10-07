import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PatientProvider } from './src/contexts/PatientContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PatientProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </PatientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}