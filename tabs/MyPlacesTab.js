import React from 'react';
import { StyleSheet, Text, View, ScrollView, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import swal from 'sweetalert';

const MyPlacesTab = (props) => {
  //Props variables
  let { rate, weather, geo, iso_code, lat, lng, photo } = props;
  const { county, city } = geo.results[0].components;

  //state variables
  const [places, setPlaces] = React.useState(false);

  //options for date
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date();

  //Function to save information of the places in the localStorage
  const savePlaces = async () => {
    try {
      //Object to be added
      let newValue = {
        city: county || city,
        rate,
        temperature: parseInt(weather.main.temp),
        photo: photo && photo.results[0].urls.small,
        date: date.toLocaleDateString('pt-br', {
          ...options,
          month: 'numeric',
        }),
      };
      //Stringfy the variable before add to localStorage
      JSON.stringify(newValue);

      //get all the previous values from localStorage and save in a array
      let cities = JSON.parse(await AsyncStorage.getItem('cities')) || [];

      //add the new values into the array
      cities.push(newValue);

      //Add the new values into the localStorage
      await AsyncStorage.setItem('cities', JSON.stringify(cities));
      swal('Good job!', 'City saved successfully', 'success');

      //Trigger the function to show the new data
      showPlaces();
    } catch (e) {
      swal(e);
    }
  };

  //Function to show the data that are stored in the localStorage
  const showPlaces = async () => {
    //Store all data in the places variable and show on show it
    let places =
      (await AsyncStorage.getItem(`cities`)) &&
      JSON.parse(await AsyncStorage.getItem(`cities`));
    setPlaces(places);
  };
  //UseEffect to triger show places when the tab is selected
  React.useEffect(() => {
    showPlaces();
  }, []);

  //Function to remove an element of the array and set to localStorage
  const removeElement = async (index) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this item!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        //If the user presses yes, then it deletes the item
        places.splice(index, 1);
        await AsyncStorage.setItem('cities', JSON.stringify(places));
        showPlaces();
        swal('Your item has been deleted!', {
          icon: 'success',
        });
      } else {
        swal('Your item is safe :D');
      }
    });
  };

  return (
    <>
      <ScrollView>
        {/*Map function to iterate the place's array from localStorage in a card, in the reverse way, so the last addeds show first*/}
        {places.length ? (
          places
            .slice(0)
            .reverse()
            .map((place, key) => (
              <Card
                key={key}
                style={{
                  marginBottom: 25,
                  marginLeft: `8%`,
                  marginRight: `8%`,
                  marginTop: 10,
                  backgroundColor: '#F5F5F5',
                }}
              >
                <Card.Cover source={{ uri: place && place.photo }} />
                <Card.Content>
                  <Title>
                    {place.city}, {place.date}
                  </Title>
                  <Paragraph>
                    1 USD to {iso_code} was {place.rate.toFixed(2)}
                    {geo.results[0].annotations.currency.symbol}
                  </Paragraph>
                  <Paragraph>
                    The temperature was {place.temperature}°
                  </Paragraph>
                </Card.Content>
                <Card.Actions>
                  {/* Button to remove trigger the function that removes an item */}
                  <Button
                    mode="contained"
                    color="red"
                    onPress={() => {
                      removeElement(key);
                    }}
                    style={{ marginRight: 25 }}
                  >
                    Remove
                  </Button>

                  {/* Button to redirect the user to open the location iin google maps app */}
                  <Button
                    mode="contained"
                    icon="map-marker-radius"
                    color="#5db6c7"
                    dark={true}
                    onPress={() => {
                      Linking.openURL(
                        `https://www.google.com/maps/place/${lat},${lng}`,
                      );
                    }}
                  >
                    Open in Map
                  </Button>
                </Card.Actions>
              </Card>
            ))
        ) : (
          //If there isn`t any item in the array, it shows a text message
          <View
            style={{
              marginTop: '80%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 23 }}>You haven't saved any item yet</Text>
          </View>
        )}
      </ScrollView>
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => {
          savePlaces();
        }}
      />
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
