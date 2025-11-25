import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import NavBar from '../components/NavBar';
import patientService from '../services/patientService';

export default function MedicationSearchScreen({ navigation }) {
  const { colors } = useTheme();
  const { patient } = usePatient();
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const result = await patientService.searchMedication(searchTerm);
      setMedications(result.results || []);
    } catch (error) {
      console.error('Error searching medications:', error);
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavBar navigation={navigation} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: '#EC489920' }]}>
            <Ionicons name="search" size={32} color="#EC4899" />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Buscar Medicamentos
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Consultá el estado de tus medicamentos
          </Text>
        </View>

        {/* Patient Info */}
        {patient && (
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
        )}

        {/* Search Box */}
        <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Ej: Ibuprofeno, Amoxicilina..."
              placeholderTextColor={colors.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary }]}
            onPress={handleSearch}
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="#fff" />
                <Text style={styles.searchButtonText}>Buscar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: '#3B82F620', borderColor: '#3B82F640' }]}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Ingresá el nombre del medicamento que buscás para ver su disponibilidad y precio
          </Text>
        </View>

        {/* Results */}
        {!loading && searched && medications.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Resultados ({medications.length})
            </Text>
            {medications.map((med, index) => (
              <View
                key={index}
                style={[styles.medicationCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.medicationHeader}>
                  <View style={[styles.medicationIcon, { backgroundColor: '#EC489920' }]}>
                    <Ionicons name="medical" size={24} color="#EC4899" />
                  </View>
                  <View style={styles.medicationTitleContainer}>
                    <Text style={[styles.medicationName, { color: colors.text }]}>
                      {med.nombre}
                    </Text>
                    {med.requiereReceta && (
                      <View style={styles.prescriptionBadge}>
                        <Ionicons name="document-text" size={12} color="#F59E0B" />
                        <Text style={styles.prescriptionText}>Requiere Receta</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.medicationDetails}>
                  <View style={styles.medicationDetail}>
                    <Ionicons name="business" size={16} color={colors.textSecondary} />
                    <Text style={[styles.medicationDetailText, { color: colors.textSecondary }]}>
                      {med.laboratorio}
                    </Text>
                  </View>

                  <View style={styles.medicationDetail}>
                    <Ionicons name="cube" size={16} color={colors.textSecondary} />
                    <Text style={[styles.medicationDetailText, { color: colors.textSecondary }]}>
                      {med.presentacion}
                    </Text>
                  </View>

                  <View style={styles.medicationDetail}>
                    <Ionicons name="cash" size={16} color={colors.textSecondary} />
                    <Text style={[styles.medicationDetailText, { color: colors.text, fontWeight: '600' }]}>
                      {formatPrice(med.precio)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loading && searched && medications.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="search" size={48} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No se encontraron medicamentos
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Intentá buscar con otro término
            </Text>
          </View>
        )}

        {/* Initial State */}
        {!searched && !loading && (
          <View style={styles.initialState}>
            <View style={[styles.initialIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="medical" size={64} color="#EC4899" />
            </View>
            <Text style={[styles.initialTitle, { color: colors.text }]}>
              Buscá tu medicamento
            </Text>
            <Text style={[styles.initialText, { color: colors.textSecondary }]}>
              Usá el buscador de arriba para encontrar información sobre medicamentos
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
  searchBox: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  medicationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  medicationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationTitleContainer: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  prescriptionText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  medicationDetails: {
    gap: 8,
  },
  medicationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medicationDetailText: {
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
  initialState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  initialIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  initialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  initialText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});