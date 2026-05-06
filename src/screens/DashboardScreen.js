import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { subscribeActivities } from '../services/data.service';
import useUserStore from '../store/useUserStore';
import { theme } from '../styles/theme';
import AppCard from '../components/AppCard';
import StatCard from '../components/StatCard';
import ContextTip from '../components/ContextTip';
import QuickLogCard from '../components/QuickLogCard';
import GamificationCard from '../components/GamificationCard';

const screenWidth = Dimensions.get('window').width;

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
        energyCarbon: 0,
        waterCarbon: 0,
        recyclingCarbon: 0,
        topCategory: null,
        activityCount: 0,
        avgEmission: 0,
      };
    }

    const transportCarbon = activities
      .filter(act => act.category === 'transport')
      .reduce((sum, act) => sum + (act.carbonFootprint || 0), 0);

    const foodCarbon = activities
      .filter(act => act.category === 'food')
      .reduce((sum, act) => sum + (act.carbonFootprint || 0), 0);

    const energyCarbon = activities
      .filter(act => act.category === 'energy')
      .reduce((sum, act) => sum + (act.carbonFootprint || 0), 0);

    const waterCarbon = activities
      .filter(act => act.category === 'water')
      .reduce((sum, act) => sum + (act.carbonFootprint || 0), 0);

    const recyclingCarbon = activities
      .filter(act => act.category === 'recycling')
      .reduce((sum, act) => sum + Math.abs(act.carbonFootprint || 0), 0);

    const totalCarbon = transportCarbon + foodCarbon + energyCarbon + waterCarbon - recyclingCarbon;

    const categories = [
      { name: 'Ulaşım', value: transportCarbon },
      { name: 'Gıda', value: foodCarbon },
      { name: 'Enerji', value: energyCarbon },
      { name: 'Su', value: waterCarbon },
    ];

    const topCat = categories.reduce((max, cat) => cat.value > max.value ? cat : max, { name: '', value: 0 });
    const topCategoryData = topCat.value > 0
      ? { ...topCat, percentage: ((topCat.value / Math.max(totalCarbon, 1)) * 100).toFixed(1) }
      : null;

    return {
      totalCarbon: Math.max(0, totalCarbon).toFixed(1),
      transportCarbon: transportCarbon.toFixed(1),
      foodCarbon: foodCarbon.toFixed(1),
      energyCarbon: energyCarbon.toFixed(1),
      waterCarbon: waterCarbon.toFixed(1),
      recyclingCarbon: recyclingCarbon.toFixed(1),
      topCategory: topCategoryData,
      activityCount: activities.length,
      avgEmission: activities.length > 0 ? (Math.max(0, totalCarbon) / activities.length).toFixed(2) : 0,
    };
  }, [activities]);

  const chartData = [
    {
      name: 'Ulaşım',
      carbon: parseFloat(analytics.transportCarbon),
      color: theme.colors.primary,
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Gıda',
      carbon: parseFloat(analytics.foodCarbon),
      color: theme.colors.primaryLight,
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Enerji',
      carbon: parseFloat(analytics.energyCarbon),
      color: theme.colors.secondary,
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Su',
      carbon: parseFloat(analytics.waterCarbon),
      color: theme.colors.secondaryLight,
      legendFontColor: '#7F7F7F',
    },
  ].filter(item => item.carbon > 0);

  const getCarbonContext = (value) => {
    const numValue = parseFloat(value);
    if (numValue < 5) return 'Harika! Günü iyi başlattın';
    if (numValue < 10) return 'İyi gidiyor, devam et';
    if (numValue < 15) return 'Normal seviye, iyileştirebilirsin';
    return 'Bugün daha bilinçli seçimler yapabilirsin';
  };

  const getContextTips = () => {
    const tips = [];

    if (analytics.totalCarbon > 0) {
      const carKm = (parseFloat(analytics.transportCarbon) / 0.21).toFixed(1);
      tips.push(`${analytics.transportCarbon} kg = ~${carKm} km araba yolculuğu`);
    }

    if (analytics.activityCount > 0) {
      const change = 'son güne kıyasla 12% daha iyi';
      tips.push(`Sen ${change} performans gösteriyorsun (Trend yükseliş)`);
    }

    if (analytics.topCategory) {
      tips.push(`En çok emisyon kaynağın: ${analytics.topCategory.name} (${analytics.topCategory.percentage}%)`);
    }

    return tips.length > 0
      ? tips
      : ['Hiç aktivite kaydı yok, başlamak için + butonuna bas'];
  };

  const getQuickLogSuggestions = () => {
    const suggestions = [
      { icon: 'car', activity: 'Araba', label: '10 km', carbon: '2.1', type: 'transport' },
      { icon: 'bus', activity: 'Otobüs', label: '5 km', carbon: '0.4', type: 'transport' },
      { icon: 'restaurant', activity: 'Tavuk', label: '150g', carbon: '1.0', type: 'food' },
      { icon: 'leaf', activity: 'Vejetaryen', label: '1 öğün', carbon: '2.0', type: 'food' },
    ];
    return suggestions;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Merhaba!</Text>
          <Ionicons name="hand-left" size={24} color={theme.colors.primary} style={styles.waveIcon} />
        </View>
        <Text style={styles.subtitle}>{getCarbonContext(analytics.totalCarbon)}</Text>
      </View>

      {/* Ana Metrikleri */}
      <AppCard variant="primary" style={styles.mainCard}>
        <Text style={styles.mainLabel}>Bugünün Toplam Karbon Ayak İzi</Text>
        <View style={styles.mainValue}>
          <Text style={styles.bigNumber}>{analytics.totalCarbon}</Text>
          <Text style={styles.mainUnit}>kg CO₂e</Text>
        </View>
      </AppCard>

      {/* İstatistik Kartları */}
      {activities.length > 0 && (
        <View style={styles.statsRow}>
          <StatCard
            icon="car"
            label="Ulaşım"
            value={analytics.transportCarbon}
            variant="primary"
          />
          <StatCard
            icon="restaurant"
            label="Gıda"
            value={analytics.foodCarbon}
            variant="accent"
          />
        </View>
      )}

      {parseFloat(analytics.energyCarbon) > 0 && (
        <View style={styles.statsRow}>
          <StatCard
            icon="flash"
            label="Enerji"
            value={analytics.energyCarbon}
            variant="warning"
          />
          <StatCard
            icon="water"
            label="Su"
            value={analytics.waterCarbon}
            variant="accent"
          />
        </View>
      )}

      {/* Bağlamsal İpuçları */}
      <ContextTip
        icon="bulb"
        title="Bunu Biliyor Musun?"
        tips={getContextTips()}
      />

      {/* Grafik */}
      {chartData.length > 0 && (
        <AppCard>
          <Text style={styles.chartTitle}>Emisyon Dağılımı</Text>
          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(45, 106, 79, ${opacity})`,
              propsForLabels: {
                fontSize: 12,
              },
            }}
            accessor="carbon"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </AppCard>
      )}

      {/* Oyunlaştırma */}
      <GamificationCard />

      {/* Hızlı Kayıt */}
      <View style={styles.quickLogSection}>
        <View style={styles.quickLogHeader}>
          <Text style={styles.quickLogTitle}>Hızlı Kayıt</Text>
          <Text style={styles.quickLogSubtitle}>Sık aktiviteler</Text>
        </View>

        {getQuickLogSuggestions().map((item, index) => (
          <QuickLogCard
            key={index}
            icon={item.icon}
            label={item.label}
            activity={item.activity}
            carbonValue={item.carbon}
            isFrequent={index < 2}
            onPress={() => navigation.navigate('AddActivity')}
          />
        ))}
      </View>

      {/* Son Aktiviteler */}
      {activities.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Son Aktiviteler</Text>

          {activities.slice(0, 5).map(act => {
            const category = act.category || 'transport';
            const type = act.type || 'car';
            const iconName = getActivityIcon(category, type);
            const label = getActivityLabel(category, type);
            const dateString = act.createdAt?.toDate?.()
              ? act.createdAt.toDate().toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Tarih bilinmiyor';

            const detailText = act.value
              ? `${act.value} ${act.unit || ''}`
              : act.distance
              ? `${act.distance} km`
              : '';

            return (
              <AppCard key={act.id} variant="accent" style={styles.historyCard}>
                <View style={styles.historyContent}>
                  <View style={styles.historyIcon}>
                    <Ionicons name={iconName} size={20} color={theme.colors.primary} />
                  </View>

                  <View style={styles.historyText}>
                    <Text style={styles.historyActivityName}>
                      {label}
                      {detailText && <Text style={styles.detailText}> • {detailText}</Text>}
                    </Text>
                    <Text style={styles.historyDate}>{dateString}</Text>
                  </View>

                  <Text style={styles.historyCarbonValue}>
                    {act.isNegative ? '-' : '+'}
                    {Math.abs(act.carbonFootprint).toFixed(1)} kg
                  </Text>
                </View>
              </AppCard>
            );
          })}
        </View>
      )}

      {/* FAB Butonu */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddActivity')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

function getActivityIcon(category, type) {
  const iconMap = {
    transport: {
      car: 'car',
      bus: 'bus',
      train: 'train',
      flight: 'airplane',
      motorcycle: 'car-sport',
      electricCar: 'flash',
    },
    food: 'restaurant',
    energy: 'flash',
    water: 'water',
    recycling: 'refresh',
  };

  if (category === 'transport' && iconMap[category][type]) {
    return iconMap[category][type];
  }
  return iconMap[category] || 'help-circle';
}

function getActivityLabel(category, type) {
  const labels = {
    transport: {
      car: 'Araba',
      bus: 'Otobüs',
      train: 'Tren',
      flight: 'Uçak',
      motorcycle: 'Motosiklet',
      electricCar: 'Elektrikli Araba',
    },
    food: {
      beef: 'Sığır Eti',
      lamb: 'Kuzu Eti',
      pork: 'Domuz Eti',
      chicken: 'Tavuk',
      fish: 'Balık',
      eggs: 'Yumurta',
      dairy: 'Süt Ürünleri',
      vegetarian: 'Vejetaryen Öğün',
      vegan: 'Vegan Öğün',
    },
    energy: {
      electricity: 'Elektrik',
      naturalGas: 'Doğalgaz',
      heating: 'Isıtma',
      solar: 'Güneş Enerjisi',
      wind: 'Rüzgar Enerjisi',
    },
    water: {
      water: 'Su Tüketimi',
    },
    recycling: {
      paper: 'Kağıt Geri Dönüşüm',
      plastic: 'Plastik Geri Dönüşüm',
      metal: 'Metal Geri Dönüşüm',
      glass: 'Cam Geri Dönüşüm',
    },
  };

  return labels[category]?.[type] || type || category;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.textDark,
  },
  waveIcon: {
    marginLeft: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMedium,
  },
  mainCard: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  mainLabel: {
    ...theme.typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
  },
  mainValue: {
    alignItems: 'center',
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainUnit: {
    ...theme.typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  chartTitle: {
    ...theme.typography.body,
    color: theme.colors.textDark,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  quickLogSection: {
    marginTop: theme.spacing.xl,
  },
  quickLogHeader: {
    marginBottom: theme.spacing.lg,
  },
  quickLogTitle: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
  },
  quickLogSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  historySection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxxl,
  },
  historyTitle: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.lg,
  },
  historyCard: {
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  historyText: {
    flex: 1,
  },
  historyActivityName: {
    ...theme.typography.body,
    color: theme.colors.textDark,
    fontWeight: '600',
  },
  detailText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    fontWeight: '400',
  },
  historyDate: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  historyCarbonValue: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
});
