import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useMemo } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveActivity, carbonFootprintCalculator, activityCategories } from '../services/data.service';
import useUserStore from '../store/useUserStore';

export default function AddActivityScreen({ navigation }) {
  const { user } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);

  const categoryKeys = Object.keys(activityCategories);
  const currentCategory = selectedCategory ? activityCategories[selectedCategory] : null;
  const currentType = selectedType ? currentCategory?.types.find(t => t.id === selectedType) : null;

  const estimatedCarbon = useMemo(() => {
    if (!selectedType || !value || parseFloat(value) <= 0) return 0;

    const numValue = parseFloat(value);

    switch (selectedCategory) {
      case 'transport':
        const transportCalcs = carbonFootprintCalculator.transport;
        if (selectedType === 'car') return transportCalcs.calculateCar(numValue, unit);
        if (selectedType === 'bus') return transportCalcs.calculateBus(numValue, unit);
        if (selectedType === 'train') return transportCalcs.calculateTrain(numValue, unit);
        if (selectedType === 'flight') return transportCalcs.calculateFlight(numValue, unit);
        if (selectedType === 'motorcycle') return transportCalcs.calculateMotorcycle(numValue);
        if (selectedType === 'electricCar') return transportCalcs.calculateElectricCar(numValue);
        break;

      case 'food':
        const foodCalcs = carbonFootprintCalculator.food;
        if (selectedType === 'beef') return foodCalcs.calculateBeef(numValue, unit);
        if (selectedType === 'chicken') return foodCalcs.calculateChicken(numValue, unit);
        if (selectedType === 'fish') return foodCalcs.calculateFish(numValue, unit);
        if (selectedType === 'pork') return foodCalcs.calculatePork(numValue, unit);
        if (selectedType === 'lamb') return foodCalcs.calculateLamb(numValue, unit);
        if (selectedType === 'eggs') return foodCalcs.calculateEggs(numValue);
        if (selectedType === 'dairy') return foodCalcs.calculateDairy(numValue, unit);
        if (selectedType === 'vegetarian') return foodCalcs.calculateVegetarian();
        if (selectedType === 'vegan') return foodCalcs.calculateVegan();
        break;

      case 'energy':
        const energyCalcs = carbonFootprintCalculator.energy;
        if (selectedType === 'electricity') return energyCalcs.calculateElectricity(numValue);
        if (selectedType === 'naturalGas') return energyCalcs.calculateNaturalGas(numValue, unit);
        if (selectedType === 'heating') return energyCalcs.calculateHeating(numValue);
        if (selectedType === 'solar') return energyCalcs.calculateSolar(numValue);
        if (selectedType === 'wind') return energyCalcs.calculateWind(numValue);
        break;

      case 'water':
        return carbonFootprintCalculator.water.calculateWater(numValue, unit);

      case 'recycling':
        const recycleCalcs = carbonFootprintCalculator.recycling;
        if (selectedType === 'paper') return recycleCalcs.calculatePaper(numValue);
        if (selectedType === 'plastic') return recycleCalcs.calculatePlastic(numValue);
        if (selectedType === 'metal') return recycleCalcs.calculateMetal(numValue);
        if (selectedType === 'glass') return recycleCalcs.calculateGlass(numValue);
        break;
    }
    return 0;
  }, [selectedCategory, selectedType, value, unit]);

  const handleAddActivity = async () => {
    if (!user?.uid) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }

    if (!selectedCategory || !selectedType) {
      Alert.alert('Hata', 'Lütfen kategori ve tür seçiniz');
      return;
    }

    if (!value || parseFloat(value) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir değer giriniz');
      return;
    }

    if (currentType?.units.length > 1 && !unit) {
      Alert.alert('Hata', 'Lütfen birim seçiniz');
      return;
    }

    if (estimatedCarbon === 0) {
      Alert.alert('Hata', 'Carbon ayak izi hesaplanamadı');
      return;
    }

    setLoading(true);
    const { success, error } = await saveActivity(user.uid, {
      category: selectedCategory,
      type: selectedType,
      value: parseFloat(value),
      unit: unit || currentType?.units[0],
      carbonFootprint: Math.abs(parseFloat(estimatedCarbon)),
      isNegative: estimatedCarbon < 0, // Geri dönüşüm için
    });
    setLoading(false);

    if (success) {
      Alert.alert('Başarılı', 'Aktivite eklendi');
      setSelectedCategory(null);
      setSelectedType(null);
      setValue('');
      setUnit('');
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

      {!selectedCategory ? (
        <>
          <Text style={styles.sectionTitle}>Kategori Seçin</Text>
          <View style={styles.categoryGrid}>
            {categoryKeys.map(key => {
              const cat = activityCategories[key];
              const icons = {
                transport: 'car',
                food: 'restaurant',
                energy: 'flash',
                water: 'water',
                recycling: 'refresh',
              };
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.categoryButton}
                  onPress={() => {
                    setSelectedCategory(key);
                    setSelectedType(null);
                    setValue('');
                    setUnit('');
                  }}
                >
                  <Ionicons name={icons[key]} size={36} color="#40916C" />
                  <Text style={styles.categoryText}>{cat.label}</Text>
                  <Text style={styles.categorySubtext}>{cat.types.length} seçenek</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <View style={styles.breadcrumb}>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.breadcrumbText}>Kategori</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbText}> / </Text>
            <Text style={styles.breadcrumbActive}>{currentCategory.label}</Text>
          </View>

          <Text style={styles.sectionTitle}>Tür Seçin</Text>
          <View style={styles.typeGrid}>
            {currentCategory.types.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => {
                  setSelectedType(type.id);
                  setValue('');
                  setUnit(type.units[0] || '');
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={selectedType === type.id ? '#fff' : 'transparent'}
                  style={styles.typeCheckmark}
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

          {selectedType && (
            <>
              <Text style={styles.sectionTitle}>Değer Gir</Text>
              <View style={styles.inputSection}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.valueInput]}
                    placeholder="Miktar"
                    value={value}
                    onChangeText={setValue}
                    keyboardType="decimal-pad"
                    editable={!loading}
                    placeholderTextColor="#95D5B2"
                  />
                  {currentType.units.length > 1 ? (
                    <View style={styles.unitButtons}>
                      {currentType.units.map(u => (
                        <TouchableOpacity
                          key={u}
                          style={[
                            styles.unitButton,
                            (unit || currentType.units[0]) === u && styles.unitButtonActive,
                          ]}
                          onPress={() => setUnit(u)}
                          disabled={loading}
                        >
                          <Text
                            style={[
                              styles.unitButtonText,
                              (unit || currentType.units[0]) === u && styles.unitButtonTextActive,
                            ]}
                          >
                            {getUnitLabel(u)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.unitDisplay}>
                      <Text style={styles.unitText}>
                        {getUnitLabel(currentType.units[0])}
                      </Text>
                    </View>
                  )}
                </View>

                {currentType.units.length > 1 && (
                  <Text style={styles.unitHint}>
                    {getUnitHint(selectedType, unit || currentType.units[0])}
                  </Text>
                )}
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {currentCategory.label}: {currentType.label}
                  </Text>
                  {value && (
                    <Text style={styles.summaryValue}>
                      {value} {getUnitLabel(unit || currentType.units[0])}
                    </Text>
                  )}
                </View>
                <View style={styles.carbonRow}>
                  <Text style={styles.carbonLabel}>
                    {estimatedCarbon < 0 ? 'Tasarruf:' : 'Emisyon:'}
                  </Text>
                  <Text
                    style={[
                      styles.carbonValue,
                      estimatedCarbon < 0 && styles.carbonNegative,
                    ]}
                  >
                    {Math.abs(parseFloat(estimatedCarbon)).toFixed(2)} kg CO2
                  </Text>
                </View>
              </View>

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
        </>
      )}
    </ScrollView>
  );
}

function getUnitLabel(unit) {
  const labels = {
    km: 'km',
    liter: 'Litre',
    hour: 'Saat',
    gram: 'Gram',
    portion: 'Porsiyon',
    piece: 'Adet',
    meal: 'Öğün',
    kWh: 'kWh',
    m3: 'm³',
    kg: 'kg',
  };
  return labels[unit] || unit;
}

function getUnitHint(type, unit) {
  const hints = {
    beef_gram: '1 porsiyon ≈ 150 gram',
    beef_portion: '1 porsiyon = 150 gram',
    chicken_gram: '1 porsiyon ≈ 150 gram',
    chicken_portion: '1 porsiyon = 150 gram',
    fish_gram: '1 porsiyon ≈ 150 gram',
    fish_portion: '1 porsiyon = 150 gram',
    lamb_gram: '1 porsiyon ≈ 150 gram',
    lamb_portion: '1 porsiyon = 150 gram',
    pork_gram: '1 porsiyon ≈ 150 gram',
    pork_portion: '1 porsiyon = 150 gram',
    car_km: 'Ortalama 9L/100km',
    car_liter: '1 litre ≈ 11 km',
    naturalGas_m3: '1 m³ ≈ 10 kWh',
  };
  return hints[`${type}_${unit}`] || '';
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B4332',
    marginTop: 8,
  },
  categorySubtext: {
    fontSize: 11,
    color: '#95D5B2',
    marginTop: 4,
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
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#D8F3DC',
  },
  typeCardSelected: {
    backgroundColor: '#40916C',
    borderColor: '#40916C',
  },
  typeCheckmark: {
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    color: '#1B4332',
    fontWeight: '600',
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: '#fff',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D8F3DC',
    color: '#1B4332',
  },
  valueInput: {
    flex: 1,
  },
  unitButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  unitButton: {
    flex: 1,
    backgroundColor: '#F0F9F4',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D8F3DC',
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#40916C',
    borderColor: '#40916C',
  },
  unitButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#40916C',
  },
  unitButtonTextActive: {
    color: '#fff',
  },
  unitDisplay: {
    flex: 1,
    backgroundColor: '#F0F9F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#40916C',
  },
  unitHint: {
    fontSize: 11,
    color: '#95D5B2',
    marginTop: 8,
    fontStyle: 'italic',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
  },
  summaryValue: {
    fontSize: 12,
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
  carbonNegative: {
    color: '#2D6A4F',
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
