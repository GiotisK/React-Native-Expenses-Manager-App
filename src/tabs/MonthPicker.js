import React from 'react'
import { View, Picker } from 'react-native'

class MonthPicker extends React.Component {
    render() {
        return (
            <View>
                <Picker
                    selectedValue={this.props.selectedValue}
                    mode="dropdown"
                    style={{
                        height: 50,
                        width: 150,
                        marginTop: 3,
                        color: '#3949ab',
                    }}
                    onValueChange={this.props.onValueChange}
                >
                    <Picker.Item label="All Months" value="All Months" />
                    <Picker.Item label="January" value="Jan." />
                    <Picker.Item label="February" value="Febr." />
                    <Picker.Item label="March" value="March" />
                    <Picker.Item label="April" value="April" />
                    <Picker.Item label="May" value="May" />
                    <Picker.Item label="June" value="June" />
                    <Picker.Item label="July" value="July" />
                    <Picker.Item label="August" value="Aug." />
                    <Picker.Item label="September" value="Sep." />
                    <Picker.Item label="October" value="Oct." />
                    <Picker.Item label="November" value="Nov." />
                    <Picker.Item label="December" value="Dec." />
                </Picker>
            </View>
        )
    }
}

export default MonthPicker
