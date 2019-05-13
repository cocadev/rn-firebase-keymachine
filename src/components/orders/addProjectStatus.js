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
import Intermediary from '../../tools/Intermediary'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class addProjectStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statusName: '',
      statusDetails: '',
      isLoading: true
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
          <TextInput
            multiline={false}
            numberOfLines={1}
            placeholder="Durum Adı"
            style={stylingClasses.input}
            value={this.state.statusName}
            onChangeText={text => {
              this.setState({ statusName: text })
            }}
          />
          <ScrollView style={stylingClasses.inputBox}>
            <TextInput
              placeholder="Durum Detayları"
              style={stylingClasses.input2}
              value={this.state.statusDetails}
              multiline={true}
              numberOfLines={7}
              textAlignVertical="top"
              onChangeText={text => {
                this.setState({ statusDetails: text })
              }}
            />
          </ScrollView>
          <TouchableOpacity
            onPress={() =>
              db
                .collection('projectStatus')
                .add({
                  projectName: this.props.navigation.state.params
                    .fromProjectStatusProjectName,
                  projectDetails: this.props.navigation.state.params
                    .fromProjectStatusProjectDetails,
                  projectUnitConnector: this.props.navigation.state.params
                    .fromProjectStatusProjectConnector,
                  projectMembers: this.props.navigation.state.params
                    .fromProjectStatusProjectMembers,
                  statusName: this.state.statusName,
                  statusDetails: this.state.statusDetails
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
  }
})
