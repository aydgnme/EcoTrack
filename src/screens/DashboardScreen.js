import useUserStore from '@/store/useUserStore.js';
import { Text, TouchableOpacity, View } from 'react-native';

function DashboardScreen() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F9F4' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2D6A4F', marginBottom: 20 }}>
        Hoşgeldiniz {user?.email}
      </Text>
      <TouchableOpacity style={{ backgroundColor: '#d32f2f', padding: 12, borderRadius: 8 }} onPress={logout}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

export default DashboardScreen;