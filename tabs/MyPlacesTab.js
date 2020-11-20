import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyPlacesTab = (props) => {
  let { rate, weather, geo } = props;
  const [places, setPlaces] = React.useState(false);
  const { county, city } = geo.results[0].components;

  const savePlaces = async () => {
    try {
      let newValue = {
        city: county || city,
        rate,
        temperature: parseInt(weather.main.temp),
      };
      await AsyncStorage.setItem('newValue', JSON.stringify(newValue));
      let cities = JSON.parse(await AsyncStorage.getItem('cities')) || [];
      cities.push(newValue);
      await AsyncStorage.setItem('cities', JSON.stringify(cities));
      showPlaces();
    } catch (e) {
      // saving error
    }
  };

  const showPlaces = async () => {
    let places =
      (await AsyncStorage.getItem(`cities`)) &&
      JSON.parse(await AsyncStorage.getItem(`cities`));
    setPlaces(places);
    console.log();
  };

  React.useEffect(() => {
    showPlaces();
  }, []);

  console.log(places);

  return (
    <>
      <ScrollView>
        <View style={{ firstChild: { marginTop: 25 } }}>
          {places &&
            places.map((place, key) => (
              <Card
                key={key}
                style={{
                  marginBottom: 25,
                  marginLeft: `10%`,
                  marginRight: `10%`,
                }}
              >
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Content>
                  <Title>{place.city}</Title>
                  <Paragraph>{place.rate}</Paragraph>
                  <Paragraph>{place.temperature}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button>Cancel</Button>
                  <Button>Ok</Button>
                </Card.Actions>
              </Card>
            ))}
        </View>
      </ScrollView>
      <FAB style={styles.fab} small icon="plus" onPress={savePlaces} />
    </>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default MyPlacesTab;
