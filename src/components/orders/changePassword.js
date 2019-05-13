import React from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
export default class changePassword extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#880e4f'
      },
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 15 }}
          onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-circle-left"
            size={Dimensions.get('window').height / 23}
            color="#eee"
          />
        </TouchableOpacity>
      )
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      changePassword: null,
      changePassword2: null
    }
  }
  handleUpdatePassword = () => {
    if (this.state.changePassword === this.state.changePassword2) {
      firebase
        .auth()
        .currentUser.updatePassword(this.state.changePassword)
        .then(() => this.props.push('Profile'))
    } else {
      alert('Girdiğiniz şifreler birbiri ile uyuşmuyor!')
    }
  }
  render() {
    return (
      <View style={stylingClasses.container}>
        <TextInput
          secureTextEntry={true}
          placeholder={'Yeni Parolanızı Giriniz'}
          style={stylingClasses.input}
          value={this.state.changePassword}
          textAlignVertical="top"
          onChangeText={text => {
            this.setState({ changePassword: text })
          }}
        />

        <TextInput
          secureTextEntry={true}
          placeholder={'Parolanızı Tekrar Giriniz'}
          style={stylingClasses.input}
          value={this.state.changePassword2}
          textAlignVertical="top"
          onChangeText={text => {
            this.setState({ changePassword2: text })
          }}
        />

        <View>
          <TouchableOpacity
            style={stylingClasses.button}
            onPress={this.handleUpdatePassword}>
            <Text
              numberOfLines={1}
              style={{
                color: '#eee',
                fontSize: Dimensions.get('window').height / 45,
                fontWeight: '100'
              }}>
              TAMAM
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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
    color: '#212121',
    borderBottomColor: '#212121',
    borderBottomWidth: 0.35
  },
  button: {
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '20%',
    marginLeft: '20%',
    borderRadius: 5,
    marginTop: 15,
    backgroundColor: '#212121'
  },
  container: {
    backgroundColor: '#880e4f',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
})
