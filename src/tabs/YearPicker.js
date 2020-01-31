import React from 'react';
import {View,  Picker } from 'react-native';


class YearPicker extends React.Component{

    render(){
        return(
            <View>
                <Picker
                        selectedValue={this.props.selectedValue}
                        mode='dropdown'
                        style={{height: 50, width: 120, marginTop:3, color:"#3949ab"}}
                        onValueChange={this.props.onValueChange}>
                        <Picker.Item label="2019" value={2019} />
                        <Picker.Item label="2020" value={2020} />
                        <Picker.Item label="2021" value={2021} />
                        <Picker.Item label="2022" value={2022} />
                        <Picker.Item label="2023" value={2023} />
                        <Picker.Item label="2024" value={2024} />
                        <Picker.Item label="2025" value={2025} />
        

                </Picker>
            </View>
        )
    }
}

export default YearPicker;