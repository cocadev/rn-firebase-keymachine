import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  UIManager,
  Keyboard,
  Alert
} from 'react-native'
import * as firebase from 'firebase'
import db from '../database/firebaseInit'
// @ts-ignore
import { DangerZone } from 'expo'

const { State: TextInputState } = TextInput

const { Lottie } = DangerZone

export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      field: '',
      userName: '',
      userSurname: '',
      passwordToken: '',
      animation: null,
      shift: new Animated.Value(0)
    }
  }

  static navigationOptions = () => {
    return {
      header: () => null
    }
  }
  componentWillMount() {
    this._playAnimation()

    this.keyboardDidShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardDidShow
    )
    this.keyboardDidHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardDidHide
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove()
    this.keyboardDidHideSub.remove()
  }
  _playAnimation = () => {
    if (!this.state.animation) {
      this._loadAnimationAsync()
    } else {
      this.animation.reset()
      this.animation.play()
    }
  }
  onSignupPress = () => {
    if (this.state.password === this.state.passwordConfirm) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          db.collection('users').add({
            email: this.state.email,
            field: this.state.field,
            userName: this.state.userName,
            userSurname: this.state.userSurname,
            passwordToken: this.state.passwordToken,
            units: []
          })
        })
        .catch(function(error) {
          let errorCode = error.code
          if (errorCode == 'auth/weak-password') {
            Alert.alert(
              'UYARI',
              'Girdiğiniz parola en az 6 karakterden oluşmalıdır.',
              [{}, {}, {}],
              { cancelable: true }
            )
          } else {
            Alert.alert(
              'UYARI',
              'Beklenmedik bir hata ile karşılaşıldı.',
              [{}, {}, {}],
              { cancelable: true }
            )
          }
        })
    } else {
      Alert.alert(
        'UYARI',
        'Girilen parolalar birbiri ile uyuşmuyor.',
        [{}, {}, {}],
        { cancelable: true }
      )
    }
  }

  onBackToLoginPress = () => {
    this.props.navigation.goBack()
  }
  render() {
    const { shift } = this.state

    return (
      <View style={stylingClasses.main}>
        <Animated.View
          style={[
            stylingClasses.container,
            { transform: [{ translateY: shift }] }
          ]}>
          <View style={stylingClasses.first}>
            {this.state.animation && (
              <Lottie
                loop={true}
                speed={0.7}
                ref={animation => {
                  this.animation = animation
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#13161E'
                }}
                source={this.state.animation}
              />
            )}
          </View>
          <View style={stylingClasses.second}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                placeholder="İsim"
                style={stylingClasses.input}
                value={this.state.userName}
                onChangeText={text => {
                  this.setState({ userName: text })
                }}
              />
              <TextInput
                placeholder="Soyisim"
                style={stylingClasses.input}
                value={this.state.userSurname}
                onChangeText={text => {
                  this.setState({ userSurname: text })
                }}
              />
              <TextInput
                placeholder="Uzmanlık Alanı"
                style={stylingClasses.input}
                value={this.state.field}
                onChangeText={text => {
                  this.setState({ field: text })
                }}
              />
              <TextInput
                placeholder="E-Posta Adresi"
                style={stylingClasses.input}
                value={this.state.email}
                onChangeText={text => {
                  this.setState({ email: text })
                }}
              />
              <TextInput
                placeholder="Şifre İpucu (Şifre Değişimi İçin)"
                style={stylingClasses.input}
                value={this.state.passwordToken}
                onChangeText={text => {
                  this.setState({ passwordToken: text })
                }}
              />
              <TextInput
                placeholder="Şifre"
                style={stylingClasses.input}
                value={this.state.password}
                onChangeText={text => {
                  this.setState({ password: text })
                }}
                secureTextEntry={true}
              />
              <TextInput
                placeholder="Aynı Şifreyi Tekrar Giriniz"
                style={stylingClasses.input}
                value={this.state.passwordConfirm}
                onChangeText={text => {
                  this.setState({ passwordConfirm: text })
                }}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={{ marginTop: '5%', marginBottom: '3.5%' }}
                onPress={this.onSignupPress}>
                <View
                  style={[
                    stylingClasses.customButton,
                    { backgroundColor: '#ffff00' }
                  ]}>
                  <Text
                    style={{
                      color: '#757575',
                      fontSize: Dimensions.get('window').height / 45,
                      fontWeight: '100'
                    }}>
                    Hesap Oluştur
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onBackToLoginPress}>
                <View style={stylingClasses.customButton}>
                  <Text
                    style={{
                      color: '#bdbdbd',
                      fontSize: Dimensions.get('window').height / 45,
                      fontWeight: '100'
                    }}>
                    Giriş Ekranına Dön
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    )
  }

  handleKeyboardDidShow = event => {
    const { height: windowHeight } = Dimensions.get('window')
    const keyboardHeight = event.endCoordinates.height
    const currentlyFocusedField = TextInputState.currentlyFocusedField()
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height
        const fieldTop = pageY
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight)
        if (gap >= 0) {
          return
        }
        Animated.timing(this.state.shift, {
          toValue: gap,
          duration: 500,
          useNativeDriver: true
        }).start()
    })
  }

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start()
  }
  _loadAnimationAsync = async () => {
    // @ts-ignore
    let result = require('../../assets/signUp.json')
    this.setState({ animation: result }, this._playAnimation)
  }
}
const stylingClasses = StyleSheet.create({
  main: {
    backgroundColor: '#13161E',
    flex: 1
  },
  input: {
    letterSpacing: 3,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginRight: '8%',
    marginLeft: '8%',
    marginBottom: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    fontSize: Dimensions.get('window').height / 45,
    height: Dimensions.get('window').height / 17.5,
    color: '#ffff00',
    borderBottomColor: '#ffff00',
    borderBottomWidth: 0.5
  },
  customButton: {
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
    marginLeft: '3%',
    borderRadius: 5
  },
  container: {
    backgroundColor: '#13161E',
    flex: 1
  },
  first: {
    height: '38%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  second: {
    height: '62%'
  },
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
