
import React from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator, createMaterialTopTabNavigator} from 'react-navigation';
import {View, Text} from 'react-native'
import Icon from 'react-native-ionicons'
import BalanceSheetScreen from './src/tabs/BalanceSheetScreen'
import OutcomeTab from './src/tabs/OutcomeTab'
import IncomeTab from './src/tabs/IncomeTab'
import GraphsScreen from './src/tabs/GraphsScreen'
import CalendarScreen from './src/tabs/CalendarScreen'
import InputScreen from './src/tabs/InputScreen'
import CameraScreen from './src/tabs/CameraScreen'
import MonthYearHeader from './src/tabs/MonthYearHeader'


let func = ''
let appMonth = 'May'
global.appMonth = appMonth

let appYear = '2019'
global.appYear = appYear




const incomeStack = createStackNavigator({
  In:{screen: IncomeTab}
})

const outcomeStack = createStackNavigator({
  Out:{screen: OutcomeTab}
})

const GraphsTabNavigator = createMaterialTopTabNavigator({
  'Income Analysis':{screen: incomeStack},
  'Outcome Analysis':{screen: outcomeStack}
},{
  navigationOptions:{
    
    /*headerTitle:(
      <View style={{flex:1}}>
        <MonthYearHeader
          monthSelectedValue = {months[new Date().getMonth() + 1]}
          monthOnValueChange = {(itemValue, itemIndex)=>{appMonth=itemValue; ()=>{return func}}}
          yearSelectedValue = { new Date().getFullYear()}
          yearOnValueChange ={(itemValue, itemIndex)=>{appYear=itemValue}}
        />
      </View>
    )*/
  },
  tabBarOptions:{
    upperCaseLabel: false,
    indicatorStyle:{
      backgroundColor:'#3949ab'
    },
    style:{backgroundColor:'white'},
    activeTintColor:'#3949ab',
    inactiveTintColor:'gray'
    //activeTintColor:'redcy'
  }
});



/*GraphsStackNavigator = createStackNavigator({
  GraphsStack: GraphsTabNavigator
})

GraphsStackNavigator.navigationOptions={
  tabBarIcon: ({tintColor, focused}) => (
    <Icon 
          name = "paper"
          size = {28}
          color = {tintColor}
          inactiveTintColor="black"
    />
  )
}*/

const TabNavigator = createBottomTabNavigator({
  Calendar:{screen: CalendarScreen} ,
  Graphs: {screen: GraphsScreen},
  BalanceSheet: {screen: IncomeTab/*BalanceSheetScreen*/},
},
{
    tabBarOptions:{
      activeTintColor: "#3949ab",
      //inactiveTintColor: "black",
      style: {
        //backgroundColor: "#989898",
      }, 
      showLabel: false,
      showIcon: true,
      //activeBackgroundColor: "#696969"
    },
    navigationOptions:{
      header: null
    }
});

GraphsTabNavigator.navigationOptions={
  tabBarIcon: ({tintColor, focused}) => (
    <Icon 
          name = "paper"
          size = {28}
          color = {tintColor}
          inactiveTintColor="black"
    />
  )
}


const StackNavigator = createStackNavigator({
  Main:{screen: TabNavigator},
  Second:{screen: InputScreen},
  Third:{screen: CameraScreen}
},{
  headerLayoutPreset : 'center', //forces the header to be on the center
  headerMode: 'float'
})





export default createAppContainer(StackNavigator);
