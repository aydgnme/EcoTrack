import DashboardScreen from '@/screens/DashboardScreen';
import LoginScreen from '@/screens/LoginScreen';
import useUserStore from '@/store/useUserStore';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isLoggedIn } = useUserStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}