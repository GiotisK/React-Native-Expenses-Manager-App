import React from 'react'
import {
    StyleSheet,
    View,
    PermissionsAndroid,
    CameraRoll,
    BackHandler,
    ToastAndroid,
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import IconButton from './IconButton'
import Icon from 'react-native-ionicons'
import AsyncStorage from '@react-native-community/async-storage'

let month
let year
let day
let numOfPhotos = 0
class CameraScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            flashIsActive: true,
            flashMode_: RNCamera.Constants.FlashMode.on,
            flashIconName: 'flash',
        }
    }

    static navigationOptions = ({ navigation }) => {
        dateJSON = navigation.getParam('dateJSON')
        month = months[dateJSON.month]
        year = dateJSON.year
        day = dateJSON.day

        return {
            title: day + ' ' + month + ' ' + year,
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
        this.removeBackListener()
    }

    componentDidMount() {
        this.props.navigation.setParams({
            _onBackButtonPressAndroid: this.onBackButtonPressAndroid,
        })
        this.addBackListener()
        numOfPhotos = 0
    }

    addBackListener() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.onBackButtonPressAndroid
        )
    }

    removeBackListener() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.onBackButtonPressAndroid
        )
    }

    onBackButtonPressAndroid = () => {
        this.props.navigation.navigate('InputScreen', { numOfPhotos })
        return true
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

    handleFlash = () => {
        if (this.state.flashIsActive) {
            this.turnOffFlash()
        } else {
            this.turnOnFlash()
        }
    }

    turnOnFlash = () => {
        this.setState({
            flashMode_: RNCamera.Constants.FlashMode.on,
            flashIconName: 'flash',
            flashIsActive: true,
        })
    }

    turnOffFlash = () => {
        this.setState({
            flashMode_: RNCamera.Constants.FlashMode.off,
            flashIconName: 'flash-off',
            flashIsActive: false,
        })
    }

    getWritePermissions = async () => {
        const writePermissionAnswer = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        if (writePermissionAnswer === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        }
        return false
    }

    savePhoto = photoData => {
        var RNFS = require('react-native-fs')
        let savePath = 'file://' + RNFS.ExternalStorageDirectoryPath + '/DCIM/'
        let uriArray = photoData.uri.split('/')
        let defaultPhotoName = uriArray[uriArray.length - 1]

        CameraRoll.saveToCameraRoll(photoData.uri).then(() => {
            RNFS.unlink(photoData.uri)
        })
        this.pushPhotoToAsyncStorage(savePath + defaultPhotoName)
        numOfPhotos += 1
        ToastAndroid.show(`Photo saved to ${savePath}`, ToastAndroid.LONG)
    }

    takePicture = async () => {
        const cameraOptions = {
            quality: 0.5,
            base64: false,
            fixOrientation: true,
        }
        try {
            if (this.camera) {
                try {
                    if (await this.getWritePermissions()) {
                        const photoData = await this.camera.takePictureAsync(
                            cameraOptions
                        )
                        this.savePhoto(photoData)
                    } else {
                        ToastAndroid.show(
                            'Camera permission denied',
                            ToastAndroid.LONG
                        )
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref
                    }}
                    style={styles.cameraView}
                    orientation="portrait"
                    type={RNCamera.Constants.Type.back}
                    flashMode={this.state.flashMode_}
                    captureAudio={false}
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
                        onPress={this.takePicture}
                        style={{}}
                        name="camera"
                        size={40}
                        color="white"
                    />
                    <IconButton
                        onPress={this.handleFlash}
                        style={{}}
                        name={this.state.flashIconName}
                        size={40}
                        color="white"
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    cameraView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
})

export default CameraScreen
