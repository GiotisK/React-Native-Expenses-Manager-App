import React from 'react'
import { View, Picker } from 'react-native'

const monthLabelsAndValues = [
    { label: 'All Months', value: 'All Months' },
    { label: 'January', value: 'Jan.' },
    { label: 'February', value: 'Febr.' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'Aug.' },
    { label: 'September', value: 'Sep.' },
    { label: 'October', value: 'Oct.' },
    { label: 'November', value: 'Nov.' },
    { label: 'December', value: 'Dec.' },
]
let key = 0

class MonthPicker extends React.Component {
    render() {
        return (
            <View>
                <Picker
                    selectedValue={this.props.selectedValue}
                    mode="dropdown"
                    style={styles.pickerStyle}
                    onValueChange={this.props.onValueChange}
                >
                    {monthLabelsAndValues.map(pickerObject => {
                        return (
                            <Picker.Item
                                key={key++}
                                label={pickerObject.label}
                                value={pickerObject.value}
                            />
                        )
                    })}
                </Picker>
            </View>
        )
    }
}

const styles = {
    pickerStyle: { height: 50, width: 150, marginTop: 3, color: '#3949ab' },
}

export default MonthPicker
