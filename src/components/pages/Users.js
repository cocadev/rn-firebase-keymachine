import React from 'react'
import {
  FlatList,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions
} from 'react-native'
import db from '../../database/firebaseInit'
import firebase from 'firebase'
import Intermediary from '../../tools/Intermediary'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      isLoading: true
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
  componentWillMount() {
    let holder = []
    db.collection('users')
      .where(
        'units',
        'array-contains',
        this.props.navigation.state.params.fromUnitDashboardUnitConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            userName: doc.data().userName,
            userSurname: doc.data().userSurname,
            userField: doc.data().field,
            userEmail: doc.data().email
          }
          holder.push(data)
        })
      })
      .then(() => {
        this.setState({
          users: holder
        })
        setTimeout(() => {
          this.setState({
            isLoading: false
          })
        }, 1000)
      })
  }

  handleKickFromUnit = email => {
    if (email === firebase.auth().currentUser.email) {
      Alert.alert(
        'HATA',
        'Admin olduğunuz sınıftan kendinizi atamazsınız. Dilerseniz sınıf düzenleme ekranından sınıfı silebilirsiniz.',
        [{}, {}, {}],
        { cancelable: true }
      )
    } else {
      db.collection('users')
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              units: firebase.firestore.FieldValue.arrayRemove(
                this.props.navigation.state.params
                  .fromUnitDashboardUnitConnector
              )
            })
          })
        })
        .then(() => {
          db.collection('units')
            .where(
              'unitID',
              '==',
              this.props.navigation.state.params.fromUnitDashboardUnitConnector
            )
            .where('members', 'array-contains', email)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref.update({
                  members: firebase.firestore.FieldValue.arrayRemove(email)
                })
              })
            })
        })
        .then(() => {
          this.props.navigation.goBack()
        })
    }
  }
  handleAddNewAdmin = email => {
    let isThereAdmin = false
    if (email === firebase.auth().currentUser.email) {
      Alert.alert(
        'HATA',
        'Yetkilendirme yapılamadı, mevcut durumda zaten yönetici konumundasınız.',
        [{}, {}, {}],
        { cancelable: true }
      )
    } else {
      Alert.alert(
        '',
        email +
          ' hesabını yetkilendirmek üzeresiniz. Devam etmek istiyor musunuz ?',
        [
          {},
          { text: 'Hayır', onPress: () => {} },
          {
            text: 'Evet',
            onPress: () => {
              db.collection('units')
                .where('admins', 'array-contains', email)
                .where(
                  'unitID',
                  '==',
                  this.props.navigation.state.params
                    .fromUnitDashboardUnitConnector
                )
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(doc => {
                    isThereAdmin = true
                  })
                })

                .then(() => {
                  if (!isThereAdmin) {
                    db.collection('units')
                      .where(
                        'unitID',
                        '==',
                        this.props.navigation.state.params
                          .fromUnitDashboardUnitConnector
                      )
                      .get()
                      .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                          doc.ref.update({
                            admins: firebase.firestore.FieldValue.arrayUnion(
                              email
                            )
                          })
                        })
                      })
                      .then(() => {
                        Alert.alert(
                          '',
                          email +
                            ' hesabı için yetkilendirme başarılı ile yapıldı.',
                          [{}, {}, {}],
                          { cancelable: true }
                        )
                      })
                  } else {
                    Alert.alert(
                      'HATA',
                      email + ' hesabı zaten yetkili konumunda.',
                      [{}, {}, {}],
                      { cancelable: true }
                    )
                  }
                })
            }
          }
        ],
        { cancelable: false }
      )
    }
  }

  handleTakeAdminDown = email => {
    let isThereAdmin = false
    if (email === firebase.auth().currentUser.email) {
      Alert.alert(
        'HATA',
        'Kendi hesabınızın yetkisini düşüremezsiniz.',
        [{}, {}, {}],
        { cancelable: true }
      )
    } else {
      Alert.alert(
        '',
        email + ' hesabının yetkisini düşürmek istediğinize emin misiniz ?',
        [
          {},
          { text: 'Hayır', onPress: () => {} },
          {
            text: 'Evet',
            onPress: () => {
              db.collection('units')
                .where('admins', 'array-contains', email)
                .where(
                  'unitID',
                  '==',
                  this.props.navigation.state.params
                    .fromUnitDashboardUnitConnector
                )
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(doc => {
                    isThereAdmin = true
                  })
                })
                .then(() => {
                  if (isThereAdmin) {
                    db.collection('units')
                      .where(
                        'unitID',
                        '==',
                        this.props.navigation.state.params
                          .fromUnitDashboardUnitConnector
                      )
                      .get()
                      .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                          doc.ref.update({
                            admins: firebase.firestore.FieldValue.arrayRemove(
                              email
                            )
                          })
                        })
                      })
                      .then(() =>
                        Alert.alert(
                          '',
                          'İşlem başarılı bir şekilde gerçekleştirildi.',
                          [{}, {}, {}],
                          { cancelable: true }
                        )
                      )
                  } else {
                    Alert.alert(
                          'HATA',
                          'Yalnızca yetkili hesapların yetkileri düşürülebilir.',
                          [{}, {}, {}],
                          { cancelable: true }
                        )
                  }
                })
            }
          }
        ],
        { cancelable: false }
      )
    }
  }
  render() {
    if (this.state.isLoading) {
      return <Intermediary />
    } else {
      if (this.props.navigation.state.params.fromUnitDashboardIsUserAdmin) {
        return (
          <View style={stylingClasses.container}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ paddingTop: '2.5%' }}
              data={this.state.users}
              renderItem={({ item }) => (
                <ScrollView style={stylingClasses.topItemInner}>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        '',
                        'Seçilen kullanıcı için seçenekler:',
                        [
                          {
                            text: 'Bilgileri',
                            onPress: () =>
                              Alert.alert(
                                'Kullanıcı Bilgileri',
                                ` \n Ad: ${item.userName} \n \n Soyad: ${
                                  item.userSurname
                                } \n \n Alan: ${
                                  item.userField
                                } \n \n E-Posta: ${item.userEmail} \n`,
                                [{}, {}, {}]
                              )
                          },
                          {
                            text: 'Sınıftan At',
                            onPress: () =>
                              this.handleKickFromUnit(item.userEmail)
                          },
                          {
                            text: 'Yetkilendirme',
                            onPress: () => {
                              Alert.alert('', 'İşlem seçiniz.', [
                                {},
                                {
                                  text: 'Yönetici Ata',
                                  onPress: () =>
                                    this.handleAddNewAdmin(item.userEmail)
                                },
                                {
                                  text: 'Yetki Düşür',
                                  onPress: () =>
                                    this.handleTakeAdminDown(item.userEmail)
                                }
                              ])
                            }
                          }
                        ],
                        { cancelable: true }
                      )
                    }>
                    <View style={stylingClasses.listItem}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#f5f5f5',
                          paddingLeft: 10,
                          fontSize: Dimensions.get('window').height / 32,
                          fontWeight: '100'
                        }}>
                        <Icon
                          name="vcard-o"
                          color={'#00E676'}
                          size={Dimensions.get('window').height / 25}
                        />{' '}
                        {item.userName} {item.userSurname}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              )}
            />
            <ScrollView />
          </View>
        )
      } else {
        return (
          <View style={stylingClasses.container}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ paddingTop: '2.5%' }}
              data={this.state.users}
              renderItem={({ item }) => (
                <ScrollView style={stylingClasses.topItemInner}>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        '',
                        'Seçilen kullanıcı için seçenekler:',
                        [
                          {
                            text: 'Bilgileri',
                            onPress: () =>
                              Alert.alert(
                                'Kullanıcı Bilgileri',
                                ` \n Ad: ${item.userName} \n \n Soyad: ${
                                  item.userSurname
                                } \n \n Alan: ${
                                  item.userField
                                } \n \n E-Posta: ${item.userEmail} \n`,
                                [{}, {}, {}]
                              )
                          },
                          {},
                          {}
                        ],

                        { cancelable: true }
                      )
                    }>
                    <View style={stylingClasses.listItem}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#f5f5f5',
                          paddingLeft: 10,
                          fontSize: Dimensions.get('window').height / 32,
                          fontWeight: '100'
                        }}>
                        <Icon
                          name="vcard-o"
                          color={'#00E676'}
                          size={Dimensions.get('window').height / 25}
                        />{' '}
                        {item.userName} {item.userSurname}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              )}
            />
            <ScrollView />
          </View>
        )
      }
    }
  }
}

const stylingClasses = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  top: {
    top: '3.25%',
    height: '91.5%',
    backgroundColor: '#eee',
    paddingBottom: '3.5%'
  },
  topItemInner: {
    width: '100%',
    position: 'relative',
    paddingLeft: 50,
    paddingRight: 50
  },
  bottom: {
    height: '8.5%',
    backgroundColor: '#212121',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 6.61,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  bottomItem: {
    width: '100%',
    height: '100%'
  },
  bottomItemInner: {
    flex: 1,
    width: '50%',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  listItem: {
    height: Dimensions.get('window').height / 13.5,
    marginBottom: 2,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})
