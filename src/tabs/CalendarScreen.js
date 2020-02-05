import React from 'react'
import {
    BackHandler,
    ToastAndroid,
    StatusBar,
    View,
    AppState,
    Dimensions,
} from 'react-native'
import Icon from 'react-native-ionicons'
import { CalendarList } from 'react-native-calendars'
import AsyncStorage from '@react-native-community/async-storage'
import TouchID from 'react-native-touch-id'
import IconButton from './IconButton'

class CalendarScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            markedDays: { '2011-04-30': { dots: [{}, {}] } },
            appState: AppState.currentState,
        }

        this.reRenderMarks = this.props.navigation.addListener(
            //trick to put dots on backpress
            'willFocus',
            () => {
                this.getMarkedDaysFromAsyncStorage()
            }
        )
    }

    componentWillUnmount() {
        this.reRenderMarks
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    componentWillMount() {
        this.authenticateWithFingerprint()
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange = nextAppState => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            this.authenticateWithFingerprint()
        }
        this.setState({ appState: nextAppState })
    }

    authenticateWithFingerprint() {
        const fingerprintModal = {
            title: 'Authentication Required',
            imageColor: '#e00606',
            imageErrorColor: '#ff0000',
            sensorDescription: 'Touch sensor to get access',
            sensorErrorDescription: 'Failed',
            cancelText: '',
            unifiedErrors: true,
            passcodeFallback: true,
        }

        TouchID.authenticate('', fingerprintModal)
            .then(success => {
                ToastAndroid.show(
                    'Fingerprint Authenticated',
                    ToastAndroid.SHORT
                )
            })
            .catch(error => {
                this.handleUnlockError(error.code)
            })
    }

    handleUnlockError = errorMsg => {
        switch (errorMsg) {
            case 'NOT_ENROLLED':
            case 'NOT_AVAILABLE':
            case 'NOT_SUPPORTED':
                break
            case 'USER_CANCELED':
                BackHandler.exitApp()
                break
            case 'AUTHENTICATION_FAILED':
                //console.log('authentication failed')
                break
        }
    }

    getMarkedDaysFromAsyncStorage = async () => {
        try {
            let markedDaysJSONString = await AsyncStorage.getItem('markedDays')
            if (markedDaysJSONString !== null) {
                markedDaysJSONString = JSON.parse(markedDaysJSONString)
                this.setState({
                    markedDays: markedDaysJSONString,
                })
            }
        } catch (error) {
            //console.log('getMarkedDays:  error')
        }
    }

    /*  onDaySelect = day => {
        console.log('ondayselectttttttt')
        const selectedDay = day.dateString
        let marked = true
        if (this.state.markedDays[selectedDay]) {
            // Already in marked dates, so reverse current marked state
            marked = !this.state.markedDays[selectedDay].marked
        }
        const updatedMarkedDays = {
            ...this.state.markedDays,
            ...{ [selectedDay]: { marked: marked } },
        }
        // Triggers component to render again, picking up the new state
        this.setState({ markedDays: updatedMarkedDays })
    } */

    render() {
        const { navigate } = this.props.navigation
        return (
            <View>
                <StatusBar backgroundColor={'white'} barStyle="dark-content" />
                <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                >
                    <IconButton
                        name="settings"
                        color="gray"
                        size={35}
                        style={styles.SettingsButtonStyle}
                    />
                </View>

                <CalendarList
                    onDayPress={dateJSON => {
                        navigate('InputScreen', { dateJSON: dateJSON })
                    }}
                    markingType={'multi-dot'}
                    markedDates={this.state.markedDays}
                    minDate={'2019-01-01'}
                    horizontal={true}
                    pagingEnabled={true}
                    hideArrows={false}
                    firstDay={1}
                    hideExtraDays={true}
                    markingType={'multi-dot'}
                    style={styles.calendarListStyles}
                    theme={styles.calendarListTheme}
                />
            </View>
        )
    }
}

CalendarScreen.navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon
            name="calendar"
            size={28}
            color={tintColor}
            inactiveTintColor="black"
        />
    ),
}

const styles = {
    SettingsButtonStyle: {
        paddingTop: '2%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '1%',
    },
    calendarListStyles: {
        height: Dimensions.get('window').height,
    },
    calendarListTheme: {
        arrowColor: 'gray',
        dayTextColor: 'gray',
        textDayFontSize: 20,
        textSectionTitleColor: '#3949ab',
        todayTextColor: '#3949ab',
        'stylesheet.day.basic': {
            base: {
                width: 30,
                height: 200,
            },
        },
        'stylesheet.calendar.header': {
            monthText: {
                //paddingTop:40,
                paddingBottom: 20,
                fontSize: 25,
                color: '#3949ab',
            },
            arrow: {
                paddingTop: 30,
            },
        },
    },
}

export default CalendarScreen
