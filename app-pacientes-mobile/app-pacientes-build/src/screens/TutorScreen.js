import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const TutorScreen = () => {
  const { colors } = useTheme();

  const upcomingFeatures = [
    {
      icon: 'person-add-outline',
      title: 'Vincular pacientes a cargo',
    },
    {
      icon: 'document-text-outline',
      title: 'Ver recetas y estudios',
    },
    {
      icon: 'calendar-outline',
      title: 'Gestionar turnos médicos',
    },
    {
      icon: 'notifications-outline',
      title: 'Recibir notificaciones',
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <Text style={[styles.header, { color: colors.text }]}>
        Módulo de Tutores
      </Text>

      {/* Main Card */}
      <View style={styles.mainCard}>
        <View style={styles.mainCardInner}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={40} color="white" />
          </View>
          <Text style={styles.mainCardTitle}>
            En Desarrollo
          </Text>
          <Text style={styles.mainCardDescription}>
            Este módulo permitirá a tutores, familiares o cuidadores gestionar la información médica de pacientes a su cargo.
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>
            35% completado
          </Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Ionicons name="information-circle" size={24} color="#3b82f6" />
        <Text style={[styles.infoText, { color: colors.text }]}>
          Diseñado para facilitar el acceso a personas con discapacidad o que necesiten asistencia de un familiar o cuidador.
        </Text>
      </View>

      {/* Upcoming Features */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Próximamente
      </Text>

      <View style={styles.featuresList}>
        {upcomingFeatures.map((feature, index) => (
          <View
            key={index}
            style={[styles.featureCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.featureIcon}>
              <Ionicons name={feature.icon} size={24} color="white" />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              {feature.title}
            </Text>
            <Ionicons name="time-outline" size={20} color="#9ca3af" />
          </View>
        ))}
      </View>

      {/* Contact Card */}
      <View style={[styles.contactCard, { backgroundColor: colors.card }]}>
        <Ionicons name="mail-outline" size={32} color="#3b82f6" />
        <Text style={[styles.contactTitle, { color: colors.text }]}>
          ¿Tenés sugerencias?
        </Text>
        <Text style={styles.contactText}>
          Contactanos para ayudarnos a mejorar este módulo
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  mainCard: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  mainCardInner: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  mainCardDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: 'white',
    height: '100%',
    width: '35%',
    borderRadius: 4,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  contactCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default TutorScreen;
