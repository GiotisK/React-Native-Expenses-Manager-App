import React from 'react';
import {View, Picker } from 'react-native';


class MonthPicker extends React.Component{

    render(){
        return(
            <View>
                <Picker
                        selectedValue={this.props.selectedValue}
                        mode='dropdown'
                        style={{height: 50, width: 120, marginTop:3, color:'black'}}
                        onValueChange={this.props.onValueChange}>
                        <Picker.Item label="All Months" value="All Months" />
                        <Picker.Item label="Jan." value="January" />
                        <Picker.Item label="Feb." value="February" />
                        <Picker.Item label="Mar." value="March" />
                        <Picker.Item label="Apr." value="April" />
                        <Picker.Item label="May" value="May" />
                        <Picker.Item label="June" value="June" />
                        <Picker.Item label="July" value="July"/>
                        <Picker.Item label="Aug." value="August"/>
                        <Picker.Item label="Sept." value="September"/>
                        <Picker.Item label="Oct." value="October"/>
                        <Picker.Item label="Nov." value="Novemeber"/>
                        <Picker.Item label="Dec." value="December"/>

                </Picker>
            </View>
        )
    }
}

export default MonthPicker;