import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-ionicons'

class IconButton extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={this.props.touchableStyle}
            >
                <Icon
                    style={this.props.style}
                    name={this.props.name}
                    size={this.props.size}
                    color={this.props.color}
                />
            </TouchableOpacity>
        )
    }
}

export default IconButton
