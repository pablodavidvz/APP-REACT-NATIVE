import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import NavBar from '../components/NavBar';
import patientService from '../services/patientService';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { patient, setPatient } = usePatient();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(patient || {});

  // Estados para obras sociales
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loadingObrasSociales, setLoadingObrasSociales] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchObraSocial, setSearchObraSocial] = useState('');
  const [selectedObraSocial, setSelectedObraSocial] = useState(null);

  useEffect(() => {
    if (editing && obrasSociales.length === 0) {
      loadObrasSociales();
    }
  }, [editing]);

  const loadObrasSociales = async () => {
    setLoadingObrasSociales(true);
    try {
      const data = await patientService.getObrasSociales();
      setObrasSociales(data);
    } catch (error) {
      console.error('Error cargando obras sociales:', error);
    } finally {
      setLoadingObrasSociales(false);
    }
  };

  if (!patient) {
    navigation.navigate('Scanner');
    return null;
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await patientService.updatePatient(patient.id, formData);
      if (result.success) {
        setPatient(result.patient);
        setEditing(false);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectObraSocial = (obraSocial) => {
    setSelectedObraSocial(obraSocial);
    setFormData({ ...formData, idobrasocial: obraSocial.id.toString() });
    setModalVisible(false);
    setSearchObraSocial('');
  };

  const filteredObrasSociales = obrasSociales.filter(os =>
    os.nombre.toLowerCase().includes(searchObraSocial.toLowerCase()) ||
    (os.sigla && os.sigla.toLowerCase().includes(searchObraSocial.toLowerCase()))
  );

  const getSexoText = (sexo) => {
    if (!sexo) return 'No especificado';
    if (sexo === 'M') return 'Masculino';
    if (sexo === 'F') return 'Femenino';
    return sexo;
  };

  const getObraSocialName = () => {
    if (selectedObraSocial) return selectedObraSocial.nombre;
    if (formData.idobrasocial) {
      const os = obrasSociales.find(o => o.id.toString() === formData.idobrasocial.toString());
      return os ? os.nombre : formData.idobrasocial;
    }
    return 'No especificado';
  };

  const renderField = (label, value, key, icon, editable = true) => (
    <View style={[styles.field, { backgroundColor: colors.card }]}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={[styles.fieldLabel, { color: colors.textSecondary || '#6B7280' }]}>{label}</Text>
      </View>
      {editing && editable ? (
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={formData[key]?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, [key]: text })}
          placeholderTextColor={colors.textSecondary || '#6B7280'}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: colors.text }]}>
          {value || 'No especificado'}
        </Text>
      )}
    </View>
  );

  const renderObraSocialField = () => (
    <View style={[styles.field, { backgroundColor: colors.card }]}>
      <View style={styles.fieldHeader}>
        <Ionicons name="medical" size={20} color={colors.primary} />
        <Text style={[styles.fieldLabel, { color: colors.textSecondary || '#6B7280' }]}>Obra Social</Text>
      </View>
      {editing ? (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[styles.selectorButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.selectorText, { color: colors.text }]}>
            {getObraSocialName()}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <Text style={[styles.fieldValue, { color: colors.text }]}>
          {getObraSocialName()}
        </Text>
      )}
    </View>
  );

  const renderObraSocialModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Obra Social</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary || '#9CA3AF'} />
            <TextInput
              value={searchObraSocial}
              onChangeText={setSearchObraSocial}
              placeholder="Buscar por nombre o sigla..."
              placeholderTextColor={colors.textSecondary || '#9CA3AF'}
              style={[styles.searchInput, { color: colors.text }]}
              autoFocus={true}
            />
            {searchObraSocial.length > 0 && (
              <TouchableOpacity onPress={() => setSearchObraSocial('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary || '#9CA3AF'} />
              </TouchableOpacity>
            )}
          </View>

          {loadingObrasSociales ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>Cargando obras sociales...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredObrasSociales}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.obraSocialItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleSelectObraSocial(item)}
                >
                  <View style={styles.obraSocialInfo}>
                    <Text style={[styles.obraSocialNombre, { color: colors.text }]}>{item.nombre}</Text>
                    {item.sigla && (
                      <Text style={[styles.obraSocialSigla, { color: colors.primary }]}>{item.sigla}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary || '#9CA3AF'} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={48} color={colors.textSecondary || '#9CA3AF'} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary || '#9CA3AF' }]}>
                    No se encontraron obras sociales
                  </Text>
                </View>
              }
              style={styles.obrasSocialesList}
            />
          )}

          {!loadingObrasSociales && (
            <Text style={[styles.resultCount, { color: colors.textSecondary || '#9CA3AF' }]}>
              {filteredObrasSociales.length} obras sociales encontradas
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavBar navigation={navigation} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatarLarge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.avatarLargeText, { color: colors.primary }]}>
              {patient.nombre?.[0] || ''}{patient.apellido?.[0] || ''}
            </Text>
          </View>
          <Text style={[styles.headerName, { color: colors.text }]}>
            {patient.nombre || ''} {patient.apellido || ''}
          </Text>
          <Text style={[styles.headerDni, { color: colors.textSecondary || '#6B7280' }]}>
            DNI: {patient.dni || ''}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!editing ? (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, { backgroundColor: colors.primary }]}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  setEditing(false);
                  setFormData(patient);
                  setSelectedObraSocial(null);
                }}
              >
                <Text style={[styles.buttonTextSecondary, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, { backgroundColor: '#10B981' }]}
                onPress={handleSave}
                disabled={loading}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.buttonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Información Personal
          </Text>
          {renderField('Nombre', patient.nombre, 'nombre', 'person')}
          {renderField('Apellido', patient.apellido, 'apellido', 'person')}
          {renderField('DNI', patient.dni, 'dni', 'card', false)}
          {renderField('Fecha de Nacimiento', patient.fecnac, 'fecnac', 'calendar')}
          {renderField('Sexo', getSexoText(patient.sexo), 'sexo', 'male-female', false)}
        </View>

        {/* Contacto */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contacto
          </Text>
          {renderField('Teléfono', patient.telefono, 'telefono', 'call')}
          {renderField('Email', patient.email, 'email', 'mail')}
        </View>

        {/* Dirección */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Dirección
          </Text>
          {renderField('Calle', patient.calle, 'calle', 'home')}
          {renderField('Número', patient.numero, 'numero', 'home')}
          {renderField('Ciudad', patient.ciudad, 'ciudad', 'location')}
        </View>

        {/* Obra Social - Siempre visible */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Obra Social
          </Text>
          {renderObraSocialField()}
          {renderField('N° Afiliado', patient.numeroafiliado, 'numeroafiliado', 'card')}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Obras Sociales */}
      {renderObraSocialModal()}
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
    paddingVertical: 32,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerDni: {
    fontSize: 16,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  buttonPrimary: {
    flex: 1,
  },
  buttonSecondary: {
    flex: 1,
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  field: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    marginLeft: 28,
  },
  input: {
    fontSize: 16,
    marginLeft: 28,
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  // Estilos del selector
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 28,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  // Estilos del modal
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  obrasSocialesList: {
    maxHeight: 400,
  },
  obraSocialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  obraSocialInfo: {
    flex: 1,
  },
  obraSocialNombre: {
    fontSize: 16,
    fontWeight: '500',
  },
  obraSocialSigla: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  resultCount: {
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 12,
  },
});
