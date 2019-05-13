import React from 'react'
import {
  View,
  ScrollView,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import db from '../../database/firebaseInit'
import firebase from 'firebase'
import Intermediary from '../../tools/Intermediary'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class userProjectsList extends React.Component {
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
      list: [],
      isLoading: true,
      unitNames: []
    }
  }

  componentWillMount() {
    let holder = []
    db.collection('projects')
      .where(
        'projectMembers',
        'array-contains',
        firebase.auth().currentUser.email
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            projectName: doc.data().projectName,
            projectDetails: doc.data().projectDetails,
            projectConnector: doc.data().projectConnector
          }
          holder.push(data)
        })
      })
      .then(() => {
        this.setState({
          list: holder
        })
        setTimeout(() => {
          this.setState({
            isLoading: false
          })
        }, 1000)
      })
  }
  render() {
    if (!this.state.isLoading) {
      return (
        <View style={stylingClasses.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: '2.5%' }}
            data={this.state.list}
            renderItem={({ item }) => (
              <ScrollView style={stylingClasses.topItemInner}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('projectDetails', {
                      fromProjectsProjectDetails: item.projectDetails,
                      fromProjectsProjectConnector: item.projectConnector,
                      fromProjectsProjectName: item.projectName
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
                        name="folder-o"
                        color={'#00E676'}
                        size={Dimensions.get('window').height / 38}
                      />
                      {'     '}
                      {item.projectName}
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
