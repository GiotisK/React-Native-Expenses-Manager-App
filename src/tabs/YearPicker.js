import React from 'react'
import { View, Picker } from 'react-native'

const yearValues = [2019, 2020, 2021, 2022, 2023, 2024, 2025]
let key = 0

class YearPicker extends React.Component {
    render() {
        return (
            <View>
                <Picker
                    selectedValue={this.props.selectedValue}
                    mode="dropdown"
                    style={styles.pickerStyle}
                    onValueChange={this.props.onValueChange}
                >
                    {yearValues.map(yearValue => {
                        return (
                            <Picker.Item
                                key={key++}
                                label={yearValue.toString()}
                                value={yearValue}
                            />
                        )
                    })}
                </Picker>
            </View>
        )
    }
}

const styles = {
    pickerStyle: {
        height: 50,
        width: 120,
        marginTop: 3,
        color: '#3949ab',
    },
}

export default YearPicker
