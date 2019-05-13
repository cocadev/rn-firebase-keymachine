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

export default class projectStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      isProjectStatusAvailable: null,
      isUserAdmin: null,
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
    db.collection('projectStatus')
      .where(
        'projectUnitConnector',
        '==',
        this.props.navigation.state.params.fromProjectDetailsProjectConnector
      )
      .where(
        'projectDetails',
        '==',
        this.props.navigation.state.params.fromProjectDetailsProjectDetails
      )
      .where(
        'projectName',
        '==',
        this.props.navigation.state.params.fromProjectDetailsProjectName
      )
      .where(
        'projectMembers',
        '==',
        this.props.navigation.state.params.fromProjectDetailsProjectMembers
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            statusName: doc.data().statusName,
            statusDetails: doc.data().statusDetails
          }
          holder.push(data)
          this.setState({
            isProjectStatusAvailable: true
          })
        })
      })
      .then(() => {
        this.setState({
          list: holder
        })
      })

    db.collection('units')
      .where(
        'unitID',
        '==',
        this.props.navigation.state.params.fromProjectDetailsProjectConnector
      )
      .where('admins', 'array-contains', firebase.auth().currentUser.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            isUserAdmin: true
          })
          setTimeout(() => {
            this.setState({
              isLoading: false
            })
          }, 1000)
        })
      })
      .then(() => {
        if (this.state.isUserAdmin === null) {
          this.setState({
            isUserAdmin: false
          })
          setTimeout(() => {
            this.setState({
              isLoading: false
            })
          }, 1000)
        }
      })
  }

  render() {
    if (this.state.isLoading) {
      return <Intermediary />
    } else {
      if (this.state.isUserAdmin) {
        if (this.state.isProjectStatusAvailable === true)
          return (
            <View style={stylingClasses.container}>
              <View style={stylingClasses.top}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{ paddingTop: '0.5%' }}
                  data={this.state.list}
                  renderItem={({ item }) => (
                    <ScrollView style={stylingClasses.topItemInner}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.props.navigation.navigate(
                            'projectStatusDetails',
                            {
                              fromProjectStatusStatusName: item.statusName,
                              fromProjectStatusProjectMembers: this.props
                                .navigation.state.params
                                .fromProjectDetailsProjectMembers,
                              fromProjectStatusStatusDetails:
                                item.statusDetails,
                              fromProjectStatusProjectName: this.props
                                .navigation.state.params
                                .fromProjectDetailsProjectName,
                              fromProjectStatusProjectConnector: this.props
                                .navigation.state.params
                                .fromProjectDetailsProjectConnector,
                              fromProjectStatusProjectDetails: this.props
                                .navigation.state.params
                                .fromProjectDetailsProjectDetails
                            }
                          )
                        }}>
                        <View style={stylingClasses.listItem}>
                          <Text
                            style={{
                              color: '#f5f5f5',
                              paddingLeft: 20,
                              fontSize: Dimensions.get('window').height / 45,
                              fontWeight: '100'
                            }}>
                            <Icon
                              name="bar-chart-o"
                              color={'#880e4f'}
                              size={Dimensions.get('window').height / 38}
                            />
                            {'     '}
                            {item.statusName}
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
                    this.props.navigation.navigate('addProjectStatus', {
                      fromProjectStatusProjectConnector: this.props.navigation
                        .state.params.fromProjectDetailsProjectConnector,
                      fromProjectStatusProjectDetails: this.props.navigation
                        .state.params.fromProjectDetailsProjectDetails,
                      fromProjectStatusProjectName: this.props.navigation.state
                        .params.fromProjectDetailsProjectName,
                      fromProjectStatusProjectMembers: this.props.navigation
                        .state.params.fromProjectDetailsProjectMembers
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
                    Proje Durumu Ekle
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
                    Proje için herhangi bir durum eklenmemiştir.
                  </Text>
                </View>
              </View>
              <View style={stylingClasses.bottom}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('addProjectStatus', {
                      fromProjectStatusProjectConnector: this.props.navigation
                        .state.params.fromProjectDetailsProjectConnector,
                      fromProjectStatusProjectDetails: this.props.navigation
                        .state.params.fromProjectDetailsProjectDetails,
                      fromProjectStatusProjectName: this.props.navigation.state
                        .params.fromProjectDetailsProjectName,
                      fromProjectStatusProjectMembers: this.props.navigation
                        .state.params.fromProjectDetailsProjectMembers
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
                    Proje Durumu Ekle
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      } else {
        if (this.state.isProjectStatusAvailable === true)
          return (
            <View style={stylingClasses.container}>
              <View style={stylingClasses.top}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{ paddingTop: '0.5%' }}
                  data={this.state.list}
                  renderItem={({ item }) => (
                    <ScrollView style={stylingClasses.topItemInner}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.props.navigation.navigate(
                            'projectStatusDetails',
                            {
                              fromProjectStatusStatusName: item.statusName,
                              fromProjectStatusProjectMembers: this.props
                                .navigation.state.params
                                .fromProjectDetailsProjectMembers,
                              fromProjectStatusStatusDetails:
                                item.statusDetails,
                              fromProjectStatusProjectName: this.props
                                .navigation.state.params
                                .fromProjectDetailsProjectName,
                              fromProjectStatusProjectConnector: this.props
                                .navigation.state.params
                                .fromProjectDetailsProjectConnector,
                              fromProjectStatusProjectDetails: this.props
                                .navigation.state.params
                                .fromProjectDetailsProjectDetails
                            }
                          )
                        }}>
                        <View style={stylingClasses.listItem}>
                          <Text
                            style={{
                              color: '#f5f5f5',
                              paddingLeft: 20,
                              fontSize: Dimensions.get('window').height / 45,
                              fontWeight: '100'
                            }}>
                            <Icon
                              name="bar-chart-o"
                              color={'#880e4f'}
                              size={Dimensions.get('window').height / 38}
                            />
                            {'     '}
                            {item.statusName}
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
                    this.props.navigation.navigate('addProjectStatus', {
                      fromProjectStatusProjectConnector: this.props.navigation
                        .state.params.fromProjectDetailsProjectConnector,
                      fromProjectStatusProjectDetails: this.props.navigation
                        .state.params.fromProjectDetailsProjectDetails,
                      fromProjectStatusProjectName: this.props.navigation.state
                        .params.fromProjectDetailsProjectName,
                      fromProjectStatusProjectMembers: this.props.navigation
                        .state.params.fromProjectDetailsProjectMembers
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
                    Proje Durumu Ekle
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
                    Proje için herhangi bir durum eklenmemiştir.
                  </Text>
                </View>
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
    width: '100%',
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
