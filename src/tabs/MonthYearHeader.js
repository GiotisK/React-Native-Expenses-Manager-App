
import React from 'react';
import { Text, View } from 'react-native';
import MonthPicker from './MonthPicker';
import YearPicker from './YearPicker';

class MonthYearHeader extends React.Component {
    render(){
        return(
                
            <View style = {{flexDirection: 'row',justifyContent:'space-around', borderBottomWidth:0.5,}}>

                <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Text style = {styles.MonthYearTextStyle}>Month:</Text>
                    <MonthPicker 
                    selectedValue={this.props.monthSelectedValue}
                    onValueChange = {this.props.monthOnValueChange}
                    />
                </View>

                <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Text style = {styles.MonthYearTextStyle}>Year:</Text>
                    <YearPicker 
                        selectedValue={this.props.yearSelectedValue}
                        onValueChange = {this.props.yearOnValueChange}
                    />
                </View>
                
            </View>
    
        );
    }
}

const styles = {

    MonthYearTextStyle:{
      fontSize: 18,
      color: "#3949ab",
    }
}

export default MonthYearHeader;  