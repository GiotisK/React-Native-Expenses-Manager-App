import React from 'react';
import {TextInput, Text,View, TouchableOpacity, Picker } from 'react-native';
import Icon from 'react-native-ionicons'
import IconButton from './IconButton'




class InputComponent extends React.Component{

    render(){
        //const {navigate} = this.props.navigation;
        const picker = <Picker
        selectedValue={this.props.selectedValue}
        mode='dropdown'
        placeholderTextColor = 'white'
        style = {this.props.pickerStyle}
        onValueChange={this.props.onValueChange}>
        <Picker.Item label="Category.." value="Other" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Bills" value="Bills" />
        <Picker.Item label="Health" value="Health" />
        <Picker.Item label="Entertainment" value="Entertainment" />
        <Picker.Item label="Shopping" value="Shopping" />
        <Picker.Item label="Other" value="Other"/>
        </Picker>

        return(
            <View style={{flexDirection:'row',justifyContent:'flex-end',margin:3,borderRadius:5,backgroundColor: this.props.color}}> 
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                    <TextInput
                        onSubmitEditing={this.props.onSubmitEditingDescription}
                        onChangeText={this.props.onChangeTextDescription}
                        style={{color:'white'}} 
                        placeholder="Description..." 
                        placeholderTextColor='rgba(255,255,255, 0.5)' 
                        value={this.props.descriptionValue}
                        underlineColorAndroid='white'  
                        maxLength={18}                        
                        //autoCapitalize={'sentences'}
                    />
                    <TextInput 
                        onSubmitEditing={this.props.onSubmitEditingAmount}
                        onEndEditing={this.props.onEndEditingAmount}
                        onChangeText={this.props.onChangeTextAmount}
                        style={{color:'white'}} 
                        keyboardType={"numeric"}                   
                        placeholder="Amount..." 
                        placeholderTextColor='rgba(255,255,255, 0.5)' 
                        value={this.props.amountValue}
                        underlineColorAndroid='white'  
                        maxLength={8} 
                        autoCapitalize= 'words' //CURRENTLY BUGGED. ONLY WITH 'WORDS' PUNCTUATION IS ENABLED ON ANDROID
                    />
                    {this.props.isIncome ?  null : picker}
                </View>              
                <IconButton onPress={this.props.onPressRemove} style = {styless.buttonStyle} name = "close-circle-outline" size = {25} color="white"/>
            </View> 
        )
    }
}

styless={
    buttonStyle:{
        marginTop:13,
        marginRight:5
    }
}

export default InputComponent;