import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView
} from 'react-native'
import db from '../../database/firebaseInit'
import Icon from 'react-native-vector-icons/FontAwesome'
import Intermediary from '../../tools/Intermediary'
import CustomMultiPicker from '../../tools/multipleSelect'

const uniqueArray = function(arrArg) {
  return arrArg.filter(function(elem, pos, arr) {
    return arr.indexOf(elem) == pos
  })
}

let secondHolder = []
let toDatabase = []
export default class editProject extends React.Component {
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
      editDetail: this.props.navigation.state.params
        .fromProjectDetailsProjectDetails,
      editName: this.props.navigation.state.params
        .fromProjectDetailsProjectName,
      projectMembers: null,
      isLoading: true,
      unitUsers: null
    }
  }

  componentWillMount() {
    let holder = []

    db.collection('users')
      .where(
        'units',
        'array-contains',
        this.props.navigation.state.params.fromProjectDetailsProjectConnector
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          holder.push(doc.data().email)
        })
      })
      .then(() => {
        this.setState({
          unitUsers: holder
        })
      })
      .then(() => {
        db.collection('projects')
          .where(
            'projectName',
            '==',
            this.props.navigation.state.params.fromProjectDetailsProjectName
          )
          .where(
            'projectConnector',
            '==',
            this.props.navigation.state.params
              .fromProjectDetailsProjectConnector
          )
          .where(
            'projectDetails',
            '==',
            this.props.navigation.state.params.fromProjectDetailsProjectDetails
          )
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              for (let k in doc.data().projectMembers) {
                secondHolder.push(doc.data().projectMembers[k])
              }
            })
            this.setState({
              projectMembers: secondHolder
            })
            setTimeout(() => {
              this.setState({
                isLoading: false
              })
            }, 1000)
          })
      })
  }

  componentWillUnmount() {
    secondHolder = []
    toDatabase = []
  }
  render() {
    if (this.state.isLoading === false) {
      return (
        <View style={stylingClasses.container}>
          <View style={stylingClasses.input}>
            <TextInput
              numberOfLines={1}
              multiline={false}
              style={[
                stylingClasses.input2,
                {
                  color: '#eee',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }
              ]}
              value={this.state.editName.toUpperCase()}
              textAlignVertical="top"
              onChangeText={text => {
                this.setState({ editName: text })
              }}
            />
          </View>
          <ScrollView style={stylingClasses.inputBox}>
            <TextInput
              style={[
                stylingClasses.input2,
                {
                  color: '#212121',
                  fontSize: Dimensions.get('window').height / 50,
                  fontWeight: '100'
                }
              ]}
              value={this.state.editDetail}
              multiline={true}
              numberOfLines={7}
              textAlignVertical="top"
              onChangeText={text => {
                this.setState({ editDetail: text })
              }}
            />
          </ScrollView>

          <CustomMultiPicker
            options={uniqueArray(
              this.state.unitUsers.concat(this.state.projectMembers)
            )}
            search={true}
            multiple={true}
            callback={res => {
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
            scrollViewHeight={Dimensions.get('window').height / 2.5}
            selected={secondHolder}
          />
          <View>
            <TouchableOpacity
              style={stylingClasses.updateButton}
              onPress={() =>
                db
                  .collection('projects')
                  .where(
                    'projectName',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectDetailsProjectName
                  )
                  .where(
                    'projectConnector',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectDetailsProjectConnector
                  )
                  .where(
                    'projectDetails',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectDetailsProjectDetails
                  )
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      doc.ref.update({
                        projectDetails: this.state.editDetail,
                        projectName: this.state.editName,
                        projectMembers: toDatabase
                      })
                    })
                  })
                  .then(() => {
                    db.collection('projectStatus')
                      .where(
                        'projectName',
                        '==',
                        this.props.navigation.state.params
                          .fromProjectDetailsProjectName
                      )
                      .where(
                        'projectUnitConnector',
                        '==',
                        this.props.navigation.state.params
                          .fromProjectDetailsProjectConnector
                      )
                      .where(
                        'projectDetails',
                        '==',
                        this.props.navigation.state.params
                          .fromProjectDetailsProjectDetails
                      )
                      .get()
                      .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                          doc.ref.update({
                            projectDetails: this.state.editDetail,
                            projectName: this.state.editName,
                            projectMembers: toDatabase
                          })
                        })
                      })
                  })
                  .then(() => this.props.navigation.push('Main'))
              }>
              <Text
                style={{
                  color: '#eee',
                  fontSize: Dimensions.get('window').height / 45,
                  fontWeight: '100'
                }}>
                GÜNCELLE
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
  input: {
    backgroundColor: '#212121',
    margin: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height / 17
  },
  input2: {
    margin: 10,
    paddingTop: '1%',
    paddingHorizontal: 8
  },
  inputBox: {
    height: Dimensions.get('window').height / 17
  },
  button: {
    height: Dimensions.get('window').height / 18.5,
    backgroundColor: '#212121',
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
  },
  updateButton: {
    height: Dimensions.get('window').height / 18.5,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5
  }
})
