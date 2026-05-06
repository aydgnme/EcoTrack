import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { subscribeActivities } from '../services/data.service';
import useUserStore from '../store/useUserStore';

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen({ navigation }) {
  const { user } = useUserStore();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeActivities(user.uid, (fetchedActivities) => {
      setActivities(fetchedActivities);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const analytics = useMemo(() => {
    if (!activities.length) {
      return {
        totalCarbon: 0,
        transportCarbon: 0,
        foodCarbon: 0,
        topCategory: null,
        activityCount: 0,
        avgEmission: 0,
      };
    }

    const transportCarbon = activities
      .filter(act => act.type === 'transport' || act.type === 'car' || act.type === 'bus' || act.type === 'train' || act.type === 'flight')
      .reduce((sum, act) => sum + act.carbonFootprint, 0);

    const foodCarbon = activities
      .filter(act => act.type === 'food')
      .reduce((sum, act) => sum + act.carbonFootprint, 0);

    const totalCarbon = transportCarbon + foodCarbon;

    const topCategory = totalCarbon > 0
      ? transportCarbon > foodCarbon
        ? { name: 'Ulaşım', value: transportCarbon, percentage: ((transportCarbon / totalCarbon) * 100).toFixed(1) }
        : { name: 'Gıda', value: foodCarbon, percentage: ((foodCarbon / totalCarbon) * 100).toFixed(1) }
      : null;

    return {
      totalCarbon: totalCarbon.toFixed(1),
      transportCarbon: transportCarbon.toFixed(1),
      foodCarbon: foodCarbon.toFixed(1),
      topCategory,
      activityCount: activities.length,
      avgEmission: activities.length > 0 ? (totalCarbon / activities.length).toFixed(2) : 0,
    };
  }, [activities]);

  const chartData = [
    {
      name: "Ulaşım",
      carbon: parseFloat(analytics.transportCarbon),
      color: "#40916C",
      legendFontColor: "#7F7F7F",
    },
    {
      name: "Gıda",
      carbon: parseFloat(analytics.foodCarbon),
      color: "#95D5B2",
      legendFontColor: "#7F7F7F",
    }
  ];


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba!</Text>
          <Text style={styles.totalText}>Toplam: {analytics.totalCarbon} kg CO2</Text>
        </View>
      </View>

      {activities.length > 0 ? (
        <>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Ionicons name="leaf" size={28} color="#40916C" />
              <Text style={styles.summaryValue}>{analytics.totalCarbon}</Text>
              <Text style={styles.summaryLabel}>Toplam CO2</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="car" size={28} color="#2D6A4F" />
              <Text style={styles.summaryValue}>{analytics.transportCarbon}</Text>
              <Text style={styles.summaryLabel}>Ulaşım</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="restaurant" size={28} color="#95D5B2" />
              <Text style={styles.summaryValue}>{analytics.foodCarbon}</Text>
              <Text style={styles.summaryLabel}>Gıda</Text>
            </View>
          </View>

          {analytics.topCategory && (
            <View style={styles.topCategoryCard}>
              <View style={styles.topCategoryHeader}>
                <Text style={styles.topCategoryTitle}>En Yüksek Emisyon</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{analytics.topCategory.percentage}%</Text>
                </View>
              </View>
              <Text style={styles.topCategoryName}>{analytics.topCategory.name}</Text>
              <Text style={styles.topCategoryValue}>{analytics.topCategory.value} kg CO2</Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analytics.activityCount}</Text>
              <Text style={styles.statLabel}>Aktivite</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analytics.avgEmission}</Text>
              <Text style={styles.statLabel}>Ort. Emisyon</Text>
            </View>
          </View>
        </>
      ) : null}

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
          accessor={"carbon"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>

      <View style={{ marginTop: 25, marginBottom: 100 }}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        {activities.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Ionicons name="leaf" size={40} color="#95D5B2" />
            <Text style={{ textAlign: 'center', color: '#95D5B2', marginTop: 10 }}>Henüz veri eklenmemiş</Text>
          </View>
        ) : (
          activities.slice(0, 5).map(act => (
            <View key={act.id} style={styles.historyCard}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={act.type === 'car' ? 'car' : act.type === 'transport' ? 'bus' : 'restaurant'}
                  size={24}
                  color="#40916C"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityType}>{act.type.toUpperCase()}</Text>
                <Text style={styles.activityDate}>
                  {act.createdAt?.toDate().toLocaleDateString('tr-TR')}
                </Text>
              </View>
              <Text style={{ fontWeight: 'bold', color: '#1B4332' }}>{act.carbonFootprint.toFixed(1)} kg</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddActivity')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F4', padding: 20 },
  header: { marginTop: 50, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1B4332' },
  totalText: { fontSize: 18, color: '#40916C', marginTop: 5 },
  summaryCards: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#95D5B2',
    marginTop: 4,
  },
  topCategoryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#40916C',
    elevation: 2,
  },
  topCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  topCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95D5B2',
  },
  badge: {
    backgroundColor: '#D8F3DC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#40916C',
  },
  topCategoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 5,
  },
  topCategoryValue: {
    fontSize: 16,
    color: '#40916C',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  statLabel: {
    fontSize: 12,
    color: '#95D5B2',
    marginTop: 5,
  },
  chartContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 10, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#1B4332' },
  historyCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#40916C',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  activityType: {
    fontWeight: 'bold',
    color: '#1B4332',
    fontSize: 16
  },
  activityDate: {
    color: '#74c69d',
    fontSize: 12
  },
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