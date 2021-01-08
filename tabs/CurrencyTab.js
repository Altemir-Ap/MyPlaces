import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { List } from 'react-native-paper';
import { RadioButton } from 'react-native-paper';

const CurrencyTab = (props) => {
  //Props variables
  const { results } = props.geo;
  const { currency, users } = props;
  const [value, setValue] = React.useState('first');
  const [data, setData] = React.useState('');
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

      <View>
        <List.AccordionGroup>
          <View>
            <Text>Users</Text>
            <List.Accordion title="Accordion 3" id="3">
              <RadioButton.Group
                onValueChange={(value) => setValue(value)}
                value={value}
              >
                {users.map((user) => (
                  <RadioButton.Item
                    label={user.name}
                    value={user._id}
                    key={user._id}
                  />
                ))}
              </RadioButton.Group>
            </List.Accordion>
          </View>
        </List.AccordionGroup>
      </View>
    </View>
  );
};

export default CurrencyTab;
