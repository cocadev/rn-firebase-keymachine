import React from 'react'
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native'
import db from '../../database/firebaseInit'
import firebase from 'firebase'
import Intermediary from '../../tools/Intermediary'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class editUnit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editUnitName: '',
      isLoading: true
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#212121'
      },
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 15 }}
          onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-circle-left"
            size={Dimensions.get('window').height / 23}
            color="#00e676"
          />
        </TouchableOpacity>
      )
    }
  }

  componentWillMount() {
    db.collection('units')
      .where('admins', 'array-contains', firebase.auth().currentUser.email)
      .where(
        'unitID',
        '==',
        this.props.navigation.state.params.fromUnitDashboardUniqueConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            editUnitName: doc.data().unitName
          })
          setTimeout(() => {
            this.setState({
              isLoading: false
            })
          }, 1000)
        })
      })
  }

  handleUpdateUnit = () => {
    if (this.state.editUnitName.length > 2) {
      db.collection('units')
        .where('admins', 'array-contains', firebase.auth().currentUser.email)
        .where(
          'unitID',
          '==',
          this.props.navigation.state.params.fromUnitDashboardUniqueConnector
        )
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              unitName: this.state.editUnitName
            })
          })
        })
        .then(() => this.props.navigation.push('Main'))
    } else {
      Alert.alert(
        'UYARI',
        'Sınıf oluşturmak için en az 3 karakter içeren bir sınıf adı girin.',
        [{}, {}, {}],
        { cancelable: true }
      )
    }
  }
  handleDeleteUnit = () => {
    db.collection('units')
      .where('admins', 'array-contains', firebase.auth().currentUser.email)
      .where(
        'unitID',
        '==',
        this.props.navigation.state.params.fromUnitDashboardUniqueConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete()
        })
      })
    db.collection('projects')
      .where(
        'projectConnector',
        '==',
        this.props.navigation.state.params.fromUnitDashboardUniqueConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete()
        })
      })
    db.collection('projectStatus')
      .where(
        'projectUnitConnector',
        '==',
        this.props.navigation.state.params.fromUnitDashboardUniqueConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete()
        })
      })
    db.collection('offers')
      .where(
        'projectConnector',
        '==',
        this.props.navigation.state.params.fromUnitDashboardUniqueConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete()
        })
      })
    db.collection('users')
      .where(
        'units',
        'array-contains',
        this.props.navigation.state.params.fromUnitDashboardUniqueConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({
            units: firebase.firestore.FieldValue.arrayRemove(
              this.props.navigation.state.params
                .fromUnitDashboardUniqueConnector
            )
          })
        })
      })
      .then(() => this.props.navigation.push('Homepage'))
  }

  render() {
    if (this.state.isLoading) {
      return <Intermediary />
    } else {
      return (
        <View style={stylingClasses.container}>
          <TextInput
            style={stylingClasses.input}
            value={this.state.editUnitName}
            textAlignVertical="top"
            onChangeText={text => {
              this.setState({ editUnitName: text })
            }}
          />
          <TouchableOpacity
            style={{ marginTop: '5%', marginBottom: '5%' }}
            onPress={this.handleUpdateUnit}>
            <View
              style={[
                stylingClasses.customButton,
                { backgroundColor: '#00e676' }
              ]}>
              <Text
                style={{
                  color: '#212121',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }}>
                Güncelle
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'UYARI',
                'Sınıfı silmek, sınıfın içerdiği tüm proje ve üye verilerini kaldıracaktır. Devam etmek istediğinize emin misiniz?.',
                [
                  { text: 'Hayır', onPress: () => {} },
                  {
                    text: 'Evet',
                    onPress: this.handleDeleteUnit,
                    style: 'cancel'
                  }
                ]
              )
            }>
            <View style={stylingClasses.customButton}>
              <Text
                style={{
                  color: '#212121',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }}>
                SİL
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
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
  customButton: {
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '20%',
    marginLeft: '20%',
    borderRadius: 5
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
