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
import Intermediary from '../../tools/Intermediary'

export default class projectStatusDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 1250)
  }

  handleDeteleStatus = () => {
    db.collection('projectStatus')
      .where(
        'statusName',
        '==',
        this.props.navigation.state.params.fromProjectStatusStatusName
      )
      .where(
        'statusDetails',
        '==',
        this.props.navigation.state.params.fromProjectStatusStatusDetails
      )
      .where(
        'projectMembers',
        '==',
        this.props.navigation.state.params.fromProjectStatusProjectMembers
      )
      .where(
        'projectName',
        '==',
        this.props.navigation.state.params.fromProjectStatusProjectName
      )
      .where(
        'projectDetails',
        '==',
        this.props.navigation.state.params.fromProjectStatusProjectDetails
      )
      .where(
        'projectUnitConnector',
        '==',
        this.props.navigation.state.params.fromProjectStatusProjectConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete()
        })
      })
      .then(() => {
        this.props.navigation.push('Main')
      })
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={stylingClasses.container}>
          <View style={stylingClasses.top}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#212121',
                padding: 5,
                height: Dimensions.get('window').height / 20,
                borderRadius: 5
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: '#eee',
                  fontSize: Dimensions.get('window').height / 35,
                  fontWeight: '100'
                }}>
                {this.props.navigation.state.params.fromProjectStatusStatusName.toUpperCase()}
              </Text>
            </View>
            <View style={stylingClasses.textArea}>
              <ScrollView>
                <Text
                  style={{
                    padding: '2.5%',
                    fontSize: Dimensions.get('window').height / 41,
                    color: '#212121'
                  }}>
                  {
                    this.props.navigation.state.params
                      .fromProjectStatusStatusDetails
                  }
                </Text>
              </ScrollView>
            </View>
          </View>
          <View style={stylingClasses.bottom}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('editProjectStatus', {
                  fromProjectStatusDetailsStatusName: this.props.navigation
                    .state.params.fromProjectStatusStatusName,
                  fromProjectStatusDetailsStatusDetails: this.props.navigation
                    .state.params.fromProjectStatusStatusDetails,
                  fromProjectStatusDetailsProjectMembers: this.props.navigation
                    .state.params.fromProjectStatusProjectMembers,
                  fromProjectStatusDetailsProjectName: this.props.navigation
                    .state.params.fromProjectStatusProjectName,
                  fromProjectStatusDetailsProjectDetails: this.props.navigation
                    .state.params.fromProjectStatusProjectDetails,
                  fromProjectStatusDetailsProjectConnector: this.props
                    .navigation.state.params.fromProjectStatusProjectConnector
                })
              }}
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
                Durum Düzenle
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
                      onPress: this.handleDeteleStatus,
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
                Durumunu Sil
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
    backgroundColor: '#eee'
  },
  top: {
    top: '1.2%',
    height: '91.5%',
    backgroundColor: '#eee',
    padding: '3.5%'
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
    backgroundColor: '#eee',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.4,
    padding: 4,
    marginBottom: 5
  },
  bottomItemInner: {
    flex: 1,
    width: '100%',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  }
})
