import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveActivity, carbonFootprintCalculator } from '../services/data.service';
import useUserStore from '../store/useUserStore';

const TRANSPORT_TYPES = [
  { id: 'car', label: 'Araba', icon: 'car' },
  { id: 'bus', label: 'Otobüs', icon: 'bus' },
  { id: 'train', label: 'Tren', icon: 'train' },
  { id: 'flight', label: 'Uçak', icon: 'airplane' },
];

const FOOD_TYPES = [
  { id: 'beef', label: 'Sığır Eti', icon: 'restaurant' },
  { id: 'chicken', label: 'Tavuk', icon: 'restaurant' },
  { id: 'fish', label: 'Balık', icon: 'restaurant' },
  { id: 'vegetarian', label: 'Vejetaryen', icon: 'leaf' },
];

export default function AddActivityScreen({ navigation }) {
  const { user } = useUserStore();
  const [category, setCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateCarbon = () => {
    if (category === 'transport') {
      const km = parseFloat(distance);
      if (!km || km <= 0) return 0;
      return carbonFootprintCalculator[selectedType](km);
    } else if (category === 'food') {
      return carbonFootprintCalculator.food(selectedType);
    }
    return 0;
  };

  const estimatedCarbon = calculateCarbon().toFixed(2);

  const getActivityLabel = (typeId) => {
    if (category === 'transport') {
      return TRANSPORT_TYPES.find(t => t.id === typeId)?.label;
    } else {
      return FOOD_TYPES.find(t => t.id === typeId)?.label;
    }
  };

  const handleAddActivity = async () => {
    if (!user?.uid) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }

    if (!category || !selectedType) {
      Alert.alert('Hata', 'Lütfen kategori ve tür seçiniz');
      return;
    }

    if (category === 'transport' && (!distance || parseFloat(distance) <= 0)) {
      Alert.alert('Hata', 'Lütfen geçerli bir mesafe giriniz');
      return;
    }

    const carbonFootprint = calculateCarbon();

    if (carbonFootprint === 0) {
      Alert.alert('Hata', 'Carbon ayak izi hesaplanamadı');
      return;
    }

    setLoading(true);
    const { success, error } = await saveActivity(user.uid, {
      type: category === 'transport' ? selectedType : 'food',
      foodType: category === 'food' ? selectedType : null,
      distance: category === 'transport' ? parseFloat(distance) : null,
      carbonFootprint,
    });
    setLoading(false);

    if (success) {
      Alert.alert('Başarılı', 'Aktivite eklendi');
      setCategory(null);
      setSelectedType(null);
      setDistance('');
      navigation.goBack();
    } else {
      Alert.alert('Hata', error || 'Aktivite eklenirken hata oluştu');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={32} color="#40916C" />
        </TouchableOpacity>
        <Text style={styles.title}>Aktivite Ekle</Text>
        <View style={{ width: 32 }} />
      </View>

      {!category ? (
        <>
          <Text style={styles.sectionTitle}>Kategori Seçin</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setCategory('transport')}
          >
            <Ionicons name="car" size={40} color="#40916C" />
            <Text style={styles.categoryText}>Ulaşım</Text>
            <Text style={styles.categorySubtext}>Araç kullanımı</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setCategory('food')}
          >
            <Ionicons name="restaurant" size={40} color="#40916C" />
            <Text style={styles.categoryText}>Gıda</Text>
            <Text style={styles.categorySubtext}>Yemek tüketimi</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.breadcrumb}>
            <TouchableOpacity onPress={() => setCategory(null)}>
              <Text style={styles.breadcrumbText}>Kategori</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbText}> / </Text>
            <Text style={styles.breadcrumbActive}>
              {category === 'transport' ? 'Ulaşım' : 'Gıda'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Tür Seçin</Text>
          <View style={styles.typeGrid}>
            {(category === 'transport' ? TRANSPORT_TYPES : FOOD_TYPES).map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Ionicons
                  name={type.icon}
                  size={32}
                  color={selectedType === type.id ? '#fff' : '#40916C'}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === type.id && styles.typeLabelSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedType && category === 'transport' && (
            <>
              <Text style={styles.sectionTitle}>Mesafe (km)</Text>
              <TextInput
                style={styles.input}
                placeholder="Mesafe girin"
                value={distance}
                onChangeText={setDistance}
                keyboardType="decimal-pad"
                editable={!loading}
                placeholderTextColor="#95D5B2"
              />
            </>
          )}

          {selectedType && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {getActivityLabel(selectedType)}
                </Text>
                {category === 'transport' && distance && (
                  <Text style={styles.summaryValue}>{distance} km</Text>
                )}
              </View>
              <View style={styles.carbonRow}>
                <Text style={styles.carbonLabel}>Tahmini Emisyon:</Text>
                <Text style={styles.carbonValue}>{estimatedCarbon} kg CO2</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, (!selectedType || loading) && styles.submitButtonDisabled]}
            onPress={handleAddActivity}
            disabled={!selectedType || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Aktiviteyi Ekle</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F4',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 15,
    marginTop: 10,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#95D5B2',
  },
  breadcrumbActive: {
    fontSize: 14,
    color: '#40916C',
    fontWeight: '600',
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginTop: 10,
  },
  categorySubtext: {
    fontSize: 12,
    color: '#95D5B2',
    marginTop: 5,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#D8F3DC',
  },
  typeCardSelected: {
    backgroundColor: '#40916C',
    borderColor: '#40916C',
  },
  typeLabel: {
    fontSize: 14,
    color: '#1B4332',
    marginTop: 8,
    fontWeight: '600',
  },
  typeLabelSelected: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D8F3DC',
    color: '#1B4332',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#40916C',
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
  summaryValue: {
    fontSize: 14,
    color: '#95D5B2',
  },
  carbonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#D8F3DC',
  },
  carbonLabel: {
    fontSize: 12,
    color: '#95D5B2',
  },
  carbonValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#40916C',
  },
  submitButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#95D5B2',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
