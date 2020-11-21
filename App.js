import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeTab from './tabs/HomeTab';
import MyPlacesTab from './tabs/MyPlacesTab';
import CurrencyTab from './tabs/CurrencyTab';
import * as Location from 'expo-location';
import { openCageKey, openWeatherKey, unsplash } from './tabs/keys.js';
import { toJson } from 'unsplash-js';

const Tab = createBottomTabNavigator();
export default function App() {
  //State variables
  let [lat, setLatitude] = React.useState(null);
  let [lng, setLongitude] = React.useState(null);
  let [data, setData] = React.useState('');
  let [currency, setCurrency] = React.useState('');
  let [weather, setWeather] = React.useState('');
  const [photo, setPhoto] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState(null);

  //Static variables
  let iso_code = data && data.results[0].annotations.currency.iso_code;
  let rates = currency && currency.rates[Object.keys(currency.rates)[0]];
  const { county, city } = data && data.results[0].components;

  //Function to get latitude and longitude from gps
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({ Accuracy: 6 });

      setLatitude(location && location.coords.latitude);
      setLongitude(location && location.coords.longitude);
    })();
  }, []);

  //Promise to fetch data about the place, such as currency code, symbol, city and country
  React.useEffect(() => {
    if (lat && lng) {
      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${openCageKey}`,
      )
        .then((response) => response.json())
        .then((json) => setData(json));
    }
  }, [lat, lng]);

  //Promise to trigger data about currency rate based on users location
  React.useEffect(() => {
    fetch(`https://api.exchangeratesapi.io/latest?base=USD&symbols=${iso_code}`)
      .then((response) => response.json())
      .then((json) => setCurrency(json));
  }, [iso_code]);

  //Promise to fetch data of weather conditions
  React.useEffect(() => {
    if (lat && lng) {
      fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${openWeatherKey}`,
      )
        .then((response) => response.json())
        .then((json) => setWeather(json));
    }
  }, [lat, lng]);

  //Promise to fetch photos from unsplash API`
  React.useEffect(() => {
    if (county || city) {
      unsplash.search
        .photos(county || city, 1, 1, {
          orientation: 'landscape',
          color: 'black_and_white',
        })
        .then(toJson)
        .then((json) => {
          setPhoto(json);
        });
    }
  }, [county, city]);
  //If none of the following variables are assigned, show an ActivityIndicator
  if (!data || !weather || !currency) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        {/* Tab navigator with the buttons and icons */}
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'ios-home' : 'ios-home';
              } else if (route.name === 'My Places') {
                iconName = focused ? 'ios-map' : 'ios-map';
              } else {
                iconName = focused ? 'logo-usd' : 'logo-usd';
              }

              return (
                <Ionicons
                  name={iconName}
                  size={25}
                  color={color}
                  rate={rates}
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
          {/* Home tab with its respective props */}
          <Tab.Screen
            name="Home"
            children={() => <HomeTab geo={data} weather={weather} />}
          />

          {/* Currency tab with its respective props */}
          <Tab.Screen
            name="Currency"
            children={() => <CurrencyTab currency={rates} geo={data} />}
          />

          {/* My Places tab with its respective props */}
          <Tab.Screen
            name="My Places"
            children={() => (
              <MyPlacesTab
                geo={data}
                weather={weather}
                rate={rates}
                iso_code={iso_code}
                lat={lat}
                lng={lng}
                photo={photo}
              />
            )}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
