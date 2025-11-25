import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import NavBar from '../components/NavBar';

export default function CertificatesScreen({ navigation }) {
  const { colors } = useTheme();
  const { patient } = usePatient();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient?.dni) {
      fetchCertificates();
    }
  }, [patient]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://luanna-toothy-seclusively.ngrok-free.app/app-pacientes-server/api/prescriptions/certificates/dni/${patient.dni}`
      );
      const data = await response.json();
      if (data.success) {
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los certificados');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'No especificada';
    }
  };

  const getCertificateIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'reposo':
        return 'bed';
      case 'aptitud':
        return 'fitness';
      default:
        return 'document-text';
    }
  };

  const getCertificateColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'reposo':
        return '#F59E0B';
      case 'aptitud':
        return '#10B981';
      default:
        return '#3B82F6';
    }
  };

  if (!patient) {
    navigation.navigate('Scanner');
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavBar navigation={navigation} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="document-text" size={32} color={colors.warning} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Certificados Médicos
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Accedé a tus certificados médicos
          </Text>
        </View>

        {/* Patient Info */}
        <View style={[styles.patientCard, { backgroundColor: colors.card }]}>
          <View style={styles.patientHeader}>
            <Ionicons name="person-circle" size={24} color={colors.primary} />
            <View style={styles.patientInfo}>
              <Text style={[styles.patientName, { color: colors.text }]}>
                {patient.nombre} {patient.apellido}
              </Text>
              <Text style={[styles.patientDni, { color: colors.textSecondary }]}>
                DNI: {patient.dni}
              </Text>
            </View>
          </View>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.warning} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Cargando certificados...
            </Text>
          </View>
        )}

        {/* Certificates List */}
        {!loading && certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Certificados Encontrados ({certificates.length})
            </Text>
            {certificates.map((certificate, index) => {
              const certColor = getCertificateColor(certificate.tipo);
              const certIcon = getCertificateIcon(certificate.tipo);
              
              return (
                <View
                  key={index}
                  style={[styles.certificateCard, { backgroundColor: colors.card }]}
                >
                  <View style={[styles.certificateIcon, { backgroundColor: certColor + '20' }]}>
                    <Ionicons name={certIcon} size={28} color={certColor} />
                  </View>

                  <View style={styles.certificateContent}>
                    <Text style={[styles.certificateTitle, { color: colors.text }]}>
                      Certificado #{certificate.id || index + 1}
                    </Text>
                    
                    <View style={styles.certificateDetail}>
                      <Ionicons name="medical" size={16} color={colors.textSecondary} />
                      <Text style={[styles.certificateText, { color: colors.textSecondary }]}>
                        {certificate.tipo || 'Certificado Médico'}
                      </Text>
                    </View>

                    {certificate.medico && (
                      <View style={styles.certificateDetail}>
                        <Ionicons name="person" size={16} color={colors.textSecondary} />
                        <Text style={[styles.certificateText, { color: colors.textSecondary }]}>
                          Dr. {certificate.medico}
                        </Text>
                      </View>
                    )}

                    <View style={styles.certificateDetail}>
                      <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                      <Text style={[styles.certificateText, { color: colors.textSecondary }]}>
                        {formatDate(certificate.fecha)}
                      </Text>
                    </View>

                    {certificate.diagnostico && (
                      <View style={[styles.diagnosticoBox, { backgroundColor: colors.background }]}>
                        <Text style={[styles.diagnosticoText, { color: colors.textSecondary }]}>
                          {certificate.diagnostico}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Empty State */}
        {!loading && certificates.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="document-text" size={48} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No se encontraron certificados
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No hay certificados médicos registrados para este DNI
            </Text>
          </View>
        )}

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
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  patientCard: {
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
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  patientDni: {
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  certificateCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
  },
  certificateIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certificateContent: {
    flex: 1,
    gap: 8,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  certificateDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  certificateText: {
    fontSize: 14,
    flex: 1,
  },
  diagnosticoBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  diagnosticoText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});