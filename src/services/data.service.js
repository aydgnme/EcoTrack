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

export const carbonFootprintCalculator = {
  car: (kilometers) => kilometers * 0.21,
  bus: (kilometers) => kilometers * 0.089,
  train: (kilometers) => kilometers * 0.041,
  flight: (kilometers) => kilometers * 0.255,
  food: (type) => {
    const carbonByType = {
      beef: 27,
      chicken: 6.9,
      fish: 12.7,
      vegetarian: 2,
    };
    return carbonByType[type] || 5;
  },
};
