import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import db from '../../database/firebaseInit'
import firebase from 'firebase'
import Intermediary from '../../tools/Intermediary'

export default class unitDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      conditionKey: null,
      isUserAdmin: null
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

  componentWillMount() {
    db.collection('units')
      .where('unitID', '==', this.props.navigation.state.params.fromMainID)
      .where('admins', 'array-contains', firebase.auth().currentUser.email)
      .get()
      .then(QuerySnapshot => {
        if (QuerySnapshot.docs.length > 0) {
          this.setState({
            isUserAdmin: true
          })
        } else {
          this.setState({
            isUserAdmin: false
          })
        }
      })
  }

  render() {
    if (this.state.isUserAdmin) {
      return (
        <View style={stylingClasses.container}>
          <View style={stylingClasses.topLayout}>
            <View style={stylingClasses.topItem}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Projects', {
                    fromUnitDashboardProjectConnector: this.props.navigation
                      .state.params.fromMainID,
                      fromUnitDashboardIsUserAdmin: this.state.isUserAdmin
                  })
                }
                style={[
                  stylingClasses.topItemInner,
                  { backgroundColor: '#f5f5f5' }
                ]}>
                <Icon
                  name="vcard-o"
                  size={Dimensions.get('window').width / 5}
                  color="#212121"
                />

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 13,
                    fontWeight: '100',
                    color: '#212121'
                  }}>
                  PROJELER
                </Text>
              </TouchableOpacity>
            </View>
            <View style={stylingClasses.topItem}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Users', {
                    fromUnitDashboardUnitConnector: this.props.navigation.state
                      .params.fromMainID,
                    fromUnitDashboardIsUserAdmin: true
                  })
                }
                style={[
                  stylingClasses.topItemInner,
                  { backgroundColor: '#880e4f' }
                ]}>
                <Icon
                  name="vcard-o"
                  size={Dimensions.get('window').width / 5}
                  color="#f5f5f5"
                />

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 13,
                    fontWeight: '100',
                    color: '#f5f5f5'
                  }}>
                  ÜYELER
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={stylingClasses.bottom}>
            <TouchableOpacity
              style={[
                stylingClasses.bottomItemInnerAdmin,
                { backgroundColor: '#f5f5f5' }
              ]}
              onPress={() =>
                Alert.alert(
                  'Davet Kodu',
                  'Bulunduğunuz sınıfın davet kodu: ' +
                    this.props.navigation.state.params.fromMainID,
                  [
                    {
                      text: 'Kopyala',
                      onPress: () => {
                        Clipboard.setString(
                          this.props.navigation.state.params.fromMainID
                        )
                      }
                    },
                    {},
                    {}
                  ],
                  { cancelable: true }
                )
              }>
              <Icon
                size={Dimensions.get('window').width / 17}
                name="link"
                color="#212121"
              />
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  color: '#212121',
                  fontWeight: '100'
                }}>
                {'  '}Davet Kodu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                stylingClasses.bottomItemInnerAdmin,
                { backgroundColor: '#00E676' }
              ]}
              onPress={() =>
                this.props.navigation.navigate('editUnit', {
                  fromUnitDashboardUniqueConnector: this.props.navigation.state
                    .params.fromMainID
                })
              }>
              <Icon
                size={Dimensions.get('window').width / 17}
                name="magic"
                color="#212121"
              />
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  color: '#212121',
                  fontWeight: '100'
                }}>
                {'  '}Sınıfı Düzenle
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else if (this.state.isUserAdmin === false) {
      return (
        <View style={stylingClasses.container}>
          <View style={stylingClasses.topLayout}>
            <View style={stylingClasses.topItem}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Projects', {
                    fromUnitDashboardProjectConnector: this.props.navigation
                      .state.params.fromMainID,
                      fromUnitDashboardIsUserAdmin: this.state.isUserAdmin
                  })
                }
                style={[
                  stylingClasses.topItemInner,
                  { backgroundColor: '#f5f5f5' }
                ]}>
                <Icon
                  name="vcard-o"
                  size={Dimensions.get('window').width / 5}
                  color="#212121"
                />

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 13,
                    fontWeight: '100',
                    color: '#212121'
                  }}>
                  PROJELER
                </Text>
              </TouchableOpacity>
            </View>
            <View style={stylingClasses.topItem}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Users', {
                    fromUnitDashboardUnitConnector: this.props.navigation.state
                      .params.fromMainID,
                    fromUnitDashboardIsUserAdmin: false
                  })
                }
                style={[
                  stylingClasses.topItemInner,
                  { backgroundColor: '#880e4f' }
                ]}>
                <Icon
                  name="vcard-o"
                  size={Dimensions.get('window').width / 5}
                  color="#f5f5f5"
                />

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 13,
                    fontWeight: '100',
                    color: '#f5f5f5'
                  }}>
                  ÜYELER
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={stylingClasses.bottom}>
            <TouchableOpacity
              style={[
                stylingClasses.bottomItemInnerAdmin,
                { backgroundColor: '#f5f5f5' }
              ]}
              onPress={() =>
                Alert.alert(
                  'Davet Kodu',
                  'Bulunduğunuz sınıfın davet kodu: ' +
                    this.props.navigation.state.params.fromMainID,
                  [
                    {
                      text: 'Kopyala',
                      onPress: () => {
                        Clipboard.setString(
                          this.props.navigation.state.params.fromMainID
                        )
                      }
                    },
                    {},
                    {}
                  ],
                  { cancelable: true }
                )
              }>
              <Icon
                size={Dimensions.get('window').width / 17}
                name="link"
                color="#212121"
              />
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  fontWeight: '100',
                  color: '#212121'
                }}>
                {'  '}Davet Kodu
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
  container: {
    flex: 1,
    backgroundColor: '#880e4f'
  },
  topLayout: {
    height: '91.5%',
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  topItem: {
    width: '100%',
    height: '50%'
  },
  topItemInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  bottomItemInnerAdmin: {
    flex: 1,
    width: '100%',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row'
  },
  bottomItemInnerUser: {
    flex: 1,
    width: '100%',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  }
})
