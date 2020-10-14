import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          
          tabBarIcon: ({ focused, color, size }) => { 
            let iconName;
            
            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-home'
                : 'ios-home';
            } else if (route.name === 'My Places') {
              iconName = focused ? 'ios-map' : 'ios-map';
            }

           
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        
        }}
      
      >
        <Tab.Screen name="Home" options={{}} component={HomeScreen} />
        <Tab.Screen name="My Places" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
