import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native'
import db from '../../database/firebaseInit'
import firebase from 'firebase'
import Intermediary from '../../tools/Intermediary'
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomMultiPicker from '../../tools/multipleSelect'

let userList = []
let toDatabase = []

export default class addProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectName: '',
      projectDetails: '',
      isLoadingFinish: false,
      users: [],
      isLoading: true,
      menuPicker: true
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

  componentWillMount() {
    let holder = []
    db.collection('users')
      .where(
        'units',
        'array-contains',
        this.props.navigation.state.params.fromProjectsProjectKey
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          userList.push(doc.data().email)
        })
      })
      .then(() => {
        this.setState({
          users: holder
        })
        setTimeout(() => {
          this.setState({
            isLoading: false
          })
        }, 1000)
      })
  }

  onAddOfferPress = () => {
    db.collection('offers')
      .add({
        projectName: this.state.projectName,
        projectDetails: this.state.projectDetails,
        projectConnector: this.props.navigation.state.params
          .fromProjectsProjectKey,
        sentBy: firebase.auth().currentUser.email
      })
      .then(() => {
        this.props.navigation.push('Main')
      })
  }

  componentWillUnmount() {
    userList = []
    toDatabase = []
  }
  render() {
    if (
      this.props.navigation.state.params.fromProjectsIsUserAdmin === true &&
      this.state.isLoading === false
    ) {
      return (
        <View style={stylingClasses.container}>
          <TextInput
            multiline={false}
            numberOfLines={1}
            placeholder="Proje Adı"
            style={stylingClasses.input}
            value={this.state.projectName}
            onChangeText={text => {
              this.setState({ projectName: text })
            }}
          />
          <ScrollView style={stylingClasses.inputBox}>
            <TextInput
              placeholder="Proje Detayı"
              style={stylingClasses.input2}
              value={this.state.projectDetails}
              multiline={true}
              numberOfLines={7}
              textAlignVertical="top"
              onChangeText={text => {
                this.setState({ projectDetails: text })
              }}
            />
          </ScrollView>
          <CustomMultiPicker
            options={userList}
            search={true}
            multiple={true}
            callback={(res)=> {
              toDatabase = res
            }}
            placeholder={'Arama'}
            placeholderTextColor={'#757575'}
            returnValue={'label'}
            rowBackgroundColor={'#eee'}
            rowHeight={Dimensions.get('window').height / 25}
            rowRadius={Dimensions.get('window').height / 40}
            iconColor={'#212121'}
            iconSize={Dimensions.get('window').height / 29}
            selectedIconName={'ios-checkmark-circle-outline'}
            scrollViewHeight={Dimensions.get('window').height / 1.7}
            selected={[]}
          />
          <TouchableOpacity
            onPress={() =>
              db
                .collection('projects')
                .add({
                  projectName: this.state.projectName,
                  projectDetails: this.state.projectDetails,
                  projectConnector: this.props.navigation.state.params
                    .fromProjectsProjectKey,
                  projectMembers: toDatabase
                })
                .then(() => {
                  this.props.navigation.push('Main')
                })
            }>
            <View style={stylingClasses.button}>
              <Text style={stylingClasses.buttonText}>TAMAM</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    } else if (
      this.props.navigation.state.params.fromProjectsIsUserAdmin === false &&
      this.state.isLoading === false
    ) {
      return (
        <View style={stylingClasses.container}>
          <TextInput
            placeholder="Proje Adı"
            style={stylingClasses.input}
            value={this.state.projectName}
            onChangeText={text => {
              this.setState({ projectName: text })
            }}
          />
          <TextInput
            placeholder="Proje Detayı"
            style={stylingClasses.input2}
            value={this.state.projectDetails}
            multiline={true}
            numberOfLines={7}
            textAlignVertical="top"
            onChangeText={text => {
              this.setState({ projectDetails: text })
            }}
          />
          <TouchableOpacity onPress={this.onAddOfferPress}>
            <View style={stylingClasses.button}>
              <Text style={stylingClasses.buttonText}>TAMAM</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    } else {
      return <Intermediary />
    }
  }
}
const stylingClasses = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    margin: 10,
    paddingHorizontal: 8,
    height: Dimensions.get('window').height / 17,
    color: '#212121',
    fontSize: Dimensions.get('window').height / 45,
    fontWeight: '100',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input2: {
    backgroundColor: 'white',
    margin: 10,
    paddingTop: '1%',
    paddingHorizontal: 8,
    color: '#212121',
    fontSize: Dimensions.get('window').height / 50,
    fontWeight: '100'
  },
  inputBox: {
    height: Dimensions.get('window').height / 17
  },
  button: {
    height: Dimensions.get('window').height / 18.5,
    backgroundColor:'#212121',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#eee',
    fontSize: Dimensions.get('window').height / 45,
    fontWeight: '100'
  },
  container: {
    backgroundColor: '#eee',
    flex: 1
  }
})
