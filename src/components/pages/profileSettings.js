import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native'
import * as firebase from 'firebase'
import db from '../../database/firebaseInit'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class profileSettings extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#eee'
      },
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 15 }}
          onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-circle-left"
            size={Dimensions.get('window').height / 23}
            color="#212121"
          />
        </TouchableOpacity>
      )
    }
  }

  handleDeleteAccount = () => {
    Alert.alert(
      '',
      'Hesabınızı silmek istediğinize emin misiniz?',
      [
        {
          text: 'Hayır',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Evet',
          onPress: () => {
            db.collection('users')
              .where('email', '==', firebase.auth().currentUser.email)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  doc.ref.delete()
                })
              })
              .then(() => {
                db.collection('units')
                  .where(
                    'members',
                    'array-contains',
                    firebase.auth().currentUser.email
                  )
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      doc.ref.update({
                        members: firebase.firestore.FieldValue.arrayRemove(
                          firebase.auth().currentUser.email
                        )
                      })
                    })
                  })
              })
              .then(() => {
                db.collection('units')
                  .where(
                    'admins',
                    'array-contains',
                    firebase.auth().currentUser.email
                  )
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      doc.ref.update({
                        admins: firebase.firestore.FieldValue.arrayRemove(
                          firebase.auth().currentUser.email
                        )
                      })
                    })
                  })
              })
              .then(() => {
                db.collection('projects')
                  .where(
                    'projectMembers',
                    'array-contains',
                    firebase.auth().currentUser.email
                  )
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      doc.ref.update({
                        projectMembers: firebase.firestore.FieldValue.arrayRemove(
                          firebase.auth().currentUser.email
                        )
                      })
                    })
                  })
              })
              .then(() => {
                db.collection('projectStatus')
                  .where(
                    'projectMembers',
                    'array-contains',
                    firebase.auth().currentUser.email
                  )
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      doc.ref.update({
                        projectMembers: firebase.firestore.FieldValue.arrayRemove(
                          firebase.auth().currentUser.email
                        )
                      })
                    })
                  })
              })
              .then(() => {
                firebase
                  .auth()
                  .currentUser.delete()
                  .then(() =>
                    Alert.alert(
                      '',
                      'Hesabınız başarı ile sistemden kaldırıldı.',
                      [
                        {
                          text: 'Tamam',
                          onPress: () => {}
                        }
                      ]
                    )
                  )
              })
          }
        }
      ],
      { cancelable: false }
    )
  }
  render() {
    return (
      <View style={stylingClasses.container}>
        <View style={stylingClasses.main}>
          <TouchableOpacity
            style={stylingClasses.first}
            onPress={() => this.props.navigation.navigate('editProfile')}>
            <Icon
              name="pencil"
              size={Dimensions.get('window').width / 5}
              color="#13161E"
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: Dimensions.get('window').width / 13,
                fontWeight: '100',
                color: '#13161E'
              }}>
              {'  '}
              Profil Bilgilerini Düzenle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={stylingClasses.second}
            onPress={() => this.props.navigation.navigate('changePassword')}>
            <Icon
              name="shield"
              size={Dimensions.get('window').width / 5}
              color="#00E676"
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: Dimensions.get('window').width / 13,
                fontWeight: '100',
                color: '#00E676'
              }}>
              {'  '}
              Parola Değiştir
            </Text>
          </TouchableOpacity>
        </View>

        <View style={stylingClasses.bottom}>
          <TouchableOpacity
            onPress={this.handleDeleteAccount}
            style={[
              stylingClasses.bottomItemInner,
              { backgroundColor: '#eee', flexDirection: 'row' }
            ]}>
            <Icon
              name="trash"
              size={Dimensions.get('window').width / 15}
              color="#212121"
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: Dimensions.get('window').width / 25,
                fontWeight: '500'
              }}>
              {'  '}
              Hesabı Sil
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const stylingClasses = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13161E'
  },
  main: {
    height: '91.5%',
    borderRadius: 8,
    backgroundColor: '#13161E'
  },
  first: {
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('window').height / 2.3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 5
  },
  second: {
    backgroundColor: '#13161E',
    height: Dimensions.get('window').height / 2.3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 5
  },
  bottom: {
    height: '8.5%',
    backgroundColor: '#880e4f',
    padding: 6.61,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row'
  },
  bottomItemInner: {
    flex: 1,
    width: '50%',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  customButton: {
    height: Dimensions.get('window').height / 14,
    marginTop: '3%',
    backgroundColor: '#080808',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
