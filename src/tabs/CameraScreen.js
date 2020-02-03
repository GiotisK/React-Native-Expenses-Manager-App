import React from 'react'
import {
    StyleSheet,
    View,
    PermissionsAndroid,
    CameraRoll,
    BackHandler,
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import IconButton from './IconButton'
import Icon from 'react-native-ionicons'
import AsyncStorage from '@react-native-community/async-storage'

const datestring = ''
let month
let year
let day
let titleString
let numOfPhotos = 0
class CameraScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            flag: true,
            flashMode_: RNCamera.Constants.FlashMode.on,
            flashIconName: 'flash',
        }
    }

    static navigationOptions = ({ navigation }) => {
        dateString = navigation.getParam('day')
        month = months[dateString.month]
        year = dateString.year
        day = dateString.day
        titleString = day + ' ' + month + ' ' + year
        return {
            title: titleString,
            headerTintColor: '#3949ab',

            headerTitleStyle: {
                fontWeight: 'normal',
                display: 'flex',
                flex: 1,
                textAlign: 'center',
            },
            headerLeft: (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <IconButton
                        onPress={navigation.getParam(
                            '_onBackButtonPressAndroid'
                        )}
                        style={{ marginLeft: 19 }}
                        name="arrow-back"
                        size={24}
                        color="#3949ab"
                    />
                </View>
            ),
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.onBackButtonPressAndroid
        )
    }

    componentDidMount() {
        this.props.navigation.setParams({
            _onBackButtonPressAndroid: this.onBackButtonPressAndroid,
        })
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.onBackButtonPressAndroid
        )
        numOfPhotos = 0
    }

    pushPhotoToAsyncStorage = async photoUri => {
        try {
            let value = await AsyncStorage.getItem(year.toString())
            value = JSON.parse(value)
            value[month][day.toString()]['photos'].push({ url: photoUri })
            await AsyncStorage.setItem(year.toString(), JSON.stringify(value))
        } catch (error) {
            //console.log("pushPhotoToAsyncStorage: error")
        }
    }

    onBackButtonPressAndroid = () => {
        let num = numOfPhotos
        //console.log("numof",numOfPhotos)
        this.props.navigation.navigate('Second', { num })
        return true
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref
                    }}
                    style={styles.preview}
                    orientation="portrait"
                    type={RNCamera.Constants.Type.back}
                    flashMode={this.state.flashMode_}
                    captureAudio={false}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={
                        'We need your permission to use your phone camera '
                    }
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        //console.log(barcodes);
                    }}
                />
                <View
                    style={{
                        flex: 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Icon
                        size={40}
                        name={this.state.flashIconName}
                        color="rgba(52, 52, 52, 0)"
                    />
                    <IconButton
                        onPress={this.takePicture.bind(this)}
                        style={{}}
                        name="camera"
                        size={40}
                        color="white"
                    />
                    <IconButton
                        onPress={() => {
                            if (this.state.flag) {
                                this.setState({
                                    flashMode_:
                                        RNCamera.Constants.FlashMode.off,
                                    flashIconName: 'flash-off',
                                    flag: !this.state.flag,
                                })
                            } else {
                                this.setState({
                                    flashMode_: RNCamera.Constants.FlashMode.on,
                                    flashIconName: 'flash',
                                    flag: !this.state.flag,
                                })
                            }
                        }}
                        style={{}}
                        name={this.state.flashIconName}
                        size={40}
                        color="white"
                    />
                </View>
            </View>
        )
    }

    takePicture = async function() {
        numOfPhotos += 1
        var RNFS = require('react-native-fs')
        let testpath = 'file://' + RNFS.ExternalStorageDirectoryPath + '/DCIM/'
        if (this.camera) {
            const options = {
                quality: 0.5,
                base64: false,
                fixOrientation: true,
            }

            try {
                const writePermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                )
                if (writePermission === PermissionsAndroid.RESULTS.GRANTED) {
                    const data = await this.camera.takePictureAsync(options)

                    let uriArray = data.uri.split('/')
                    let nameToChange = uriArray[uriArray.length - 1]

                    CameraRoll.saveToCameraRoll(data.uri).then(() => {
                        RNFS.unlink(data.uri)
                    })
                    this.pushPhotoToAsyncStorage(testpath + '' + nameToChange)
                } else {
                    console.log('Camera permission denied')
                }
            } catch (err) {
                console.warn(err)
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
})

export default CameraScreen
