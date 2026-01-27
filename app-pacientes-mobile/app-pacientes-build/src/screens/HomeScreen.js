import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import NavBar from '../components/NavBar';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { patient } = usePatient();

  const features = [
    {
      icon: 'card',
      title: 'Registro de Pacientes',
      description: 'Verificá tus datos personales escaneando tu DNI',
      color: '#3B82F6',
      route: 'Scanner'
    },
    {
      icon: 'medical',
      title: 'Recetas Online',
      description: 'Accedé a tus recetas médicas digitales de forma segura',
      color: '#10B981',
      route: 'Prescriptions'
    },
    {
      icon: 'flask',
      title: 'Estudios Médicos',
      description: 'Consultá los resultados de tus estudios en cualquier momento',
      color: '#8B5CF6',
      route: 'Studies'
    },
    {
      icon: 'document-text',
      title: 'Certificados Médicos',
      description: 'Accedé a tus certificados médicos de reposo y aptitud',
      color: '#F59E0B',
      route: 'Certificates'
    },
    {
      icon: 'search',
      title: 'Buscar Medicamentos',
      description: 'Consultá el estado de tus medicamentos de alto costo',
      color: '#EC4899',
      route: 'MedicationSearch'
    },
    {
      icon: 'people',
      title: 'Módulo Tutores',
      description: 'Gestión para familiares y cuidadores de pacientes',
      color: '#F97316',
      route: 'Tutor'
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavBar navigation={navigation} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Tu salud, al alcance de tu mano
          </Text>
          <Text style={styles.heroSubtitle}>
            Accedé a tus datos médicos, recetas y resultados de estudios de forma rápida y segura.
          </Text>
        </View>

        {/* Main Card con gradiente */}
        <LinearGradient
          colors={['#1E6091', '#0A4B78']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.mainCardContent}>
            <View style={styles.mainCardIcon}>
              <Ionicons name="medkit" size={60} color="rgba(255,255,255,0.8)" />
            </View>
            <View style={styles.mainCardText}>
              <Text style={styles.mainCardTitle}>
                {patient 
                  ? `¡Bienvenido de nuevo, ${patient.nombre}!`
                  : 'Comenzá verificando tu identidad'}
              </Text>
              <Text style={styles.mainCardSubtitle}>
                {patient
                  ? 'Accedé a toda tu información médica de manera rápida y segura.'
                  : 'Escaneá tu DNI para verificar tus datos y acceder a tus servicios médicos.'}
              </Text>
              <TouchableOpacity
                style={styles.mainCardButton}
                onPress={() => navigation.navigate(patient ? 'Profile' : 'Scanner')}
              >
                <Text style={styles.mainCardButtonText}>
                  {patient ? 'Ver mi perfil' : 'Escanear DNI'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#0A4B78" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Patient Info */}
        {patient && (
          <View style={[styles.patientInfo, { backgroundColor: colors.card }]}>
            <View style={styles.patientInfoHeader}>
              <Ionicons name="person-circle" size={24} color={colors.primary} />
              <Text style={[styles.patientName, { color: colors.text }]}>
                {patient.nombre} {patient.apellido}
              </Text>
            </View>
            <Text style={[styles.patientDni, { color: colors.textSecondary }]}>
              DNI: {patient.dni}
            </Text>
          </View>
        )}

        {/* Services Title */}
        <Text style={[styles.servicesTitle, { color: colors.text }]}>
          Nuestros servicios
        </Text>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate(feature.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <Ionicons name={feature.icon} size={28} color={feature.color} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
                <View style={styles.featureArrow}>
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    Acceder
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Info */}
        <View style={[styles.footerCard, { backgroundColor: colors.card }]}>
          <View style={styles.footerIcon}>
            <Ionicons name="medkit" size={40} color={colors.primary} />
          </View>
          <View style={styles.footerContent}>
            <Text style={[styles.footerTitle, { color: colors.text }]}>
              Consejo de Médicos de la Provincia de Córdoba
            </Text>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              El Consejo de Médicos trabaja para asegurar el correcto y regular ejercicio de la profesión médica, 
              garantizando la salud de todos los ciudadanos de la Provincia de Córdoba.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  mainCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainCardContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainCardIcon: {
    marginBottom: 20,
  },
  mainCardText: {
    alignItems: 'center',
  },
  mainCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  mainCardSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  mainCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  mainCardButtonText: {
    color: '#0A4B78',
    fontWeight: '600',
    fontSize: 16,
  },
  patientInfo: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  patientInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
  },
  patientDni: {
    fontSize: 14,
    marginLeft: 36,
  },
  servicesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  featuresGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  featureArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerCard: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footerIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#1E609120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContent: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
