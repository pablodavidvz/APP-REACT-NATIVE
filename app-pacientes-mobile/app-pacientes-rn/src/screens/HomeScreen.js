import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { usePatient } from '../contexts/PatientContext';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { patient, clearPatient } = usePatient();
  const { colors, theme, toggleTheme } = useTheme();

  const menuItems = [
    { title: 'Escanear DNI', screen: 'Scanner', icon: '📷', description: 'Escanear DNI argentino' },
    { title: 'Registrar Paciente', screen: 'Register', icon: '📝', description: 'Registro manual' },
    { title: 'Mi Perfil', screen: 'Profile', icon: '👤', description: 'Ver y editar perfil', requiresPatient: true },
    { title: 'Recetas Médicas', screen: 'Prescriptions', icon: '💊', description: 'Gestionar recetas', requiresPatient: true },
    { title: 'Estudios Médicos', screen: 'Studies', icon: '🔬', description: 'Ver estudios', requiresPatient: true },
    { title: 'Certificados', screen: 'Certificates', icon: '📄', description: 'Certificados médicos', requiresPatient: true },
    { title: 'Buscar Medicamentos', screen: 'MedicationSearch', icon: '🔍', description: 'Base de datos' },
  ];

  const handleNavigation = (screen, requiresPatient) => {
    if (requiresPatient && !patient) {
      alert('Debes estar registrado para acceder a esta sección');
      return;
    }
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4">
        {/* Header con toggle de tema */}
        <View className="flex-row justify-between items-center mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.card }}>
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              {patient ? `Hola, ${patient.nombre}` : 'Bienvenido'}
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.text, opacity: 0.7 }}>
              {patient ? `DNI: ${patient.dni}` : 'Gestión de Pacientes'}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text style={{ color: colors.text, marginRight: 8 }}>
              {theme === 'light' ? '☀️' : '🌙'}
            </Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#3b82f6' }}
              thumbColor={theme === 'dark' ? '#1e40af' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Menú de opciones */}
        <View className="space-y-3">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleNavigation(item.screen, item.requiresPatient)}
              className="p-4 rounded-lg flex-row items-center"
              style={{ 
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: item.requiresPatient && !patient ? 0.5 : 1
              }}
            >
              <Text className="text-3xl mr-4">{item.icon}</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold" style={{ color: colors.text }}>
                  {item.title}
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.text, opacity: 0.7 }}>
                  {item.description}
                </Text>
              </View>
              <Text className="text-xl" style={{ color: colors.text, opacity: 0.5 }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón de cerrar sesión */}
        {patient && (
          <TouchableOpacity
            onPress={() => {
              clearPatient();
              alert('Sesión cerrada correctamente');
            }}
            className="mt-6 p-4 rounded-lg items-center"
            style={{ backgroundColor: '#ef4444' }}
          >
            <Text className="text-white font-semibold text-lg">Cerrar Sesión</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}