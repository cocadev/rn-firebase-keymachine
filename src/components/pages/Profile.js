import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native'
import * as firebase from 'firebase'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  render() {
    return (
      <View style={stylingClasses.container}>
        <ScrollView style={stylingClasses.childContainer}>
          <View style={stylingClasses.top}>
            <View style={stylingClasses.pictureField}>
              <Icon
                style={stylingClasses.pictureShape}
                size={Dimensions.get('window').width / 1.85}
                name="user-circle-o"
                color="#13161E"
              />
            </View>
            <View
              style={{
                height: Dimensions.get('window').height / 2.17,
                margin: 1,
                backgroundColor: '#13161E',
                borderBottomLeftRadius: 7,
                borderBottomRightRadius: 7
              }}>
              <View style={stylingClasses.menuLayout}>
                <View style={stylingClasses.menuInner}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: Dimensions.get('window').width / 11.75,
                      color: '#bdbdbd'
                    }}>
                    {' '}
                    {
                      this.props.navigation.state.params.fromMainUsernameData
                    }{' '}
                    {this.props.navigation.state.params.fromMainUsersurnameData.toUpperCase()}
                  </Text>
                </View>
                <View style={stylingClasses.menuInner}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: Dimensions.get('window').width / 22.5,
                      color: '#bdbdbd'
                    }}>
                    {' '}
                    {this.props.navigation.state.params.fromMainFieldData}
                  </Text>
                </View>
                <View style={stylingClasses.menuInner}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: Dimensions.get('window').width / 22.5,
                      color: '#bdbdbd'
                    }}>
                    {' '}
                    {this.props.navigation.state.params.fromMainEmailData}
                  </Text>
                </View>
              </View>
              <View style={stylingClasses.menuLayout2}>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      this.props.navigation.state.params.fromMainUnitCounter !==
                      0
                    ) {
                      this.props.navigation.push('Homepage')
                    } else {
                      Alert.alert(
                        '',
                        'Hesabınız herhangi bir sınıfta yer almamaktadır.',
                        [
                          {
                            text: 'Tamam',
                            onPress: () => {},
                            style: 'cancel'
                          }
                        ]
                      )
                    }
                  }}
                  style={stylingClasses.menuInner2}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#bdbdbd',
                      fontSize: Dimensions.get('window').width / 19
                    }}>
                    SINIFLAR
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      textAlign: 'center',
                      fontSize: Dimensions.get('window').width / 18,
                      color: '#bdbdbd'
                    }}>
                    [{' '}
                    <Text style={{ color: '#ffd600' }}>
                      {this.props.navigation.state.params.fromMainUnitCounter}
                    </Text>{' '}
                    ]
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      this.props.navigation.state.params
                        .fromMainOfferCounter !== 0
                    ) {
                      this.props.navigation.navigate('userOffersList')
                    } else {
                      Alert.alert(
                        '',
                        'Hesabınız herhangi teklifte bulunmamıştır.',
                        [
                          {
                            text: 'Tamam',
                            onPress: () => {},
                            style: 'cancel'
                          }
                        ]
                      )
                    }
                  }}
                  style={stylingClasses.menuInner2}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#bdbdbd',
                      fontSize: Dimensions.get('window').width / 19
                    }}>
                    TEKLİFLER
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      textAlign: 'center',
                      fontSize: Dimensions.get('window').width / 18,
                      color: '#bdbdbd'
                    }}>
                    [{' '}
                    <Text style={{ color: '#ffd600' }}>
                      {this.props.navigation.state.params.fromMainOfferCounter}
                    </Text>{' '}
                    ]
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      this.props.navigation.state.params
                        .fromMainProjectCounter !== 0
                    ) {
                      this.props.navigation.navigate('userProjectsList')
                    } else {
                      Alert.alert(
                        '',
                        'Hesabınız herhangi bir projede yer almamaktadır.',
                        [
                          {
                            text: 'Tamam',
                            onPress: () => {},
                            style: 'cancel'
                          }
                        ]
                      )
                    }
                  }}
                  style={stylingClasses.menuInner2}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#bdbdbd',
                      fontSize: Dimensions.get('window').width / 19
                    }}>
                    PROJELER
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      textAlign: 'center',
                      fontSize: Dimensions.get('window').width / 18,
                      color: '#bdbdbd'
                    }}>
                    [{' '}
                    <Text style={{ color: '#ffd600' }}>
                      {
                        this.props.navigation.state.params
                          .fromMainProjectCounter
                      }
                    </Text>{' '}
                    ]
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={stylingClasses.middle}>
            <View style={stylingClasses.topItemInner}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'UYARI',
                    'Oturumu kapatmak istediğinize emin misiniz?',
                    [
                      {
                        text: 'Hayır',
                        onPress: () => {},
                        style: 'cancel'
                      },
                      {
                        text: 'Evet',
                        onPress: () => {
                          firebase
                            .auth()
                            .signOut()
                            .then(() => {
                              this.props.navigation.navigate('Login')
                            })
                        },
                        style: 'cancel'
                      }
                    ]
                  )
                }
                style={stylingClasses.exitButton}>
                <Icon
                  size={Dimensions.get('window').width / 11.75}
                  name="minus-circle"
                  color="#212121"
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    fontWeight: 'bold'
                  }}>
                  {'  '}OTURUMU KAPAT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={stylingClasses.bottom}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('profileSettings')}
            style={[
              stylingClasses.bottomItemInner,
              { backgroundColor: '#eee', flexDirection: 'row' }
            ]}>
            <Icon
              name="gears"
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
              Hesap Ayarları
            </Text>
          </TouchableOpacity>
        </View>
        <View style={stylingClasses.navigation}>
          <View style={stylingClasses.navigationInner}>
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Homepage')}
              style={stylingClasses.navigationItem}>
              <Icon
                size={Dimensions.get('window').width / 11.75}
                name="home"
                color="#f5f5f5"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
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
}
const stylingClasses = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13161E'
  },
  menuLayout: {
    width: '100%',
    height: Dimensions.get('window').height / 4.5
  },
  menuLayout2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: Dimensions.get('window').height / 4.5
  },
  menuInner: {
    height: Dimensions.get('window').height / 6,
    marginBottom: 2,
    flex: 1,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  menuInner2: {
    height: Dimensions.get('window').height / 6,
    marginLeft: 1,
    marginRight: 1,
    borderRadius: 3,
    width: '50%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121'
  },
  childContainer: {
    backgroundColor: '#13161E',
    padding: 20,
    height: '85.5%'
  },
  top: {
    top: '3.85%',
    height: Dimensions.get('window').height / 1.27,
    borderRadius: 8,
    backgroundColor: '#13161E',
    paddingBottom: '3.5%'
  },
  pictureField: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    height: Dimensions.get('window').height / 2.81,
    backgroundColor: '#13161E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 3,
    paddingTop: 3
  },
  pictureShape: {
    backgroundColor: '#00E676',
    padding: 1.5,
    borderRadius: 200
  },
  middle: {
    height: Dimensions.get('window').height / 7.5,
    backgroundColor: '#13161E',
    borderRadius: 7
  },
  topItemInner: {
    width: '100%',
    position: 'relative'
  },
  bottom: {
    height: '8.5%',
    backgroundColor: '#880e4f',
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
    width: '100%',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  exitButton: {
    height: Dimensions.get('window').height / 14,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  // Custom navigation

  navigation: {
    height: '6%',
    backgroundColor: '#880e4f',
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
