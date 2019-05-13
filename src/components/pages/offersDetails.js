import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions
} from 'react-native'
import db from '../../database/firebaseInit'
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/FontAwesome'
import Intermediary from '../../tools/Intermediary'

export default class offersDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUserAdmin: null
    }
  }
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  componentWillMount() {
    db.collection('units')
      .where(
        'unitID',
        '==',
        this.props.navigation.state.params.fromOffersProjectConnector
      )
      .where('admins', 'array-contains', firebase.auth().currentUser.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            isUserAdmin: true
          })
        })
      })
      .then(() => {
        if (this.state.isUserAdmin === null) {
          this.setState({
            isUserAdmin: false
          })
        }
      })
  }

  handleApproveProjectOffer = () => {
    db.collection('projects')
      .add({
        projectName: this.props.navigation.state.params.fromOffersProjectName,
        projectDetails: this.props.navigation.state.params
          .fromOffersProjectDetails,
        projectConnector: this.props.navigation.state.params
          .fromOffersProjectConnector,
        projectMembers: [this.props.navigation.state.params.fromOffersSentBy]
      })
      .then(() => {
        db.collection('offers')
          .where(
            'projectConnector',
            '==',
            this.props.navigation.state.params.fromOffersProjectConnector
          )
          .where(
            'projectName',
            '==',
            this.props.navigation.state.params.fromOffersProjectName
          )
          .where(
            'projectDetails',
            '==',
            this.props.navigation.state.params.fromOffersProjectDetails
          )
          .where(
            'sentBy',
            '==',
            this.props.navigation.state.params.fromOffersSentBy
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
      })
  }

  handleRejectProjectOffer = () => {
    db.collection('offers')
      .where(
        'projectConnector',
        '==',
        this.props.navigation.state.params.fromOffersProjectConnector
      )
      .where(
        'projectName',
        '==',
        this.props.navigation.state.params.fromOffersProjectName
      )
      .where(
        'projectDetails',
        '==',
        this.props.navigation.state.params.fromOffersProjectDetails
      )
      .where(
        'sentBy',
        '==',
        this.props.navigation.state.params.fromOffersSentBy
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
    if (this.state.isUserAdmin === true) {
      return (
        <View style={stylingClasses.container}>
          <View style={stylingClasses.top}>
            <ScrollView style={stylingClasses.projectDetailBox}>
              <Text
                style={{
                  padding: '2.5%',
                  fontSize: Dimensions.get('window').height / 41,
                  color: '#eee'
                }}>
                {this.props.navigation.state.params.fromOffersProjectDetails}
              </Text>
            </ScrollView>
          </View>
          <View style={stylingClasses.bottom}>
            <TouchableOpacity
              onPress={this.handleApproveProjectOffer}
              style={[
                stylingClasses.bottomItemInnerAdmin,
                { backgroundColor: '#00e676' }
              ]}>
              <Icon
                name="check"
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
                Teklifi Onayla
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'UYARI',
                  'Yapacağınız işlemin kalıcı etkileri olacaktır. Onaylıyor musunuz ?',
                  [
                    {
                      text: 'Hayır',
                      onPress: () => {},
                      style: 'cancel'
                    },
                    {
                      text: 'Evet',
                      onPress: () => {
                        this.handleRejectProjectOffer()
                      },
                      style: 'cancel'
                    }
                  ]
                )
              }
              style={[
                stylingClasses.bottomItemInnerAdmin,
                { backgroundColor: '#b71c1c' }
              ]}>
              <Icon
                name="remove"
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
                Teklifi Reddet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else if (this.state.isUserAdmin === false) {
      return (
        <View style={stylingClasses.container}>
          <View style={stylingClasses.top}>
            <ScrollView style={stylingClasses.projectDetailBox}>
              <Text
                style={{
                  padding: '2.5%',
                  fontSize: Dimensions.get('window').height / 41,
                  color: '#eee'
                }}>
                {this.props.navigation.state.params.fromOffersProjectDetails}
              </Text>
            </ScrollView>
          </View>
          <View style={stylingClasses.bottom}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'UYARI',
                  'Yapacağınız işlemin kalıcı etkileri olacaktır. Onaylıyor musunuz ?',
                  [
                    {
                      text: 'Hayır',
                      onPress: () => {},
                      style: 'cancel'
                    },
                    {
                      text: 'Evet',
                      onPress: () => {
                        this.handleRejectProjectOffer()
                      },
                      style: 'cancel'
                    }
                  ]
                )
              }
              style={[
                stylingClasses.bottomItemInnerAdmin,
                { backgroundColor: '#b71c1c' }
              ]}>
              <Icon
                name="remove"
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
                Teklifi İptal Et
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
    top: '3.25%',
    height: '91.5%',
    backgroundColor: '#eee',
    paddingBottom: '3.5%',
    paddingRight: 15,
    paddingLeft: 15
  },
  projectDetailBox: {
    backgroundColor: '#212121',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.5,
    padding: 4,
    marginBottom: 10
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
