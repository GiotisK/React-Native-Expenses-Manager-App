import React from 'react'
import {
    createBottomTabNavigator,
    createAppContainer,
    createStackNavigator,
} from 'react-navigation'
import IncomeTab from './src/tabs/IncomeTab'
import GraphsScreen from './src/tabs/GraphsScreen'
import CalendarScreen from './src/tabs/CalendarScreen'
import InputScreen from './src/tabs/InputScreen'
import CameraScreen from './src/tabs/CameraScreen'

const TabNavigator = createBottomTabNavigator(
    {
        Calendar: { screen: CalendarScreen },
        Graphs: { screen: GraphsScreen },
        BalanceSheet: { screen: IncomeTab },
    },
    {
        tabBarOptions: {
            activeTintColor: '#3949ab',
            style: {},
            showLabel: false,
            showIcon: true,
        },
        navigationOptions: {
            header: null,
        },
    }
)

const StackNavigator = createStackNavigator(
    {
        Main: { screen: TabNavigator },
        InputScreen: { screen: InputScreen },
        CameraScreen: { screen: CameraScreen },
    },
    {
        headerLayoutPreset: 'center', //forces the header to be on the center
        headerMode: 'float',
    }
)

export default createAppContainer(StackNavigator)
