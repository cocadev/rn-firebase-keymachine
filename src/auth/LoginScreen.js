import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native'
import * as firebase from 'firebase'
// @ts-ignore
import { DangerZone } from 'expo'

const { Lottie } = DangerZone

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      animation: null
    }
  }

  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(function(error) {
        let errorCode = error.code
        if (errorCode === 'auth/wrong-password') {
          Alert.alert('', 'Hatalı kullanıcı adı ya da parola.', [
            {
              text: 'Tamam',
              onPress: () => {}
            }
          ])
        } else {
          Alert.alert('', 'Hatalı kullanıcı adı ya da parola.', [
            {
              text: 'Tamam',
              onPress: () => {}
            }
          ])
        }
      })
  }
  onCreateAccountPress = () => {
    this.props.navigation.push('Signup')
  }
  onForgotPasswordPress = () => {
    this.props.navigation.push('ForgotPassword')
  }

  componentWillMount() {
    this._playAnimation()
  }
  _playAnimation = () => {
    if (!this.state.animation) {
      this._loadAnimationAsync()
    } else {
      this.animation.reset()
      this.animation.play()
    }
  }
  render() {
    return (
      <View style={stylingClasses.container}>
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
          <TextInput
            placeholder="E-POSTA"
            style={stylingClasses.input}
            value={this.state.email}
            onChangeText={text => {
              this.setState({ email: text })
            }}
          />
          <TextInput
            placeholder="ŞİFRE"
            style={stylingClasses.input}
            value={this.state.password}
            onChangeText={text => {
              this.setState({ password: text })
            }}
            secureTextEntry={true}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: 15
            }}>
            <TouchableOpacity
              style={{ width: '50%' }}
              onPress={this.onLoginPress}>
              <View style={stylingClasses.signInButton}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#757575',
                    fontSize: Dimensions.get('window').height / 45,
                    fontWeight: '100'
                  }}>
                  Giriş Yap
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: '50%' }}
              onPress={this.onCreateAccountPress}>
              <View style={stylingClasses.signUpButton}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#212121',
                    fontSize: Dimensions.get('window').height / 45,
                    fontWeight: '100'
                  }}>
                  Hesap Oluştur
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.onForgotPasswordPress}>
            <View style={stylingClasses.forgotPassword}>
              <Text
                numberOfLines={1}
                style={{
                  color: '#eee',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }}>
                Şifremi Unuttum
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  _loadAnimationAsync = async () => {
    // @ts-ignore
    let result = require('../../assets/signIn.json')
    this.setState({ animation: result }, this._playAnimation)
  }
}

const stylingClasses = StyleSheet.create({
  input: {
    letterSpacing: 3,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginRight: '8%',
    marginLeft: '8%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    fontSize: Dimensions.get('window').height / 35,
    height: Dimensions.get('window').height / 17.5,
    color: '#69f0ae',
    borderBottomColor: '#69f0ae',
    borderBottomWidth: 0.35
  },
  signInButton: {
    height: Dimensions.get('window').height / 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
    borderRadius: 5
  },
  signUpButton: {
    height: Dimensions.get('window').height / 20,
    backgroundColor: '#ffff00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%',
    marginLeft: '5%',
    marginBottom: 15,
    borderRadius: 5
  },
  forgotPassword: {
    height: Dimensions.get('window').height / 20,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
    marginLeft: '3%',
    borderRadius: 5
  },
  container: {
    backgroundColor: '#13161E',
    flex: 1,
    flexDirection: 'column'
  },
  first: {
    top: '10%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  second: {
    height: '70%',
    top: '8%'
  },
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
