import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import firebase from 'firebase'
import db from '../../database/firebaseInit'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class joinToUnit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      invationCode: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#eee'
      },
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 15 }}
          onPress={() => navigation.push('Homepage')}>
          <Icon
            name="arrow-circle-left"
            size={Dimensions.get('window').height / 23}
            color="#212121"
          />
        </TouchableOpacity>
      )
    }
  }

  handleInvationCode = () => {
    /*  Alert.alert(
      'Uyarı',
      'Mesaj',
      [
        {
          text: 'OK',
          onPress: () => {.doc("members").
            //
          }
        }
      ],
      {
        cancelable: false
      }
    )
    */
    db.collection('units')
      .where('unitID', '==', this.state.invationCode)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({
            members: firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.email
            )
          })
        })
      })
      .then(() => {
        db.collection('users')
          .where('email', '==', firebase.auth().currentUser.email)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.update({
                units: firebase.firestore.FieldValue.arrayUnion(
                  this.state.invationCode
                )
              })
            })
          })
      })
      .then(() => {
        setTimeout(() => this.props.navigation.push('Homepage'), 1000)
      })
  }
  render() {
    return (
      <View style={stylingClasses.container}>
        <View style={{ bottom: '5%' }}>
          <TextInput
            placeholder="Davet Kodu"
            style={stylingClasses.input}
            value={this.state.invationCode}
            onChangeText={text => {
              this.setState({ invationCode: text })
            }}
          />
          <TouchableOpacity
            style={{ marginTop: '5%' }}
            onPress={this.handleInvationCode}>
            <View style={stylingClasses.customButton}>
              <Text
                style={{
                  color: '#eee',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }}>
                Tamam
              </Text>
            </View>
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
  customButton: {
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '20%',
    marginLeft: '20%',
    borderRadius: 5,
    backgroundColor: '#212121'
  },
  container: {
    backgroundColor: '#eee',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
