import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import NavBar from '../components/NavBar';

export default function StudiesScreen({ navigation }) {
  const { colors } = useTheme();
  const { patient } = usePatient();
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient?.dni) {
      fetchStudies();
    }
  }, [patient]);

  const fetchStudies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://luanna-toothy-seclusively.ngrok-free.app/app-pacientes-server/api/prescriptions/studies/dni/${patient.dni}`
      );
      const data = await response.json();
      if (data.success) {
        setStudies(data.studies || []);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los estudios');
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

  const getStudyIcon = (type) => {
    const typeStr = type?.toLowerCase() || '';
    if (typeStr.includes('sangre') || typeStr.includes('laboratorio')) return 'water';
    if (typeStr.includes('radiografía') || typeStr.includes('rayos')) return 'radio';
    if (typeStr.includes('resonancia') || typeStr.includes('tomografía')) return 'scan';
    if (typeStr.includes('ecografía') || typeStr.includes('ultrasonido')) return 'pulse';
    return 'flask';
  };

  const getStudyColor = (type) => {
    const typeStr = type?.toLowerCase() || '';
    if (typeStr.includes('sangre') || typeStr.includes('laboratorio')) return '#EF4444';
    if (typeStr.includes('radiografía') || typeStr.includes('rayos')) return '#3B82F6';
    if (typeStr.includes('resonancia') || typeStr.includes('tomografía')) return '#8B5CF6';
    if (typeStr.includes('ecografía') || typeStr.includes('ultrasonido')) return '#10B981';
    return '#8B5CF6';
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
          <View style={[styles.iconCircle, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name="flask" size={32} color={colors.accent} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Estudios Médicos
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Consultá los resultados de tus estudios
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
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Cargando estudios...
            </Text>
          </View>
        )}

        {/* Studies List */}
        {!loading && studies.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Estudios Encontrados ({studies.length})
            </Text>
            {studies.map((study, index) => {
              const studyColor = getStudyColor(study.tipo);
              const studyIcon = getStudyIcon(study.tipo);
              
              return (
                <View
                  key={index}
                  style={[styles.studyCard, { backgroundColor: colors.card }]}
                >
                  <View style={[styles.studyIcon, { backgroundColor: studyColor + '20' }]}>
                    <Ionicons name={studyIcon} size={28} color={studyColor} />
                  </View>

                  <View style={styles.studyContent}>
                    <Text style={[styles.studyTitle, { color: colors.text }]}>
                      {study.tipo || 'Estudio Médico'}
                    </Text>
                    
                    {study.descripcion && (
                      <View style={styles.studyDetail}>
                        <Ionicons name="document-text" size={16} color={colors.textSecondary} />
                        <Text style={[styles.studyText, { color: colors.textSecondary }]}>
                          {study.descripcion}
                        </Text>
                      </View>
                    )}

                    {study.medico && (
                      <View style={styles.studyDetail}>
                        <Ionicons name="person" size={16} color={colors.textSecondary} />
                        <Text style={[styles.studyText, { color: colors.textSecondary }]}>
                          Dr. {study.medico}
                        </Text>
                      </View>
                    )}

                    {study.centro && (
                      <View style={styles.studyDetail}>
                        <Ionicons name="business" size={16} color={colors.textSecondary} />
                        <Text style={[styles.studyText, { color: colors.textSecondary }]}>
                          {study.centro}
                        </Text>
                      </View>
                    )}

                    <View style={styles.studyDetail}>
                      <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                      <Text style={[styles.studyText, { color: colors.textSecondary }]}>
                        {formatDate(study.fecha)}
                      </Text>
                    </View>

                    {study.resultado && (
                      <View style={[styles.resultBox, { backgroundColor: colors.background }]}>
                        <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>
                          Resultado:
                        </Text>
                        <Text style={[styles.resultText, { color: colors.text }]}>
                          {study.resultado}
                        </Text>
                      </View>
                    )}

                    {study.estado && (
                      <View style={[styles.statusBadge, { 
                        backgroundColor: study.estado === 'Disponible' ? '#D1FAE5' : '#FEF3C7'
                      }]}>
                        <Text style={[styles.statusText, { 
                          color: study.estado === 'Disponible' ? '#10B981' : '#F59E0B'
                        }]}>
                          {study.estado}
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
        {!loading && studies.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="flask" size={48} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No se encontraron estudios
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No hay estudios médicos registrados para este DNI
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
  studyCard: {
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
  studyIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studyContent: {
    flex: 1,
    gap: 8,
  },
  studyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  studyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studyText: {
    fontSize: 14,
    flex: 1,
  },
  resultBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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