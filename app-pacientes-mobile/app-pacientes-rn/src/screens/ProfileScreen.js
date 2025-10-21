import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

  const renderField = (label, value, key, icon, editable = true) => (
    <View style={[styles.field, { backgroundColor: colors.card }]}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      {editing && editable ? (
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={formData[key]?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, [key]: text })}
          placeholderTextColor={colors.textSecondary}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: colors.text }]}>
          {value || 'No especificado'}
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavBar navigation={navigation} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatarLarge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.avatarLargeText, { color: colors.primary }]}>
              {patient.nombre?.[0]}{patient.apellido?.[0]}
            </Text>
          </View>
          <Text style={[styles.headerName, { color: colors.text }]}>
            {patient.nombre} {patient.apellido}
          </Text>
          <Text style={[styles.headerDni, { color: colors.textSecondary }]}>
            DNI: {patient.dni}
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
                }}
              >
                <Text style={[styles.buttonTextSecondary, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, { backgroundColor: colors.success }]}
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
          {renderField('Sexo', patient.sexo === 'M' ? 'Masculino' : 'Femenino', 'sexo', 'male-female', false)}
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

        {/* Obra Social */}
        {patient.idobrasocial && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Obra Social
            </Text>
            {renderField('Obra Social', patient.idobrasocial, 'idobrasocial', 'medical')}
            {renderField('N° Afiliado', patient.numeroafiliado, 'numeroafiliado', 'card')}
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
});