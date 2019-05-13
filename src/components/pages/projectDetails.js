import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import db from '../../database/firebaseInit'
import firebase from 'firebase'
import Intermediary from '../../tools/Intermediary'

export default class projectDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectMembers: null,
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

  handleDeleteProject = () => {
    db.collection('projects')
      .where(
        'projectConnector',
        '==',
        this.props.navigation.state.params.fromProjectsProjectConnector
      )
      .where(
        'projectName',
        '==',
        this.props.navigation.state.params.fromProjectsProjectName
      )
      .where(
        'projectDetails',
        '==',
        this.props.navigation.state.params.fromProjectsProjectDetails
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete()
        })
      })
      .then(() => {
        db.collection('projectStatus')
          .where(
            'projectUnitConnector',
            '==',
            this.props.navigation.state.params.fromProjectsProjectConnector
          )
          .where(
            'projectName',
            '==',
            this.props.navigation.state.params.fromProjectsProjectName
          )
          .where(
            'projectDetails',
            '==',
            this.props.navigation.state.params.fromProjectsProjectDetails
          )
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete()
            })
          })
      })
      .then(() => {
        this.props.navigation.push('Main')
      })
  }

  componentWillMount() {
    let holder = []
    db.collection('projects')
      .where(
        'projectConnector',
        '==',
        this.props.navigation.state.params.fromProjectsProjectConnector
      )
      .where(
        'projectName',
        '==',
        this.props.navigation.state.params.fromProjectsProjectName
      )
      .where(
        'projectDetails',
        '==',
        this.props.navigation.state.params.fromProjectsProjectDetails
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          for (let k in doc.data().projectMembers) {
            holder.push(doc.data().projectMembers[k])
          }
        })
        this.setState({
          projectMembers: holder
        })
        setTimeout(() => {
          this.setState({
            isLoading: false
          })
        }, 1250)
      })
  }
  render() {
    if (this.state.isLoading) {
      return <Intermediary />
    } else {
      if (this.props.navigation.state.params.fromProjectsIsUserAdmin === true) {
        return (
          <View style={stylingClasses.container}>
            <View style={stylingClasses.top}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#eee',
                  padding: 5,
                  height: Dimensions.get('window').height / 20,
                  borderRadius: 5
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#212121',
                    fontSize: Dimensions.get('window').height / 35,
                    fontWeight: '100'
                  }}>
                  {this.props.navigation.state.params.fromProjectsProjectName.toUpperCase()}
                </Text>
              </View>
              <View style={stylingClasses.textArea}>
                <ScrollView>
                  <Text
                    style={{
                      padding: '2.5%',
                      fontSize: Dimensions.get('window').height / 41,
                      color: '#eee'
                    }}>
                    {
                      this.props.navigation.state.params
                        .fromProjectsProjectDetails
                    }
                  </Text>
                </ScrollView>
              </View>
              <View style={stylingClasses.userArea}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.projectMembers}
                  renderItem={({ item }) => (
                    <ScrollView style={[stylingClasses.topItemInner]}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#eee',
                          marginBottom: 3
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: '#212121',
                            fontSize: Dimensions.get('window').height / 38.5,
                            fontWeight: '100'
                          }}>
                          {item}
                        </Text>
                      </View>
                    </ScrollView>
                  )}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('projectStatus', {
                    fromProjectDetailsProjectConnector: this.props.navigation
                      .state.params.fromProjectsProjectConnector,
                    fromProjectDetailsProjectDetails: this.props.navigation
                      .state.params.fromProjectsProjectDetails,
                    fromProjectDetailsProjectName: this.props.navigation.state
                      .params.fromProjectsProjectName,
                    fromProjectDetailsProjectMembers: this.state.projectMembers
                  })
                }
                style={[
                  stylingClasses.bottomItemInner,
                  {
                    backgroundColor: '#eee',
                    flexDirection: 'row'
                  }
                ]}>
                <Icon
                  name="bar-chart-o"
                  size={Dimensions.get('window').width / 15}
                  color="#212121"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    fontWeight: '500',
                    color: '#212121'
                  }}>
                  {'  '}Proje Gidişatı
                </Text>
              </TouchableOpacity>
            </View>
            <View style={stylingClasses.bottom}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.push('editProject', {
                    fromProjectDetailsProjectDetails: this.props.navigation
                      .state.params.fromProjectsProjectDetails,
                    fromProjectDetailsProjectConnector: this.props.navigation
                      .state.params.fromProjectsProjectConnector,
                    fromProjectDetailsProjectName: this.props.navigation.state
                      .params.fromProjectsProjectName
                  })
                }
                style={[
                  stylingClasses.bottomItemInnerAdmin,
                  { backgroundColor: '#00e676', flexDirection: 'row' }
                ]}>
                <Icon
                  name="edit"
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
                  Projeyi Düzenle
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'UYARI',
                    'Projeyi silmek istediğinize emin misiniz ?',
                    [
                      { text: 'Hayır', onPress: () => {} },
                      {
                        text: 'Evet',
                        onPress: this.handleDeleteProject,
                        style: 'cancel'
                      }
                    ]
                  )
                }
                style={[
                  stylingClasses.bottomItemInnerAdmin,
                  { backgroundColor: '#c62828', flexDirection: 'row' }
                ]}>
                <Icon
                  name="eraser"
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
                  Projeyi Sil
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      } else if (
        this.props.navigation.state.params.fromProjectsIsUserAdmin === false
      ) {
        return (
          <View style={stylingClasses.container}>
            <View style={stylingClasses.top}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#eee',
                  padding: 5,
                  height: Dimensions.get('window').height / 20,
                  borderRadius: 5
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#212121',
                    fontSize: Dimensions.get('window').height / 35,
                    fontWeight: '100'
                  }}>
                  {this.props.navigation.state.params.fromProjectsProjectName.toUpperCase()}
                </Text>
              </View>
              <View style={stylingClasses.textArea2}>
                <ScrollView>
                  <Text
                    style={{
                      padding: '2.5%',
                      fontSize: Dimensions.get('window').height / 41,
                      color: '#eee'
                    }}>
                    {
                      this.props.navigation.state.params
                        .fromProjectsProjectDetails
                    }
                  </Text>
                </ScrollView>
              </View>
              <View style={stylingClasses.userArea}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.projectMembers}
                  renderItem={({ item }) => (
                    <ScrollView style={[stylingClasses.topItemInner]}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#eee',
                          marginBottom: 3
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: '#212121',
                            fontSize: Dimensions.get('window').height / 38.5,
                            fontWeight: '100'
                          }}>
                          {item}
                        </Text>
                      </View>
                    </ScrollView>
                  )}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('projectStatus', {
                    fromProjectDetailsProjectConnector: this.props.navigation
                      .state.params.fromProjectsProjectConnector,
                    fromProjectDetailsProjectDetails: this.props.navigation
                      .state.params.fromProjectsProjectDetails,
                    fromProjectDetailsProjectName: this.props.navigation.state
                      .params.fromProjectsProjectName,
                    fromProjectDetailsProjectMembers: this.state.projectMembers
                  })
                }
                style={[
                  stylingClasses.bottomItemInner,
                  {
                    backgroundColor: '#eee',
                    flexDirection: 'row'
                  }
                ]}>
                <Icon
                  name="bar-chart-o"
                  size={Dimensions.get('window').width / 15}
                  color="#212121"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    fontWeight: '500',
                    color: '#212121'
                  }}>
                  {'  '}Proje Gidişatı
                </Text>
              </TouchableOpacity>
            </View>
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
    top: '1.2%',
    height: '91.5%',
    backgroundColor: '#eee',
    paddingLeft: '3.5%',
    paddingRight: '3.5%',
    paddingTop: '1%',
    paddingBottom: '1%'
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
  },
  textArea: {
    backgroundColor: '#212121',
    borderRadius: 10,
    height: Dimensions.get('window').height / 2.6,
    padding: 4,
    marginBottom: 5
  },
  textArea2: {
    backgroundColor: '#212121',
    borderRadius: 10,
    height: Dimensions.get('window').height / 2.15,
    padding: 4,
    marginBottom: 5
  },
  userArea: {
    backgroundColor: '#880e4f',
    borderRadius: 10,
    height: Dimensions.get('window').height / 3.9,
    paddingTop: '1.5%',
    paddingBottom: '0.25%'
  },
  bottomItemInner: {
    flex: 1,
    width: '100%',
    marginTop: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  }
})
