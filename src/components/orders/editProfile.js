import React from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import firebase from 'firebase'
import db from '../../database/firebaseInit'
import Icon from 'react-native-vector-icons/FontAwesome'
import Intermediary from '../../tools/Intermediary'
export default class editProfile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#13161E'
      },
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 15 }}
          onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-circle-left"
            size={Dimensions.get('window').height / 23}
            color="#00E676"
          />
        </TouchableOpacity>
      )
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      editName: null,
      editSurname: null,
      editField: null,
      isLoading: true
    }
  }

  componentWillMount() {
    db.collection('users')
      .where('email', '==', firebase.auth().currentUser.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            editName: doc.data().userName,
            editSurname: doc.data().userSurname,
            editField: doc.data().field
          })
          setTimeout(() => {
            this.setState({
              isLoading: false
            })
          }, 1000)
        })
      })
  }

  handleUpdateProfile = () => {
    db.collection('users')
      .where('email', '==', firebase.auth().currentUser.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({
            userName: this.state.editName,
            userSurname: this.state.editSurname,
            field: this.state.editField
          })
        })
      })
      .then(() => this.props.navigation.push('Homepage'))
  }
  render() {
    if (!this.state.isLoading) {
      return (
        <View style={stylingClasses.container}>
          <TextInput
            style={stylingClasses.input}
            value={this.state.editName}
            textAlignVertical="top"
            onChangeText={text => {
              this.setState({ editName: text })
            }}
          />

          <TextInput
            style={stylingClasses.input}
            value={this.state.editSurname}
            textAlignVertical="top"
            onChangeText={text => {
              this.setState({ editSurname: text })
            }}
          />

          <TextInput
            style={stylingClasses.input}
            value={this.state.editField}
            textAlignVertical="top"
            onChangeText={text => {
              this.setState({ editField: text })
            }}
          />
          <View>
            <TouchableOpacity
              style={stylingClasses.button}
              onPress={this.handleUpdateProfile}>
              <Text
                style={{
                  color: '#212121',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }}>
                Güncelle
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return <Intermediary />
    }
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
    color: '#00e676',
    borderBottomColor: '#00e676',
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
    backgroundColor: '#eee'
  },
  container: {
    backgroundColor: '#13161E',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
})
