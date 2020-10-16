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

const Tab = createBottomTabNavigator(); 
export default function App() {   
  let [data, setData] = React.useState([]);
  const [lat, setLatitude] = React.useState(0);
  const [lng, setLongitude] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState(null);

  //Function to get gps location 
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

   //Function to fetch currency symbol
   const fetchLocation = () =>{
    React.useEffect( () => {
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=89f1a3d326ee4d2282442ef0a95d879a`,)
        .then((response)=> response.json())
        .then((json)=>setData(json))
        .catch((err)=>console.log(err))
     },[lat,lng]);
   }
console.log(data)
 fetchLocation();
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
            } else {
              iconName = focused ? 'ios-partly-sunny':'ios-partly-sunny';
            }

           
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          labelStyle: {fontSize:14}
        }}
      >
        <Tab.Screen name="Home"  children={() => <HomeTab geo={data} />} />
        <Tab.Screen name="Weather" component={WeatherTab} />

        <Tab.Screen name="My Places" component={MyPlacesTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}