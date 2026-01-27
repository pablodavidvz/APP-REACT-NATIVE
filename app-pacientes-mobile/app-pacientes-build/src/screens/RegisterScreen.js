import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePatient } from '../contexts/PatientContext';
import patientService from '../services/patientService';

export default function RegisterScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { setPatient } = usePatient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Estados para obras sociales
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loadingObrasSociales, setLoadingObrasSociales] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchObraSocial, setSearchObraSocial] = useState('');
  const [selectedObraSocial, setSelectedObraSocial] = useState(null);

  const [formData, setFormData] = useState({
    dni: '', nombre: '', apellido: '', fecnac: '', sexo: '',
    telefono: '', email: '', calle: '', numero: '', ciudad: '',
    idobrasocial: '', numeroafiliado: ''
  });

  useEffect(() => {
    if (route.params?.scannedData) {
      const scanned = route.params.scannedData;
      setFormData(prev => ({
        ...prev,
        dni: scanned.dni || '',
        nombre: scanned.nombre || '',
        apellido: scanned.apellido || '',
        fecnac: scanned.fecnac || scanned.fechaNacimiento || '',
        sexo: scanned.sexo || '',
      }));
    }
  }, [route.params]);

  // Cargar obras sociales cuando se entra al paso 2
  useEffect(() => {
    if (step === 2 && obrasSociales.length === 0) {
      loadObrasSociales();
    }
  }, [step]);

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

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.dni || !formData.nombre || !formData.apellido || !formData.fecnac) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSelectObraSocial = (obraSocial) => {
    setSelectedObraSocial(obraSocial);
    updateField('idobrasocial', obraSocial.id.toString());
    setModalVisible(false);
    setSearchObraSocial('');
  };

  const filteredObrasSociales = obrasSociales.filter(os => 
    os.nombre.toLowerCase().includes(searchObraSocial.toLowerCase()) ||
    (os.sigla && os.sigla.toLowerCase().includes(searchObraSocial.toLowerCase()))
  );

  const handleSubmit = async () => {
    if (!formData.telefono || !formData.email) {
      Alert.alert('Error', 'Por favor complete teléfono y email');
      return;
    }
    setLoading(true);
    try {
      const result = await patientService.register(formData);
      await setPatient(result.patient || formData);
      Alert.alert('Registro Exitoso', 'El paciente ha sido registrado correctamente',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      setLoading(false);
      if (error.message && (error.message.includes('409') || error.message.toLowerCase().includes('ya existe'))) {
        await setPatient({ dni: formData.dni, nombre: formData.nombre, apellido: formData.apellido, sexo: formData.sexo, fecnac: formData.fecnac });
        Alert.alert('Paciente Registrado', `${formData.nombre} ${formData.apellido} ya tiene una cuenta en el sistema.`,
          [{ text: 'Ir al Inicio', onPress: () => navigation.navigate('Home') }]
        );
        return;
      }
      Alert.alert('Error de Registro', error.message || 'No se pudo registrar el paciente');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default', required = false) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}{required && ' *'}</Text>
      <TextInput
        value={formData[field]}
        onChangeText={(text) => updateField(field, text)}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary || '#9CA3AF'}
        keyboardType={keyboardType}
        autoCapitalize={field === 'email' ? 'none' : 'sentences'}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
      />
    </View>
  );

  const renderObraSocialSelector = () => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>Obra Social</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.selectorButton, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.selectorText, { color: selectedObraSocial ? colors.text : (colors.textSecondary || '#9CA3AF') }]}>
          {selectedObraSocial ? selectedObraSocial.nombre : 'Seleccionar obra social'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.text} />
      </TouchableOpacity>
      {selectedObraSocial && selectedObraSocial.sigla && (
        <Text style={[styles.obraSocialSigla, { color: colors.primary }]}>
          {selectedObraSocial.sigla}
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
          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Obra Social</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Buscador */}
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

          {/* Lista de obras sociales */}
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
                      <Text style={[styles.obraSocialSiglaList, { color: colors.primary }]}>{item.sigla}</Text>
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

          {/* Contador de resultados */}
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
      <LinearGradient colors={['#1E6091', '#0A4B78']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Paciente</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.stepsContainer}>
        <View style={[styles.stepCircle, step >= 1 && styles.stepActive]}>
          <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        <View style={[styles.stepCircle, step >= 2 && styles.stepActive]}>
          <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>2</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {step === 1 ? 'Datos Personales' : 'Datos de Contacto'}
      </Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <View style={styles.formContainer}>
            {renderInput('DNI', 'dni', 'Ingrese DNI', 'numeric', true)}
            {renderInput('Nombre', 'nombre', 'Ingrese nombre', 'default', true)}
            {renderInput('Apellido', 'apellido', 'Ingrese apellido', 'default', true)}
            {renderInput('Fecha de Nacimiento', 'fecnac', 'DD/MM/AAAA', 'default', true)}
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Sexo *</Text>
              <View style={styles.sexContainer}>
                <TouchableOpacity
                  onPress={() => updateField('sexo', 'M')}
                  style={[styles.sexButton, { backgroundColor: formData.sexo === 'M' ? '#1E6091' : colors.card, borderColor: colors.border }]}
                >
                  <Text style={{ color: formData.sexo === 'M' ? '#fff' : colors.text, fontWeight: '600' }}>Masculino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateField('sexo', 'F')}
                  style={[styles.sexButton, { backgroundColor: formData.sexo === 'F' ? '#1E6091' : colors.card, borderColor: colors.border }]}
                >
                  <Text style={{ color: formData.sexo === 'F' ? '#fff' : colors.text, fontWeight: '600' }}>Femenino</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleNextStep} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Siguiente</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            {renderInput('Teléfono', 'telefono', 'Ingrese teléfono', 'phone-pad', true)}
            {renderInput('Email', 'email', 'ejemplo@email.com', 'email-address', true)}
            {renderInput('Calle', 'calle', 'Nombre de la calle')}
            {renderInput('Número', 'numero', 'Número', 'numeric')}
            {renderInput('Ciudad', 'ciudad', 'Ciudad')}
            
            {/* Selector de Obra Social */}
            {renderObraSocialSelector()}
            
            {renderInput('Número de Afiliado', 'numeroafiliado', 'Número de afiliado', 'numeric')}

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setStep(1)} style={[styles.secondaryButton, { borderColor: colors.border }]}>
                <Ionicons name="arrow-back" size={20} color={colors.text} />
                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Atrás</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} disabled={loading} style={[styles.primaryButton, { flex: 1, opacity: loading ? 0.7 : 1 }]}>
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles.primaryButtonText}>Registrar</Text>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Obras Sociales */}
      {renderObraSocialModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  stepsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  stepCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: '#1E6091' },
  stepText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  stepTextActive: { color: '#fff' },
  stepLine: { width: 60, height: 4, backgroundColor: '#E5E7EB', marginHorizontal: 8 },
  stepLineActive: { backgroundColor: '#1E6091' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 16 },
  scrollView: { flex: 1 },
  formContainer: { paddingHorizontal: 20 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1 },
  sexContainer: { flexDirection: 'row', gap: 12 },
  sexButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E6091', padding: 16, borderRadius: 12, gap: 8, marginTop: 8 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderWidth: 1, gap: 8 },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  
  // Estilos del selector de obra social
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  obraSocialSigla: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
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
  obraSocialSiglaList: {
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
