import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WeatherTab = (props) => {
  const { weather } = props;
  const date = new Date().getDay();
  const week = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  console.log(props);
  const day = week[date];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 23 }}>
        {day}, {weather.name}, {parseInt(weather.main.temp)}°C
      </Text>
    </View>
  );
};

export default WeatherTab;
