import React from 'react'
import { StyleSheet, Text, View } from 'react-native';


const HomeTab = (props) => {

  const {results } = props.geo;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
      <Text>{results && results[0].components.county}</Text>
    </View>
  )
}

export default HomeTab;




