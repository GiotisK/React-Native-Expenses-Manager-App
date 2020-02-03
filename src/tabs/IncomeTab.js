import React from 'react'
import { Text, View, Dimensions, TouchableOpacity } from 'react-native'
import Table from 'react-native-simple-table'
import AsyncStorage from '@react-native-community/async-storage'
import MonthYearHeader from './MonthYearHeader'
import Icon from 'react-native-ionicons'

let columns = []
let width = Dimensions.get('window').width
let incomeColumns = [
    {
        title: 'Description',
        dataIndex: 'description',
        width: width / 2,
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        width: width / 2,
    },
]

const outcomeColumns = [
    {
        title: 'Description',
        dataIndex: 'description',
        width: width / 3,
    },
    {
        title: 'Category',
        dataIndex: 'category',
        width: width / 3,
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        width: width / 3,
    },
]

let incomeArr = []
let outcomeArr = []
let rightTextSize = 16
let leftTextSize = 18
let rightOpacity = 0.7
let leftOpacity = 1
let month
let year
let allMonthsIncome = 0
let allMonthsOutcome = 0

class IncomeTab extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                month = months[new Date().getMonth() + 1]
                year = new Date().getFullYear()
                this.getRowsFromAsyncStorage()
            }
        )
    }

    fillArrays(param, value, totalIncome, totalOutcome) {
        const dayKeys = Object.keys(value[param])
        for (const day of dayKeys) {
            //iterates all days of a month

            if (!isNaN(day)) {
                //if key is a number, and not 'dayincome' etc..

                for (var i in value[param][day]['data']) {
                    const row = value[param][day]['data'][i]

                    if (row.category === '' && row.amount != '') {
                        if (row.description == '') {
                            incomeArr.push({
                                description: 'No description',
                                amount: row.amount,
                            })
                        } else {
                            incomeArr.push({
                                description: row.description,
                                amount: row.amount,
                            })
                        }
                        totalIncome += parseFloat(row.amount)
                    } else if (row.category !== '' && row.amount != '') {
                        if (row.description == '') {
                            outcomeArr.push({
                                description: 'No description',
                                category: row.category,
                                amount: row.amount,
                            })
                        } else {
                            outcomeArr.push({
                                description: row.description,
                                category: row.category,
                                amount: row.amount,
                            })
                        }
                        totalOutcome += parseFloat(row.amount)
                    }
                }
            }
        }
        allMonthsIncome += totalIncome
        allMonthsOutcome += totalOutcome
        if (totalOutcome > 0 && month !== 'All Months') {
            outcomeArr.push({
                description: 'Total Amount',
                category: ' ',
                amount: totalOutcome,
            })
        }
        if (totalIncome > 0 && month !== 'All Months') {
            incomeArr.push({ description: 'Total Amount', amount: totalIncome })
        }
    }

    getRowsFromAsyncStorage = async () => {
        try {
            let value = await AsyncStorage.getItem(year.toString())
            value = JSON.parse(value)

            incomeArr = []
            outcomeArr = []
            let totalIncome = 0
            let totalOutcome = 0
            allMonthsIncome = 0
            allMonthsOutcome = 0

            if (month != 'All Months') {
                this.fillArrays(month, value, totalIncome, totalOutcome)
            } else {
                const monthKeys = Object.keys(value)

                for (const monthKey of monthKeys) {
                    if (
                        monthKey != 'yearIncome' &&
                        monthKey != 'yearOutcome' &&
                        monthKey != 'yearFood' &&
                        monthKey != 'yearEntertainment' &&
                        monthKey != 'yearShopping' &&
                        monthKey != 'yearBills' &&
                        monthKey != 'yearHealth' &&
                        monthKey != 'yearOther'
                    ) {
                        //console.log(monthKey)
                        this.fillArrays(
                            monthKey,
                            value,
                            totalIncome,
                            totalOutcome
                        )
                    }
                }
                outcomeArr.push({
                    description: 'Total Amount',
                    category: ' ',
                    amount: allMonthsOutcome,
                })
                incomeArr.push({
                    description: 'Total Amount',
                    amount: allMonthsIncome,
                })
            }

            leftTextSize = 18
            rightTextSize = 16
            leftOpacity = 1
            rightOpacity = 0.7

            columns = incomeColumns

            this.setState({
                data: incomeArr,
            })
        } catch (error) {
            //in case there are no values for a specific month/year in async storage
            this.setState({
                data: [],
            })
        }
    }

    render() {
        const notEnoughData = (
            <Text style={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}>
                There is not enough data to display a table!
            </Text>
        )
        return (
            <View>
                <MonthYearHeader
                    monthSelectedValue={month}
                    monthOnValueChange={(itemValue, itemIndex) => {
                        month = itemValue
                        this.getRowsFromAsyncStorage()
                    }}
                    yearSelectedValue={year}
                    yearOnValueChange={(itemValue, itemIndex) => {
                        year = itemValue
                        this.getRowsFromAsyncStorage()
                    }}
                />
                <View style={styles.container}>
                    <View
                        style={{
                            backgroundColor: '#009688',
                            borderWidth: 1.2,
                            opacity: leftOpacity,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRadius: 10,
                            borderColor: 'gray',
                        }}
                    >
                        <TouchableOpacity
                            // style={styles.button}
                            onPress={() => {
                                leftTextSize = 18
                                rightTextSize = 16
                                leftOpacity = 1
                                rightOpacity = 0.7
                                columns = incomeColumns

                                this.setState({ data: incomeArr })
                            }}
                        >
                            <Text
                                style={{
                                    margin: 2,
                                    fontSize: leftTextSize,
                                    color: 'white',
                                }}
                            >
                                {' '}
                                Income{' '}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            backgroundColor: '#ff6666',
                            opacity: rightOpacity,
                            borderWidth: 1.2,
                            borderTopLeftRadius: 0,
                            opacity: rightOpacity,
                            borderBottomLeftRadius: 0,
                            borderRadius: 10,
                            borderColor: 'gray',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                rightTextSize = 18
                                leftTextSize = 16
                                rightOpacity = 1
                                leftOpacity = 0.7
                                columns = outcomeColumns

                                this.setState({ data: outcomeArr })
                            }}
                        >
                            <Text
                                style={{
                                    margin: 2,
                                    fontSize: rightTextSize,
                                    color: 'white',
                                }}
                            >
                                {' '}
                                Outcome{' '}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <Table columns={columns} dataSource={this.state.data} />
                    {this.state.data.length == 0 ? notEnoughData : null}
                </View>
            </View>
        )
    }
}

IncomeTab.navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon
            name="paper"
            size={28}
            color={tintColor}
            inactiveTintColor="black"
        />
    ),
}

const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 0.5,
    },
}

export default IncomeTab
