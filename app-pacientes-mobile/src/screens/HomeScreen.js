import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePatient } from '../contexts/PatientContext';
import { useTheme } from '../contexts/ThemeContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { patient } = usePatient();
  const { theme, isDark, toggleTheme } = useTheme();

  const features = [
    {
      icon: 'card-outline',
      title: 'Registro de Pacientes',
      description: 'Verificá tus datos personales escaneando tu DNI',
      color: 'bg-blue-500',
      route: 'Scanner'
    },
    {
      icon: 'medical-outline',
      title: 'Recetas Online',
      description: 'Accedé a tus recetas médicas digitales',
      color: 'bg-emerald-500',
      route: 'Prescriptions'
    },
    {
      icon: 'flask-outline',
      title: 'Seguimiento de Medicamentos',
      description: 'Consultá el estado de tus medicamentos',
      color: 'bg-purple-500',
      route: 'MedicationSearch'
    },
    {
      icon: 'document-text-outline',
      title: 'Estudios Médicos',
      description: 'Consultá los resultados de tus estudios',
      color: 'bg-violet-500',
      route: 'Studies'
    },
    {
      icon: 'clipboard-outline',
      title: 'Certificados Médicos',
      description: 'Accedé a tus certificados de reposo y aptitud',
      color: 'bg-amber-500',
      route: 'Certificates'
    }
  ];

  return (
    <ScrollView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header con toggle de tema */}
      <View className="flex-row justify-between items-center mb-6">
        <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
          Tu salud, al alcance
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          className="p-3 rounded-full"
          style={{ backgroundColor: theme.colors.card }}
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Main Card */}
      <View className="bg-blue-600 rounded-2xl p-6 mb-6">
        <Text className="text-2xl font-bold text-white mb-2">
          {patient 
            ? `¡Bienvenido, ${patient.nombre}!` 
            : 'Comenzá verificando tu identidad'}
        </Text>
        <Text className="text-white/90 mb-4">
          {patient
            ? 'Accedé a toda tu información médica de manera rápida y segura.'
            : 'Escaneá tu DNI para verificar tus datos y acceder a tus servicios médicos.'}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(patient ? 'Profile' : 'Scanner')}
          className="bg-white rounded-xl py-3 px-6 flex-row items-center justify-center"
        >
          <Text className="text-blue-600 font-semibold mr-2">
            {patient ? 'Ver mi perfil' : 'Escanear DNI'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#1e40af" />
        </TouchableOpacity>
      </View>

      {/* Services Title */}
      <Text style={{ color: theme.colors.text }} className="text-2xl font-bold mb-4">
        Nuestros servicios
      </Text>

      {/* Features Grid */}
      <View className="gap-4">
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(feature.route)}
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: theme.colors.card,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center mb-3">
              <View className={`w-12 h-12 rounded-xl ${feature.color} items-center justify-center mr-3`}>
                <Ionicons name={feature.icon} size={24} color="white" />
              </View>
              <Text 
                style={{ color: theme.colors.text }} 
                className="text