import React from 'react';
import { Text, View } from 'react-native';

const HomeTab = (props) => {
  //variables which values are assigned from props
  const { results } = props.geo;
  const { county, city } = results && results[0].components;
  const { weather } = props && props;

  //Function to get the day
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
  const day = week[date];

  return (
    //Render the message on home tab
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 23 }}>
        {county || city}, {day}, {parseInt(weather && weather.main.temp)}°C
      </Text>
    </View>
  );
};

export default HomeTab;
