import React from 'react'
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
import db from '../../database/firebaseInit'
import Intermediary from '../../tools/Intermediary'

export default class Projects extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: [],
      isProjectsAvailable: null,
      isUserAdmin: this.props.navigation.state.params
        .fromUnitDashboardIsUserAdmin,
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
            color="#eee"
          />
        </TouchableOpacity>
      )
    }
  }

  componentWillMount() {
    let holder = []
    db.collection('projects')
      .where(
        'projectConnector',
        '==',
        this.props.navigation.state.params.fromUnitDashboardProjectConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            projectName: doc.data().projectName,
            projectConnector: doc.data().projectConnector,
            projectDetails: doc.data().projectDetails
          }
          holder.push(data)
          this.setState({
            isProjectsAvailable: true
          })
        })
      })
      .then(() => {
        this.setState({
          projects: holder,
          isLoading: false
        })
      })
  }

  render() {
    if (this.state.isLoading) {
      return <Intermediary />
    } else {
      if (this.state.isUserAdmin) {
        if (this.state.isProjectsAvailable === true)
          return (
            <View style={stylingClasses.container}>
              <View style={stylingClasses.top}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{ paddingTop: '0.5%' }}
                  data={this.state.projects}
                  renderItem={({ item }) => (
                    <ScrollView style={stylingClasses.topItemInner}>
                      <TouchableWithoutFeedback
                        onPress={() =>
                          this.props.navigation.navigate('projectDetails', {
                            fromProjectsProjectDetails: item.projectDetails,
                            fromProjectsProjectConnector: item.projectConnector,
                            fromProjectsProjectName: item.projectName,
                            fromProjectsIsUserAdmin: this.state.isUserAdmin
                          })
                        }>
                        <View style={stylingClasses.listItem}>
                          <Text
                            style={{
                              color: '#f5f5f5',
                              paddingLeft: 20,
                              fontSize: Dimensions.get('window').height / 45,
                              fontWeight: '100'
                            }}>
                            <Icon
                              name="book"
                              color={'#00E676'}
                              size={Dimensions.get('window').height / 38}
                            />
                            {'     '}
                            {item.projectName}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </ScrollView>
                  )}
                />
              </View>
              <View style={stylingClasses.bottom}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('addProject', {
                      fromProjectsProjectKey: this.props.navigation.state.params
                        .fromUnitDashboardProjectConnector,
                      fromProjectsIsUserAdmin: this.state.isUserAdmin
                    })
                  }
                  style={[
                    stylingClasses.bottomItemInnerAdmin,
                    { backgroundColor: '#eee', flexDirection: 'row' }
                  ]}>
                  <Icon
                    name="plus-square-o"
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
                    Proje Ekle
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Offers', {
                      fromProjectsProjectKey: this.props.navigation.state.params
                        .fromUnitDashboardProjectConnector
                    })
                  }
                  style={[
                    stylingClasses.bottomItemInnerAdmin,
                    { backgroundColor: '#1976d2', flexDirection: 'row' }
                  ]}>
                  <Icon
                    name="dropbox"
                    size={Dimensions.get('window').width / 20}
                    color="#eee"
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: Dimensions.get('window').width / 30,
                      fontWeight: '500',
                      color: '#eee'
                    }}>
                    {'  '}
                    Proje Davetleri
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        else {
          return (
            <View style={stylingClasses.container}>
              <View style={stylingClasses.top}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      fontSize: Dimensions.get('window').width / 23,
                      fontWeight: '100',
                      color: '#212121'
                    }}>
                    Sınıfa kayıtlı herhangi bir proje bulunmamaktadır.
                  </Text>
                </View>
              </View>
              <View style={stylingClasses.bottom}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('addProject', {
                      fromProjectsProjectKey: this.props.navigation.state.params
                        .fromUnitDashboardProjectConnector,
                      fromProjectsIsUserAdmin: this.state.isUserAdmin
                    })
                  }
                  style={[
                    stylingClasses.bottomItemInnerAdmin,
                    { backgroundColor: '#eee', flexDirection: 'row' }
                  ]}>
                  <Icon
                    name="plus-square-o"
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
                    Proje Ekle
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Offers', {
                      fromProjectsProjectKey: this.props.navigation.state.params
                        .fromUnitDashboardProjectConnector
                    })
                  }
                  style={[
                    stylingClasses.bottomItemInnerAdmin,
                    { backgroundColor: '#1976d2', flexDirection: 'row' }
                  ]}>
                  <Icon
                    name="dropbox"
                    size={Dimensions.get('window').width / 20}
                    color="#eee"
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: Dimensions.get('window').width / 30,
                      fontWeight: '500',
                      color: '#eee'
                    }}>
                    {'  '}
                    Proje Davetleri
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      } else {
        if (this.state.isProjectsAvailable === true)
          return (
            <View style={stylingClasses.container}>
              <View style={stylingClasses.top}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{ paddingTop: '0.5%' }}
                  data={this.state.projects}
                  renderItem={({ item }) => (
                    <ScrollView style={stylingClasses.topItemInner}>
                      <TouchableWithoutFeedback
                        onPress={() =>
                          this.props.navigation.navigate('projectDetails', {
                            fromProjectsProjectDetails: item.projectDetails,
                            fromProjectsProjectConnector: item.projectConnector,
                            fromProjectsProjectName: item.projectName,
                            fromProjectsIsUserAdmin: this.state.isUserAdmin
                          })
                        }>
                        <View style={stylingClasses.listItem}>
                          <Text
                            style={{
                              color: '#f5f5f5',
                              paddingLeft: 20,
                              fontSize: Dimensions.get('window').height / 45,
                              fontWeight: '100'
                            }}>
                            <Icon
                              name="book"
                              color={'#00E676'}
                              size={Dimensions.get('window').height / 38}
                            />
                            {'     '}
                            {item.projectName}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </ScrollView>
                  )}
                />
              </View>
              <View style={stylingClasses.bottom}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('addProject', {
                      fromProjectsProjectKey: this.props.navigation.state.params
                        .fromUnitDashboardProjectConnector,
                      fromProjectsIsUserAdmin: this.state.isUserAdmin
                    })
                  }
                  style={[
                    stylingClasses.bottomItemInnerUser,
                    { backgroundColor: '#eee', flexDirection: 'row' }
                  ]}>
                  <Icon
                    name="handshake-o"
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
                    Proje Teklifi Gönder
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        else {
          return (
            <View style={stylingClasses.container}>
              <View style={stylingClasses.top}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      fontSize: Dimensions.get('window').width / 23,
                      fontWeight: '100',
                      color: '#212121'
                    }}>
                    Sınıfa kayıtlı herhangi bir proje bulunmamaktadır.
                  </Text>
                </View>
              </View>
              <View style={stylingClasses.bottom}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('addProject', {
                      fromProjectsProjectKey: this.props.navigation.state.params
                        .fromUnitDashboardProjectConnector,
                      fromProjectsIsUserAdmin: this.state.isUserAdmin
                    })
                  }
                  style={[
                    stylingClasses.bottomItemInnerUser,
                    { backgroundColor: '#eee', flexDirection: 'row' }
                  ]}>
                  <Icon
                    name="handshake-o"
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
                    Proje Teklifi Gönder
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
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
    top: '1%',
    height: '91.5%',
    backgroundColor: '#eee',
    paddingBottom: '3.5%'
  },
  topItemInner: {
    width: '100%',
    position: 'relative',
    paddingLeft: 20,
    paddingRight: 20
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
    width: '50%',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  bottomItemInnerUser: {
    flex: 1,
    width: '100%',
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
    justifyContent: 'center',
    flex: 1
  }
})
