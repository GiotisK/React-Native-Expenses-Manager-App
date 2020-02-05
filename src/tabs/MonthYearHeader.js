import React from 'react'
import { View } from 'react-native'
import MonthPicker from './MonthPicker'
import YearPicker from './YearPicker'

class MonthYearHeader extends React.Component {
    render() {
        return (
            <View style={styles.headerStyle}>
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

const styles = {
    headerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 0.5,
    },
}

export default MonthYearHeader
