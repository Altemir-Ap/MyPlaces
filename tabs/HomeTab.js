import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

const HomeTab = (props) => {
  const { results } = props.geo;
  const { rate } = props;
  const [total, setTotal] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const county = results && results[0].components.county;
  const city = results && results[0].components.city;

  let text = '';
  if (!city && !county) {
    text = 'Loading...';
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to {text || county || city}</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 70 }}
        onChangeText={(amount) => setAmount(amount)}
      />

      <Button title="convert" onPress={() => setTotal(amount * rate)} />
      <Text> {''}</Text>
      <Text>
        {total && total
          ? total.toFixed(2) + results[0].annotations.currency.symbol
          : 'Please, enter an amount (Number)'}
      </Text>
    </View>
  );
};

export default HomeTab;
