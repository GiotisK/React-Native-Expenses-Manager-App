import React from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-ionicons'
import { PieChart, LineChart } from 'react-native-chart-kit'
import AsyncStorage from '@react-native-community/async-storage'
import { ScrollView } from 'react-native-gesture-handler'
import MonthYearHeader from './MonthYearHeader'

const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
}

const chartConfig2 = {
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    strokeWidth: 2, // optional, default 3
}

let data = []
let year
let month

const data2 = {
    labels: [
        'Jan.',
        'Feb.',
        'Mar.',
        'Apr.',
        'May',
        'June',
        'July',
        'Aug.',
        'Sept.',
        'Oct.',
        'Nov.',
        'Dec.',
    ],
    datasets: [
        {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0],
            color: (opacity = 1) => `rgba(31, 104, 53, ${opacity})`, // optional
            strokeWidth: 2, // optional
        },
        {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `rgba(255,0,0, ${opacity})`, // optional
            strokeWidth: 2, // optional
        },
    ],
}

class GraphsScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: 'Month',
            totalIncome: 0,
            totalOutcome: 0,
            totalSavings: 0,
            data: [],
            foodAmount: 0,
            entertainmentAmount: 0,
            shoppingAmount: 0,
            billsAmount: 0,
            healthAmount: 0,
            otherAmount: 0,
        }
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                month = months[new Date().getMonth() + 1]
                year = new Date().getFullYear()
                this.getMonthValuesFromAsyncStorage()
            }
        )
    }

    getMonthValuesFromAsyncStorage = async () => {
        try {
            let value = await AsyncStorage.getItem(year.toString())
            value = JSON.parse(value)
            let income,
                outcome,
                food,
                entertainment,
                shopping,
                bills,
                health,
                other,
                savings,
                pieSavings

            for (var i = 1; i < 13; i++) {
                try {
                    data2.datasets[0].data[i - 1] = parseFloat(
                        value[months[i]]['monthIncome'].toFixed(2)
                    )
                    data2.datasets[1].data[i - 1] = parseFloat(
                        value[months[i]]['monthOutcome'].toFixed(2)
                    )
                } catch (error) {
                    //when month doesnt exist in asyncstorage, but there is no problem generally
                    data2.datasets[0].data[i - 1] = 0
                    data2.datasets[1].data[i - 1] = 0
                }
            }

            //console.log('=====Month is=======: ',month)
            if (month !== 'All Months') {
                income = parseFloat(value[month]['monthIncome'].toFixed(2))
                outcome = parseFloat(value[month]['monthOutcome'].toFixed(2))
                food = parseFloat(value[month]['monthFood'].toFixed(2))
                entertainment = parseFloat(
                    value[month]['monthEntertainment'].toFixed(2)
                )
                shopping = parseFloat(value[month]['monthShopping'].toFixed(2))
                bills = parseFloat(value[month]['monthBills'].toFixed(2))
                health = parseFloat(value[month]['monthHealth'].toFixed(2))
                other = parseFloat(value[month]['monthOther'].toFixed(2))
                savings = income - outcome
                pieSavings = parseFloat((income - outcome).toFixed(2))
            } else {
                income = parseFloat(value['yearIncome'].toFixed(2))
                outcome = parseFloat(value['yearOutcome'].toFixed(2))
                food = parseFloat(value['yearFood'].toFixed(2))
                entertainment = parseFloat(
                    value['yearEntertainment'].toFixed(2)
                )
                shopping = parseFloat(value['yearShopping'].toFixed(2))
                bills = parseFloat(value['yearBills'].toFixed(2))
                health = parseFloat(value['yearHealth'].toFixed(2))
                other = parseFloat(value['yearOther'].toFixed(2))
                savings = income - outcome
                pieSavings = parseFloat((income - outcome).toFixed(2))
            }

            if (pieSavings < 0) {
                //piechart bugs with negative values
                pieSavings = 0
            }
            data = [
                {
                    name: 'Food',
                    population: food,
                    color: 'orange',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 13,
                },
                {
                    name: 'Bills',
                    population: bills,
                    color: 'yellow',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 13,
                },
                {
                    name: 'Health',
                    population: health,
                    color: 'pink',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 13,
                },
                {
                    name: 'Entertainment',
                    population: entertainment,
                    color: 'cyan',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 13,
                },
                {
                    name: 'Shopping',
                    population: shopping,
                    color: 'purple',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 13,
                },
                {
                    name: 'Other',
                    population: other,
                    color: 'red',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 13,
                },
                {
                    name: 'Savings',
                    population: pieSavings,
                    color: 'green',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 13,
                },
            ]

            if (month !== 'All Months') {
                this.setState({
                    label: 'Month',
                    totalIncome: income,
                    totalOutcome: outcome,
                    totalSavings: savings,
                })
            } else {
                this.setState({
                    label: 'Year',
                    totalIncome: income,
                    totalOutcome: outcome,
                    totalSavings: savings,
                })
            }
        } catch (error) {
            data = []

            if (month !== 'All Months') {
                this.setState({
                    label: 'Month',
                    totalIncome: 0,
                    totalOutcome: 0,
                    totalSavings: 0,
                })
            } else {
                this.setState({
                    label: 'Year',
                    totalIncome: 0,
                    totalOutcome: 0,
                    totalSavings: 0,
                })
            }
            //console.log("getValuesfromasyncstorage(graphsscreen): error",error)
        }
    }

    getIdealTextString = () => {
        if (this.state.totalSavings > 0) {
            return (
                <Text style={{ fontSize: 15, marginLeft: 13, color: 'green' }}>
                    You saved {this.state.totalSavings.toFixed(2)}
                </Text>
            )
        } else if (this.state.totalSavings < 0) {
            return (
                <Text style={{ fontSize: 15, marginLeft: 13, color: 'red' }}>
                    You spent {this.state.totalSavings.toFixed(2) * -1} more
                    than you earned!{' '}
                </Text>
            )
        } else if (this.state.totalSavings === 0) {
            return (
                <Text style={{ fontSize: 15, marginLeft: 13, color: 'gray' }}>
                    You didn't save any amount...{' '}
                </Text>
            )
        }
    }

    getIdealIcon = () => {
        if (this.state.totalSavings > 0) {
            return 'md-checkmark'
        } else if (this.state.totalSavings < 0) {
            return 'md-close'
        } else if (this.state.totalSavings === 0) {
            return 'md-remove'
        }
    }

    getIdealIconColor = () => {
        if (this.state.totalSavings > 0) {
            return 'green'
        } else if (this.state.totalSavings < 0) {
            return 'red'
        } else if (this.state.totalSavings === 0) {
            return 'gray'
        }
    }

    showNotEnoughDataText = () => {
        if (this.state.totalOutcome === 0) {
            return (
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            marginTop: 20,
                            marginBottom: 20,
                        }}
                    >
                        There is not enough data to display a Pie Graph!
                    </Text>
                </View>
            )
        } else {
            return (
                <PieChart
                    data={data}
                    width={350}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="-5"
                    absolute
                />
            )
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MonthYearHeader
                    monthSelectedValue={month}
                    monthOnValueChange={(itemValue, itemIndex) => {
                        month = itemValue
                        this.getMonthValuesFromAsyncStorage()
                    }}
                    yearSelectedValue={year}
                    yearOnValueChange={(itemValue, itemIndex) => {
                        year = itemValue
                        this.getMonthValuesFromAsyncStorage()
                    }}
                />
                <ScrollView>
                    <View style={styles.ViewStyle}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 10,
                                borderWidth: 0.5,
                                borderColor: 'gray',
                                margin: 5,
                                marginTop: 10,
                                elevation: 4,
                                flexDirection: 'column',
                            }}
                        >
                            <Text
                                textDecorationLine="underline"
                                style={{
                                    fontSize: 25,
                                    marginLeft: 10,
                                    color: '#3949ab',
                                }}
                            >
                                This {this.state.label}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    marginLeft: 10,
                                }}
                            >
                                <Icon
                                    name="return-right"
                                    color="green"
                                    size={20}
                                    style={{ paddingLeft: 15 }}
                                />
                                <Text style={{ fontSize: 15, marginLeft: 10 }}>
                                    You earned{' '}
                                    {this.state.totalIncome.toFixed(2)}{' '}
                                </Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', marginLeft: 10 }}
                            >
                                <Icon
                                    name="return-left"
                                    color="red"
                                    size={20}
                                    style={{ paddingLeft: 15 }}
                                />
                                <Text style={{ fontSize: 15, marginLeft: 10 }}>
                                    You spent{' '}
                                    {this.state.totalOutcome.toFixed(2)}{' '}
                                </Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', marginLeft: 10 }}
                            >
                                <Icon
                                    name={this.getIdealIcon()}
                                    color={this.getIdealIconColor()}
                                    size={22}
                                    style={{
                                        paddingLeft: 15,
                                        marginBottom: 15,
                                    }}
                                />
                                {/*<Text style={{fontSize:15,marginLeft:10}}>You saved {this.state.totalSavings} </Text>   */}
                                {this.getIdealTextString()}
                            </View>
                        </View>
                        <View
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 10,
                                borderWidth: 0.5,
                                borderColor: 'gray',
                                margin: 5,
                                elevation: 4,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    marginLeft: 10,
                                    color: '#3949ab',
                                }}
                            >
                                {this.state.label}ly Outcome Analysis
                            </Text>
                            {this.showNotEnoughDataText()}
                        </View>
                        <View
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 10,
                                borderWidth: 0.5,
                                borderColor: 'gray',
                                margin: 5,
                                elevation: 4,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    marginLeft: 10,
                                    marginBottom: 10,
                                    color: '#3949ab',
                                }}
                            >
                                Annual Economy Overview
                            </Text>
                            <ScrollView horizontal={true} style={{ margin: 3 }}>
                                <LineChart
                                    data={data2}
                                    width={650}
                                    height={220}
                                    chartConfig={chartConfig2}
                                />
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

GraphsScreen.navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon
            name="md-pie"
            size={28}
            color={tintColor}
            inactiveTintColor="black"
        />
    ),
}

const styles = {
    ViewStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    MonthYearViewStyle: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    MonthYearTextStyle: {
        fontSize: 18,
        color: '#3949ab',
    },
}

export default GraphsScreen
