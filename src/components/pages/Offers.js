import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
import db from '../../database/firebaseInit'
import Intermediary from '../../tools/Intermediary'

export default class Offers extends React.Component {
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
  constructor(props) {
    super(props)
    this.state = {
      offers: [],
      isLoading: true,
      hasOffer: false
    }
  }
  componentWillMount() {
    let holder = []
    db.collection('offers')
      .where(
        'projectConnector',
        '==',
        this.props.navigation.state.params.fromProjectsProjectKey
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            projectName: doc.data().projectName,
            projectConnector: doc.data().projectConnector,
            projectDetails: doc.data().projectDetails,
            sentBy: doc.data().sentBy
          }
          holder.push(data)
          this.setState({
            hasOffer: true
          })
        })
      })
      .then(() => {
        this.setState({
          offers: holder,
          isProjectsAvailable: true
        })
        setTimeout(() => {
          this.setState({
            isLoading: false
          })
        }, 1000)
      })
    db.collection('units')
      .where(
        'unitID',
        '==',
        this.props.navigation.state.params.fromProjectsProjectKey
      )
      .where('admins', 'array-contains', firebase.auth().currentUser.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            fromProjectsIsUserAdmin: true
          })
        })
      })
      .then(() => {
        if (this.state.fromProjectsIsUserAdmin === null) {
          this.setState({
            fromProjectsIsUserAdmin: false
          })
        }
      })
  }

  handleRejectAllOffers = () => {
    if (this.state.hasOffer) {
      db.collection('offers')
        .where(
          'projectConnector',
          '==',
          this.props.navigation.state.params.fromProjectsProjectKey
        )
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete()
          })
        })
        .then(() => this.props.navigation.push('Main'))
    } else {
      Alert.alert(
        '',
        'Geri çevrilecek herhangi bir teklif bulunamadı.',
        [{}, {}, {}],
        { cancelable: true }
      )
    }
  }
  render() {
    if (!this.state.isLoading) {
      return (
        <View style={stylingClasses.container}>
          <View style={stylingClasses.top}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ paddingTop: '2.5%' }}
              data={this.state.projects}
              renderItem={({ item }) => (
                <ScrollView style={stylingClasses.topItemInner}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('offersDetails', {
                        fromOffersProjectDetails: item.projectDetails,
                        fromOffersProjectName: item.projectName,
                        fromOffersProjectConnector: item.projectConnector,
                        fromOffersSentBy: item.sentBy
                      })
                    }>
                    <View style={stylingClasses.listItem}>
                      <Text
                        numberOfLines={1}
                        style={{
                          paddingLeft: 20
                        }}>
                        <Icon
                          name="file-o"
                          color={'#880e4f'}
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
              onPress={this.handleRejectAllOffers}
              style={[
                stylingClasses.bottomItemInnerAdmin,
                { backgroundColor: '#b71c1c', flexDirection: 'row' }
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
                  fontWeight: '100',
                  color: '#eee'
                }}>
                {'  '}
                Tüm Teklifleri Reddet
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
    top: '0.75%',
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
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  }
})
