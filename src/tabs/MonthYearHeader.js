import React from 'react'
import { Text, View } from 'react-native'
import MonthPicker from './MonthPicker'
import YearPicker from './YearPicker'

class MonthYearHeader extends React.Component {
    render() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    borderBottomWidth: 0.5,
                }}
            >
                <MonthPicker
                    selectedValue={this.props.monthSelectedValue}
                    onValueChange={this.props.monthOnValueChange}
                />
                <YearPicker
                    selectedValue={this.props.yearSelectedValue}
                    onValueChange={this.props.yearOnValueChange}
                />
            </View>
        )
    }
}

export default MonthYearHeader
