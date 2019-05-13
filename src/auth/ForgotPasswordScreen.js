import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native'
import * as firebase from 'firebase'
import db from '../database/firebaseInit'
// @ts-ignore
import { DangerZone } from 'expo'

const { Lottie } = DangerZone

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      passwordToken: null,
      securityToken: '',
      animation: null
    }
  }

  static navigationOptions = () => {
    return {
      header: () => null
    }
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
  onResetPasswordPress = () => {
    db.collection('users')
      .where('email', '==', this.state.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            passwordToken: doc.data().passwordToken
          })
        })
      })
      .catch(() =>
        Alert.alert(
          '',
          'Sistematik bir hata ile karşılaşıldı, lütfen daha sonra tekrar deneyiniz.',
          [
            {
              text: 'Tamam',
              onPress: () => {}
            }
          ]
        )
      )
      .then(() => {
        if (this.state.passwordToken === this.state.securityToken) {
          firebase
            .auth()
            .sendPasswordResetEmail(this.state.email)
            .then(function() {
              Alert.alert(
                '',
                'Parola sıfırlama postası girmiş olduğunuz Eposta adresine gönderilmiştir.',
                [
                  {
                    text: 'Tamam',
                    onPress: () => {}
                  }
                ]
              )
            })
            .then(() => this.props.navigation.push('Login'))
            .catch(function(error) {
              Alert.alert(
                '',
                'Girmiş olduğunuz E-posta adresi ile Güvenlik Anahtarı eşleşmemektedir.',
                [
                  {
                    text: 'Tamam',
                    onPress: () => {}
                  }
                ]
              )
            })
        } else {
          Alert.alert(
            '',
            'Girmiş olduğunuz E-posta adresi ile Güvenlik Anahtarı eşleşmemektedir.',
            [
              {
                text: 'Tamam',
                onPress: () => {}
              }
            ]
          )
        }
      })
  }
  onBackToLoginPress = () => {
    this.props.navigation.goBack()
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
            placeholder="Eposta"
            style={stylingClasses.input}
            value={this.state.email}
            onChangeText={text => {
              this.setState({ email: text })
            }}
          />
          <TextInput
            placeholder="Şifre İpucu"
            style={stylingClasses.input}
            value={this.state.securityToken}
            onChangeText={text => {
              this.setState({ securityToken: text })
            }}
          />

          <TouchableOpacity style={{ marginTop: '5%', marginBottom: '3.5%' }} onPress={this.onResetPasswordPress}>
            <View style={[stylingClasses.customButton, {backgroundColor: '#6200ea'}]}>
              <Text
                style={{
                  color: '#bdbdbd',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }}>
                Parolayı Sıfırla
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
        </View>
      </View>
    )
  }
  _loadAnimationAsync = async () => {
    // @ts-ignore
    let result = require('../../assets/forgotPassword.json')
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
    color: '#6200ea',
    borderBottomColor: '#6200ea',
    borderBottomWidth: 0.35
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
    flex: 1,
    flexDirection: 'column'
  },
  first: {
    top: '6.3%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  second: {
    top: '7%',
    height: '60%'
  },
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
