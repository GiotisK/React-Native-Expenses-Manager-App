import React from 'react'
import { Text, View } from 'react-native'

class BalanceSheetScreen extends React.Component {
    render() {
        return (
            <View style={styles.ViewStyle}>
                <Text>BalanceSheet!</Text>
            </View>
        )
    }
}

const styles = {
    ViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}

export default BalanceSheetScreen
