import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import NavBar from '../components/NavBar';

export default function PrescriptionsScreen({ navigation }) {
  const { colors } = useTheme();
  const { patient } = usePatient();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    if (patient?.dni) {
      fetchPrescriptions();
    }
  }, [patient]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://luanna-toothy-seclusively.ngrok-free.app/app-pacientes-server/api/prescriptions/dni/${patient.dni}`
      );
      const data = await response.json();
      if (data.success) {
        setPrescriptions(data.prescriptions || []);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las recetas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (prescription) => {
    if (prescription.anulacionmotivo) {
      return { color: '#EF4444', bgColor: '#FEE2E2', icon: 'close-circle', label: 'Anulada' };
    }
    if (prescription.bloqueo) {
      return { color: '#F59E0B', bgColor: '#FEF3C7', icon: 'time', label: 'Bloqueada' };
    }
    return { color: '#10B981', bgColor: '#D1FAE5', icon: 'checkmark-circle', label: 'Activa' };
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

  const getMedicamentoInfo = (prescription) => {
    if (!prescription?.medicamentos || prescription.medicamentos.length === 0) {
      return 'Sin medicamentos especificados';
    }
    if (prescription.medicamentos.length === 1) {
      const med = prescription.medicamentos[0];
      return med.nombre_comercial || med.medicamento_completo || 'Medicamento';
    }
    const primerMed = prescription.medicamentos[0];
    const nombre = primerMed.nombre_comercial || primerMed.medicamento_completo || 'Medicamento';
    return `${nombre} (+${prescription.medicamentos.length - 1} más)`;
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
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="medical" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Mis Recetas Médicas
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Consulta tus recetas médicas digitales
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
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Cargando recetas...
            </Text>
          </View>
        )}

        {/* Prescriptions List */}
        {!loading && prescriptions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recetas Encontradas ({prescriptions.length})
            </Text>
            {prescriptions.map((prescription, index) => {
              const statusInfo = getStatusInfo(prescription);
              return (
                <TouchableOpacity
                  key={prescription.idreceta}
                  style={[styles.prescriptionCard, { backgroundColor: colors.card }]}
                  onPress={() => setSelectedPrescription(prescription)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                    <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                  </View>

                  <View style={styles.prescriptionContent}>
                    <Text style={[styles.prescriptionTitle, { color: colors.text }]}>
                      Receta #{prescription.idreceta}
                    </Text>
                    
                    <View style={styles.prescriptionDetail}>
                      <Ionicons name="medical" size={16} color={colors.textSecondary} />
                      <Text style={[styles.prescriptionText, { color: colors.textSecondary }]}>
                        {getMedicamentoInfo(prescription)}
                      </Text>
                    </View>

                    <View style={styles.prescriptionDetail}>
                      <Ionicons name="person" size={16} color={colors.textSecondary} />
                      <Text style={[styles.prescriptionText, { color: colors.textSecondary }]}>
                        {prescription.medico_nombre_completo 
                          ? `Dr. ${prescription.medico_nombre_completo}`
                          : `MP: ${prescription.matricprescr}`}
                      </Text>
                    </View>

                    <View style={styles.prescriptionDetail}>
                      <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                      <Text style={[styles.prescriptionText, { color: colors.textSecondary }]}>
                        {formatDate(prescription.fechaemision)}
                      </Text>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Empty State */}
        {!loading && prescriptions.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="medical" size={48} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No se encontraron recetas
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No hay recetas médicas registradas para este DNI
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Detalles */}
      <Modal
        visible={!!selectedPrescription}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedPrescription(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Detalle de Receta
              </Text>
              <TouchableOpacity onPress={() => setSelectedPrescription(null)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {selectedPrescription && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                      ID Receta
                    </Text>
                    <Text style={[styles.modalValue, { color: colors.text }]}>
                      #{selectedPrescription.idreceta}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                      Fecha de Emisión
                    </Text>
                    <Text style={[styles.modalValue, { color: colors.text }]}>
                      {formatDate(selectedPrescription.fechaemision)}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                      Estado
                    </Text>
                    <Text style={[styles.modalValue, { color: colors.text }]}>
                      {getStatusInfo(selectedPrescription).label}
                    </Text>
                  </View>

                  {selectedPrescription.diagnostico && (
                    <View style={styles.modalSection}>
                      <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                        Diagnóstico
                      </Text>
                      <Text style={[styles.modalValue, { color: colors.text }]}>
                        {selectedPrescription.diagnostico}
                      </Text>
                    </View>
                  )}

                  {selectedPrescription.medicamentos && selectedPrescription.medicamentos.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                        Medicamentos
                      </Text>
                      {selectedPrescription.medicamentos.map((med, idx) => (
                        <View key={idx} style={[styles.medicamentoCard, { backgroundColor: colors.background }]}>
                          <Text style={[styles.medicamentoName, { color: colors.text }]}>
                            {med.nombre_comercial || med.medicamento_completo}
                          </Text>
                          {med.monodroga && (
                            <Text style={[styles.medicamentoDetail, { color: colors.textSecondary }]}>
                              {med.monodroga}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => setSelectedPrescription(null)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  prescriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  prescriptionContent: {
    flex: 1,
    gap: 8,
  },
  prescriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  prescriptionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prescriptionText: {
    fontSize: 14,
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  modalValue: {
    fontSize: 16,
  },
  medicamentoCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  medicamentoName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  medicamentoDetail: {
    fontSize: 14,
  },
  modalButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});