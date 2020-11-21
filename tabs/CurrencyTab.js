import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

const CurrencyTab = (props) => {
  //Props variables
  const { results } = props.geo;
  const { currency } = props;

  //State variables
  const [total, setTotal] = React.useState(0);
  const [currencyStatus, setStatus] = React.useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
      }}
    >
      {/* Button to toggle between the currencyStatus for conversion, if false converts from USD to local currency and Vice Versa*/}
      <Button
        title={
          currencyStatus
            ? ` ${results[0].annotations.currency.iso_code} to USD`
            : `USD to ${results[0].annotations.currency.iso_code}`
        }
        onPress={() => {
          setStatus(currencyStatus ? false : true);
        }}
      />

      {/* Text input to receive the amount to be converted*/}
      <TextInput
        style={{
          marginTop: 10,
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          width: 200,
        }}
        onChangeText={(amount) =>
          setTotal(!currencyStatus ? amount * currency : amount / currency)
        }
        placeholder="Type the amount to convert"
      />
      {/* Amount converted */}
      <Text>
        {total
          ? !currencyStatus
            ? total.toFixed(2) + results[0].annotations.currency.symbol
            : total.toFixed(2) + '$'
          : 'Please type a number'}
      </Text>
    </View>
  );
};

export default CurrencyTab;
