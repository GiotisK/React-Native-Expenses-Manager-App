import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-ionicons';

class BalanceSheetScreen extends React.Component {
    render() {
      return (
        <View style={styles.ViewStyle}>
          <Text>BalanceSheet!</Text>
        </View>
      );
    }
}
  
  /*BalanceSheetScreen.navigationOptions = {
    tabBarIcon: ({tintColor, focused}) => (
      <Icon 
            name = "paper"
            size = {28}
            color = {tintColor}
            inactiveTintColor="black"
       />
    )
  }*/


  const styles = {
    ViewStyle:{
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center'
    }
  }

  export default BalanceSheetScreen;
