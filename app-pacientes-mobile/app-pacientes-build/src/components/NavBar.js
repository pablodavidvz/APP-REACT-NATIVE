import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';

export default function NavBar({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { patient } = usePatient();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Logo */}
      <Image 
        source={require('../../assets/logo-consejo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Título */}
      <Text style={styles.title}>Gestión de Pacientes</Text>

      {/* Botones derecha */}
      <View style={styles.rightSection}>
        {/* Botón tema */}
        <TouchableOpacity 
          onPress={toggleTheme}
          style={styles.iconButton}
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>

        {/* Foto perfil */}
        {patient && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileButton}
          >
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {patient.nombre?.[0]}{patient.apellido?.[0]}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    marginLeft: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});