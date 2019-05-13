import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import db from '../database/firebaseInit'
import firebase from 'firebase'
import LoadingScreen from '../tools/LoadingScreen'

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataFetched: false,
      hasUnit: false,
      listUnits: null,
      isLoading: true,
      isUserAdmin: false,

      // to profile

      userNameData: '',
      userSurnameData: '',
      emailData: '',
      fieldData: '',
      unitCounter: [],
      projectCounter: 0,
      offerCounter: 0
    }
  }
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }
  componentWillMount() {
    let y = 0
    let z = 0

    let holder = []
    db.collection('units')
      .where(
        'members',
        'array-contains',
        firebase.auth().currentUser.email.toString()
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            unitID: doc.data().unitID,
            unitName: doc.data().unitName
          }
          holder.push(data)
          this.setState({
            hasUnit: true
          })
        })
      })
      .then(() =>
        db
          .collection('users')
          .where('email', '==', firebase.auth().currentUser.email)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              let x = doc.data().units
              this.setState({
                userNameData: doc.data().userName,
                userSurnameData: doc.data().userSurname,
                emailData: doc.data().email,
                fieldData: doc.data().field,
                unitCounter: x
              })
            })
          })
      )
      .then(() =>
        db
          .collection('projects')
          .where(
            'projectMembers',
            'array-contains',
            firebase.auth().currentUser.email
          )
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              y = y + 1
              this.setState({
                projectCounter: y
              })
            })
          })
      )
      .then(() =>
        db
          .collection('offers')
          .where('sentBy', '==', firebase.auth().currentUser.email)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              z = z + 1
              this.setState({
                offerCounter: z,
                offerConnector: doc.data().projectConnector,
                offerName: doc.data().projectName,
                offerDetails: doc.data().projectDetails,
                offerSentBy: doc.data().sentBy
              })
            })
          })
      )
      .then(() => {
        this.setState({
          listUnits: holder
        })
      })
      .then(() => {
        setTimeout(() => {
          this.setState({
            isLoading: false
          })
        }, 1000)
      })
  }
  render() {
    if (!this.state.isLoading) {
      if (this.state.hasUnit) {
        return (
          <View style={stylingClasses.container}>
            <View style={stylingClasses.top}>
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ paddingTop: '2.5%' }}
                data={this.state.listUnits}
                renderItem={({ item }) => (
                  <ScrollView style={stylingClasses.topItemInner}>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.props.navigation.navigate('unitDashboard', {
                          fromMainID: item.unitID,
                          fromMainName: item.unitName,
                          fromMainAdmin: this.state.isUserAdmin
                        })
                      }>
                      <View style={stylingClasses.listItem}>
                        <Text
                          numberOfLines={1}
                          style={{
                            paddingLeft: 20
                          }}>
                          <Icon
                            name="cube"
                            color={'#ffff00'}
                            size={Dimensions.get('window').height / 30}
                          />
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: '#e0e0e0',
                            fontSize: Dimensions.get('window').height / 45,
                            fontWeight: 'bold'
                          }}>
                          {'     '}
                          {item.unitName.toUpperCase()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                )}
              />
            </View>
            <View style={stylingClasses.bottom}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('joinToUnit')}
                style={[
                  stylingClasses.bottomItemInner,
                  { backgroundColor: '#eee', flexDirection: 'row' }
                ]}>
                <Icon
                  name="users"
                  size={Dimensions.get('window').width / 20}
                  color="#212121"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 30,
                    fontWeight: '500',
                    color: '#212121'
                  }}>
                  {'  '}
                  Sınıfa Katıl
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('newClass')}
                style={[
                  stylingClasses.bottomItemInner,
                  { backgroundColor: '#00e676', flexDirection: 'row' }
                ]}>
                <Icon
                  name="plus-circle"
                  size={Dimensions.get('window').width / 20}
                  color="#212121"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 30,
                    fontWeight: '500',
                    color: '#212121'
                  }}>
                  {'  '}
                  Sınıf Aç
                </Text>
              </TouchableOpacity>
            </View>
            <View style={stylingClasses.navigation}>
              <View style={stylingClasses.navigationInner}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={stylingClasses.navigationItem}>
                  <Icon
                    size={Dimensions.get('window').width / 11.75}
                    name="home"
                    color="#f5f5f5"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Profile', {
                      fromMainUsernameData: this.state.userNameData,
                      fromMainUsersurnameData: this.state.userSurnameData,
                      fromMainEmailData: this.state.emailData,
                      fromMainFieldData: this.state.fieldData,
                      fromMainUnitCounter: this.state.unitCounter.length,
                      fromMainProjectCounter: this.state.projectCounter,
                      fromMainOfferCounter: this.state.offerCounter
                    })
                  }
                  style={stylingClasses.navigationItem}>
                  <Icon
                    size={Dimensions.get('window').width / 11.75}
                    name="user"
                    color="#f5f5f5"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else {
        return (
          <View style={stylingClasses.container}>
            <View
              style={[
                stylingClasses.top,
                { justifyContent: 'center', alignItems: 'center' }
              ]}>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 20,
                  fontWeight: '100',
                  color: '#212121'
                }}>
                Herhangi bir sınıfa dahil değilsiniz.
              </Text>
            </View>
            <View style={stylingClasses.bottom}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('joinToUnit')}
                style={[
                  stylingClasses.bottomItemInner,
                  { backgroundColor: '#eee', flexDirection: 'row' }
                ]}>
                <Icon
                  name="users"
                  size={Dimensions.get('window').width / 20}
                  color="#212121"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 30,
                    fontWeight: '500',
                    color: '#212121'
                  }}>
                  {'  '}
                  Sınıfa Katıl
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('newClass')}
                style={[
                  stylingClasses.bottomItemInner,
                  { backgroundColor: '#00e676', flexDirection: 'row' }
                ]}>
                <Icon
                  name="plus-circle"
                  size={Dimensions.get('window').width / 20}
                  color="#212121"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 30,
                    fontWeight: '500',
                    color: '#212121'
                  }}>
                  {'  '}
                  Sınıf Aç
                </Text>
              </TouchableOpacity>
            </View>
            <View style={stylingClasses.navigation}>
              <View style={stylingClasses.navigationInner}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={stylingClasses.navigationItem}>
                  <Icon
                    size={Dimensions.get('window').width / 11.75}
                    name="home"
                    color="#f5f5f5"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Profile', {
                      fromMainUsernameData: this.state.userNameData,
                      fromMainUsersurnameData: this.state.userSurnameData,
                      fromMainEmailData: this.state.emailData,
                      fromMainFieldData: this.state.fieldData,
                      fromMainUnitCounter: this.state.unitCounter.length,
                      fromMainProjectCounter: this.state.projectCounter,
                      fromMainOfferCounter: this.state.offerCounter
                    })
                  }
                  style={stylingClasses.navigationItem}>
                  <Icon
                    size={Dimensions.get('window').width / 11.75}
                    name="user"
                    color="#f5f5f5"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
    } else if (this.state.isLoading) {
      return <LoadingScreen />
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
    height: '85.5%',
    backgroundColor: '#eee',
    paddingBottom: '3.5%'
  },
  topItemInner: {
    width: '100%',
    position: 'relative',
    paddingLeft: 13,
    paddingRight: 13
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
    backgroundColor: '#080808',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },

  // Custom navigation

  navigation: {
    height: '6%',
    backgroundColor: '#212121',
    flexDirection: 'row',
    width: '100%'
  },
  navigationInner: {
    width: '100%',
    height: '100%',
    flexDirection: 'row'
  },
  navigationItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})
