import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteActivity, subscribeActivities } from '../services/data.service';
import useUserStore from '../store/useUserStore';

export default function HistoryScreen({ navigation }) {
  const { user } = useUserStore();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeActivities(user.uid, (data) => {
      setActivities(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleDelete = (activityId) => {
    Alert.alert(
      'Aktiviteyi Sil',
      'Bu aktiviteyi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteActivity(activityId);
            if (res.success) {
              Alert.alert('Başarılı', 'Aktivite silindi.');
            } else {
              Alert.alert('Hata', 'Aktivite silinemedi.');
            }
          },
        },
      ]
    );
  };

  const getActivityIcon = (type) => {
    const icons = {
      car: 'car',
      bus: 'bus',
      train: 'train',
      flight: 'airplane',
      food: 'restaurant',
    };
    return icons[type] || 'help-circle';
  };

  const getActivityLabel = (type) => {
    const labels = {
      car: 'Araba',
      bus: 'Otobüs',
      train: 'Tren',
      flight: 'Uçak',
      food: 'Gıda',
    };
    return labels[type] || type;
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Aktivite Geçmişi</Text>
          <Text style={styles.subtitle}>
            {activities.length > 0 ? `${activities.length} aktivite` : 'Tüm aktiviteleriniz'}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#40916C" />
            <Text style={styles.loadingText}>Aktiviteler yükleniyor...</Text>
          </View>
        ) : activities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf" size={64} color="#95D5B2" />
            <Text style={styles.emptyText}>Henüz aktivite eklenmemiş.</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddActivity')}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.emptyButtonText}>İlk Aktiviteyi Ekle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {activities.map((activity) => (
              <View key={activity.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={getActivityIcon(activity.type)}
                      size={28}
                      color="#40916C"
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.activityType}>{getActivityLabel(activity.type)}</Text>
                    <Text style={styles.activityDate}>
                      {activity.createdAt?.toDate?.().toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    {activity.distance && (
                      <Text style={styles.activityDetail}>{activity.distance} km</Text>
                    )}
                  </View>
                  <View style={styles.rightContainer}>
                    <Text style={styles.carbon}>{activity.carbonFootprint.toFixed(1)} kg</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(activity.id)}
                    >
                      <Ionicons name="trash" size={18} color="#E63946" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddActivity')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F4' },
  header: { padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1B4332' },
  subtitle: { fontSize: 14, color: '#40916C', marginTop: 5 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    color: '#95D5B2',
    fontSize: 14,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: { color: '#95D5B2', fontSize: 16, marginTop: 20 },
  emptyButton: {
    flexDirection: 'row',
    backgroundColor: '#40916C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: { paddingHorizontal: 15, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailsContainer: { flex: 1 },
  activityType: { fontSize: 16, fontWeight: '600', color: '#1B4332' },
  activityDate: { fontSize: 12, color: '#74c69d', marginTop: 3 },
  activityDetail: { fontSize: 12, color: '#40916C', marginTop: 2 },
  rightContainer: { alignItems: 'flex-end' },
  carbon: { fontSize: 16, fontWeight: 'bold', color: '#2D6A4F', marginBottom: 8 },
  deleteButton: { padding: 5 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#40916C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
