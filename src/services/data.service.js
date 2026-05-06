import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

export const saveActivity = async (userId, activityData) => {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      userId,
      ...activityData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const subscribeActivities = (userId, callback) => {
  const q = query(
    collection(db, 'activities'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(activities);
  });

  return unsubscribe;
};

export const deleteActivity = async (activityId) => {
  try {
    await deleteDoc(doc(db, 'activities', activityId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateActivity = async (activityId, updates) => {
  try {
    await updateDoc(doc(db, 'activities', activityId), updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const carbonFactors = {
  // Ulaşım (kg CO2 per unit)
  transport: {
    car: { perKm: 0.21, perLiter: 2.31 }, // ortalama 9L/100km
    bus: { perKm: 0.089, perPassenger: 0.089 },
    train: { perKm: 0.041 },
    flight: { perKm: 0.255, perHour: 90 },
    motorcycle: { perKm: 0.11 },
    electricCar: { perKm: 0.05 },
  },
  // Gıda (kg CO2 per unit)
  food: {
    beef: { perGram: 0.027, perPortion: 4.05 }, // 150g = 1 portion
    lamb: { perGram: 0.025, perPortion: 3.75 },
    pork: { perGram: 0.012, perPortion: 1.8 },
    chicken: { perGram: 0.0069, perPortion: 1.04 },
    fish: { perGram: 0.0127, perPortion: 1.9 },
    dairy: { perGram: 0.001, perPortion: 0.15 },
    eggs: { perPiece: 0.21 },
    vegetables: { perGram: 0.0002, perPortion: 0.03 },
    fruits: { perGram: 0.0003, perPortion: 0.045 },
    grains: { perGram: 0.0012, perPortion: 0.18 },
    vegetarian: { perMeal: 2 },
    vegan: { perMeal: 1.5 },
  },
  // Enerji (kg CO2 per unit)
  energy: {
    electricity: { perKWh: 0.5 }, // Türkiye ortalama
    naturalGas: { perM3: 2.04, perKWh: 0.204 },
    heating: { perLiter: 2.68 }, // fuel oil
    solar: { perKWh: 0.05 },
    wind: { perKWh: 0.01 },
  },
  // Su (kg CO2 per unit)
  water: {
    perLiter: 0.0004, // su işleme ve pompalanması
    perM3: 0.4,
  },
  // Geri Dönüşüm (kg CO2 avoided per kg)
  recycling: {
    paper: 0.005, // CO2 tasarrufu per kg
    plastic: 0.006,
    metal: 0.008,
    glass: 0.002,
  },
};

export const carbonFootprintCalculator = {
  // Ulaşım hesaplamaları
  transport: {
    calculateCar: (value, unit = 'km') => {
      if (unit === 'km') return value * carbonFactors.transport.car.perKm;
      if (unit === 'liter') return value * carbonFactors.transport.car.perLiter;
      return 0;
    },
    calculateBus: (value, unit = 'km') => {
      if (unit === 'km') return value * carbonFactors.transport.bus.perKm;
      return 0;
    },
    calculateTrain: (value, unit = 'km') => {
      if (unit === 'km') return value * carbonFactors.transport.train.perKm;
      return 0;
    },
    calculateFlight: (value, unit = 'km') => {
      if (unit === 'km') return value * carbonFactors.transport.flight.perKm;
      if (unit === 'hour') return value * carbonFactors.transport.flight.perHour;
      return 0;
    },
    calculateMotorcycle: (value) => value * carbonFactors.transport.motorcycle.perKm,
    calculateElectricCar: (value) => value * carbonFactors.transport.electricCar.perKm,
  },

  // Gıda hesaplamaları
  food: {
    calculateBeef: (value, unit = 'portion') => {
      if (unit === 'gram') return value * carbonFactors.food.beef.perGram;
      if (unit === 'portion') return value * carbonFactors.food.beef.perPortion;
      return 0;
    },
    calculateChicken: (value, unit = 'portion') => {
      if (unit === 'gram') return value * carbonFactors.food.chicken.perGram;
      if (unit === 'portion') return value * carbonFactors.food.chicken.perPortion;
      return 0;
    },
    calculateFish: (value, unit = 'portion') => {
      if (unit === 'gram') return value * carbonFactors.food.fish.perGram;
      if (unit === 'portion') return value * carbonFactors.food.fish.perPortion;
      return 0;
    },
    calculatePork: (value, unit = 'portion') => {
      if (unit === 'gram') return value * carbonFactors.food.pork.perGram;
      if (unit === 'portion') return value * carbonFactors.food.pork.perPortion;
      return 0;
    },
    calculateLamb: (value, unit = 'portion') => {
      if (unit === 'gram') return value * carbonFactors.food.lamb.perGram;
      if (unit === 'portion') return value * carbonFactors.food.lamb.perPortion;
      return 0;
    },
    calculateEggs: (count) => count * carbonFactors.food.eggs.perPiece,
    calculateVegetarian: () => carbonFactors.food.vegetarian.perMeal,
    calculateVegan: () => carbonFactors.food.vegan.perMeal,
    calculateDairy: (value, unit = 'gram') => {
      if (unit === 'gram') return value * carbonFactors.food.dairy.perGram;
      if (unit === 'portion') return value * carbonFactors.food.dairy.perPortion;
      return 0;
    },
  },

  // Enerji hesaplamaları
  energy: {
    calculateElectricity: (kWh) => kWh * carbonFactors.energy.electricity.perKWh,
    calculateNaturalGas: (value, unit = 'm3') => {
      if (unit === 'm3') return value * carbonFactors.energy.naturalGas.perM3;
      if (unit === 'kWh') return value * carbonFactors.energy.naturalGas.perKWh;
      return 0;
    },
    calculateHeating: (liters) => liters * carbonFactors.energy.heating.perLiter,
    calculateSolar: (kWh) => kWh * carbonFactors.energy.solar.perKWh,
    calculateWind: (kWh) => kWh * carbonFactors.energy.wind.perKWh,
  },

  // Su hesaplamaları
  water: {
    calculateWater: (value, unit = 'liter') => {
      if (unit === 'liter') return value * carbonFactors.water.perLiter;
      if (unit === 'm3') return value * carbonFactors.water.perM3;
      return 0;
    },
  },

  // Geri Dönüşüm (negatif değer = tasarruf)
  recycling: {
    calculatePaper: (kg) => -kg * carbonFactors.recycling.paper,
    calculatePlastic: (kg) => -kg * carbonFactors.recycling.plastic,
    calculateMetal: (kg) => -kg * carbonFactors.recycling.metal,
    calculateGlass: (kg) => -kg * carbonFactors.recycling.glass,
  },

};

// Kategori bilgileri (UI için)
export const activityCategories = {
  transport: {
    label: 'Ulaşım',
    icon: 'car',
    types: [
      { id: 'car', label: 'Araba', units: ['km', 'liter'] },
      { id: 'bus', label: 'Otobüs', units: ['km'] },
      { id: 'train', label: 'Tren', units: ['km'] },
      { id: 'flight', label: 'Uçak', units: ['km', 'hour'] },
      { id: 'motorcycle', label: 'Motosiklet', units: ['km'] },
      { id: 'electricCar', label: 'Elektrikli Araba', units: ['km'] },
    ],
  },
  food: {
    label: 'Gıda',
    icon: 'restaurant',
    types: [
      { id: 'beef', label: 'Sığır Eti', units: ['gram', 'portion'] },
      { id: 'lamb', label: 'Kuzu Eti', units: ['gram', 'portion'] },
      { id: 'pork', label: 'Domuz Eti', units: ['gram', 'portion'] },
      { id: 'chicken', label: 'Tavuk', units: ['gram', 'portion'] },
      { id: 'fish', label: 'Balık', units: ['gram', 'portion'] },
      { id: 'eggs', label: 'Yumurta', units: ['piece'] },
      { id: 'dairy', label: 'Süt Ürünleri', units: ['gram', 'portion'] },
      { id: 'vegetarian', label: 'Vejetaryen Öğün', units: ['meal'] },
      { id: 'vegan', label: 'Vegan Öğün', units: ['meal'] },
    ],
  },
  energy: {
    label: 'Enerji',
    icon: 'flash',
    types: [
      { id: 'electricity', label: 'Elektrik', units: ['kWh'] },
      { id: 'naturalGas', label: 'Doğalgaz', units: ['m3', 'kWh'] },
      { id: 'heating', label: 'Ev Isıtması', units: ['liter'] },
      { id: 'solar', label: 'Güneş (Tasarruf)', units: ['kWh'] },
      { id: 'wind', label: 'Rüzgar (Tasarruf)', units: ['kWh'] },
    ],
  },
  water: {
    label: 'Su',
    icon: 'water',
    types: [
      { id: 'water', label: 'Su Tüketimi', units: ['liter', 'm3'] },
    ],
  },
  recycling: {
    label: 'Geri Dönüşüm',
    icon: 'refresh',
    types: [
      { id: 'paper', label: 'Kağıt (Tasarruf)', units: ['kg'] },
      { id: 'plastic', label: 'Plastik (Tasarruf)', units: ['kg'] },
      { id: 'metal', label: 'Metal (Tasarruf)', units: ['kg'] },
      { id: 'glass', label: 'Cam (Tasarruf)', units: ['kg'] },
    ],
  },
};
