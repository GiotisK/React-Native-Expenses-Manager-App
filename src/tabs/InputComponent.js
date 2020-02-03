import React from 'react'
import { TextInput, View, Picker } from 'react-native'
import IconButton from './IconButton'

const outcomeCategoryLabelsAndValues = [
    { label: 'Category..', value: 'Other' },
    { label: 'Food', value: 'Food' },
    { label: 'Bills', value: 'Bills' },
    { label: 'Health', value: 'Health' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Other', value: 'Other' },
]
let key = 0
class InputComponent extends React.Component {
    render() {
        const outcomeCategoryPicker = (
            <Picker
                selectedValue={this.props.selectedValue}
                mode="dropdown"
                placeholderTextColor="white"
                style={styles.pickerStyle}
                onValueChange={this.props.onValueChange}
            >
                {outcomeCategoryLabelsAndValues.map(categoryObject => {
                    return (
                        <Picker.Item
                            key={key++}
                            label={categoryObject.label}
                            value={categoryObject.value}
                        />
                    )
                })}
            </Picker>
        )

        return (
            <View
                style={[
                    styles.outerContainer,
                    { backgroundColor: this.props.color },
                ]}
            >
                <View style={styles.textInputsContainer}>
                    <TextInput
                        onSubmitEditing={this.props.onSubmitEditingDescription}
                        onChangeText={this.props.onChangeTextDescription}
                        style={{ color: 'white' }}
                        placeholder="Description..."
                        placeholderTextColor="rgba(255,255,255, 0.5)"
                        value={this.props.descriptionValue}
                        underlineColorAndroid="white"
                        maxLength={18}
                    />
                    <TextInput
                        onSubmitEditing={this.props.onSubmitEditingAmount}
                        onEndEditing={this.props.onEndEditingAmount}
                        onChangeText={this.props.onChangeTextAmount}
                        style={{ color: 'white' }}
                        keyboardType={'numeric'}
                        placeholder="Amount..."
                        placeholderTextColor="rgba(255,255,255, 0.5)"
                        value={this.props.amountValue}
                        underlineColorAndroid="white"
                        maxLength={8}
                        autoCapitalize="words" //CURRENTLY BUGGED. ONLY WITH 'WORDS' PUNCTUATION IS ENABLED ON ANDROID
                    />
                    {this.props.isIncome ? null : outcomeCategoryPicker}
                </View>
                <IconButton
                    onPress={this.props.onPressRemove}
                    style={styles.buttonStyle}
                    name="close-circle-outline"
                    size={25}
                    color="white"
                />
            </View>
        )
    }
}

const styles = {
    pickerStyle: {
        height: 50,
        width: 120,
        color: 'white',
    },
    outerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 3,
        borderRadius: 5,
    },
    textInputsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    buttonStyle: {
        marginTop: 13,
        marginRight: 5,
    },
}

export default InputComponent
