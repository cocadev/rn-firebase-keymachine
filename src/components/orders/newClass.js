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
import db from '../../database/firebaseInit'
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/FontAwesome'
// @ts-ignore
import { DangerZone } from 'expo'

const { Lottie } = DangerZone

export default class newClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sinif: '',
      uniqueKey: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#13161E'
      },
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 15 }}
          onPress={() => navigation.push('Homepage')}>
          <Icon
            name="arrow-circle-left"
            size={Dimensions.get('window').height / 23}
            color="#f5f5f5"
          />
        </TouchableOpacity>
      )
    }
  }
  onCreateUnitPress = () => {
    const kmachine = require('keymachine')
    kmachine.configuration.lenght = 12
    if (this.state.sinif.length > 2) {
      let generatedKey = kmachine.keymachine()
      db.collection('units')
        .add({
          unitName: this.state.sinif,
          unitID: generatedKey,
          admins: [firebase.auth().currentUser.email],
          members: [firebase.auth().currentUser.email]
        })
        .then(() => {
          db.collection('users')
            .where('email', '==', firebase.auth().currentUser.email)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref.update({
                  units: firebase.firestore.FieldValue.arrayUnion(generatedKey)
                })
              })
            })
        })
        .then(() => {
          this.setState({
            sinif: ''
          })
          this.props.navigation.push('Main')
        })
    } else {
      Alert.alert(
        'UYARI',
        'Sınıf oluşturmak için en az 3 karakter içeren bir sınıf adı girin.',
        [{}, {}, {}],
        { cancelable: true }
      )
    }
  }

  render() {
    return (
      <View style={stylingClasses.container}>
        <View style={{ bottom: '5%' }}>
          <TextInput
            placeholder="Sınıf Adı"
            style={stylingClasses.input}
            value={this.state.sinif}
            onChangeText={text => {
              this.setState({ sinif: text })
            }}
          />
          <TouchableOpacity
            style={{ marginTop: '5%' }}
            onPress={this.onCreateUnitPress}>
            <View style={stylingClasses.customButton}>
              <Text
                style={{
                  color: '#212121',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }}>
                TAMAM
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
    color: '#00e676',
    borderBottomColor: '#00e676',
    borderBottomWidth: 0.35
  },
  customButton: {
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '20%',
    marginLeft: '20%',
    borderRadius: 5,
    backgroundColor: '#00e676'
  },
  container: {
    backgroundColor: '#13161E',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
