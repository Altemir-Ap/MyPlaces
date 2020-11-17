import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeTab from './tabs/HomeTab';
import MyPlacesTab from './tabs/MyPlacesTab';
import WeatherTab from './tabs/WeatherTab';
import * as Location from 'expo-location';
import { openCageKey, openWeatherKey } from './keys.js';

const Tab = createBottomTabNavigator();
export default function App() {
  let [lat, setLatitude] = React.useState(null);
  let [lng, setLongitude] = React.useState(null);
  let [data, setData] = React.useState('');
  let [currency, setCurrency] = React.useState('');
  let [weather, setWeather] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState(null);

  let iso_code = data && data.results[0].annotations.currency.iso_code;
  let { rates } = currency && currency;
  let conversion = rates && rates[Object.keys(rates)[0]];

  //Function to get gps location
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({ Accuracy: 6 });
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  //Function to fetch currency symbol
  React.useEffect(() => {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${openCageKey}`,
    )
      .then((response) => response.json())
      .then((json) => setData(json));
    console.log(data);
  }, [lng]);

  React.useEffect(() => {
    fetch(`https://api.exchangeratesapi.io/latest?base=USD&symbols=${iso_code}`)
      .then((response) => response.json())
      .then((json) => setCurrency(json));
    console.log(iso_code);
  }, [iso_code]);

  React.useEffect(() => {
    fetch(
      `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}`,
    )
      .then((response) => response.json())
      .then((json) => setWeather(json));
    console.log(data);
  }, [lng]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'ios-home' : 'ios-home';
            } else if (route.name === 'My Places') {
              iconName = focused ? 'ios-map' : 'ios-map';
            } else {
              iconName = focused ? 'ios-partly-sunny' : 'ios-partly-sunny';
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
                rate={conversion}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          labelStyle: { fontSize: 14 },
        }}
      >
        <Tab.Screen
          name="Home"
          children={() => <HomeTab geo={data} rate={conversion} />}
        />
        <Tab.Screen name="Weather" component={WeatherTab} />
        <Tab.Screen name="My Places" component={MyPlacesTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
