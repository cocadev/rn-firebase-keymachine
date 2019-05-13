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

export default class editProjectStatus extends React.Component {
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
      editStatusDetails: this.props.navigation.state.params
        .fromProjectStatusDetailsStatusDetails,
      editStatusName: this.props.navigation.state.params
        .fromProjectStatusDetailsStatusName,
      isLoading: true,
      unitUsers: null
    }
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 1250)
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
              value={this.state.editStatusName.toUpperCase()}
              textAlignVertical="top"
              onChangeText={text => {
                this.setState({ editStatusName: text })
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
              value={this.state.editStatusDetails}
              multiline={true}
              numberOfLines={7}
              textAlignVertical="top"
              onChangeText={text => {
                this.setState({ editStatusDetails: text })
              }}
            />
          </ScrollView>

          <View>
            <TouchableOpacity
              style={stylingClasses.updateButton}
              onPress={() =>
                db
                  .collection('projectStatus')
                  .where(
                    'statusName',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectStatusDetailsStatusName
                  )
                  .where(
                    'statusDetails',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectStatusDetailsStatusDetails
                  )
                  .where(
                    'projectMembers',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectStatusDetailsProjectMembers
                  )
                  .where(
                    'projectName',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectStatusDetailsProjectName
                  )
                  .where(
                    'projectDetails',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectStatusDetailsProjectDetails
                  )
                  .where(
                    'projectUnitConnector',
                    '==',
                    this.props.navigation.state.params
                      .fromProjectStatusDetailsProjectConnector
                  )
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      doc.ref.update({
                        statusName: this.state.editStatusName,
                        statusDetails: this.state.editStatusDetails
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
