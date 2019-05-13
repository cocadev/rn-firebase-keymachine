import React from 'react'
import { View, Text, StyleSheet, Dimensions, NetInfo } from 'react-native'
import RootTabs from './src/navigation/Root'
import MainTabs from './src/navigation/Main'
import Icon from 'react-native-vector-icons/FontAwesome'
// @ts-ignore
import { DangerZone } from 'expo'

const { Lottie } = DangerZone

import * as firebase from 'firebase'

export class Loader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { animation: null }
  }
  static navigationOptions = {
    tabBarVisible: false
  }
  componentWillMount() {
    this._playAnimation()
  }
  _playAnimation = () => {
    if (!this.state.animation) {
      this._loadAnimationAsync()
    } else {
      this.animation.reset()
      this.animation.play()
    }
  }
  _loadAnimationAsync = async () => {
    // @ts-ignore
    let result = require('./assets/beforeApp.json')
    this.setState({ animation: result }, this._playAnimation)
  }
  render() {
    return (
      <View style={[styling.container, { height: '100%', width: '100%' }]}>
        {this.state.animation && (
          <Lottie
            loop={true}
            speed={0.7}
            ref={animation => {
              this.animation = animation
            }}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#880e4f'
            }}
            source={this.state.animation}
          />
        )}
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '30%'
          }}>
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 25,
              fontWeight: '300',
              color: '#eee'
            }}>
            The MIT LICENSE Copyright © 2019 Onur ÖZKAN
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '70%'
          }}>
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 20,
              fontWeight: '300',
              color: '#00E676',
              backgroundColor: '#00172e',
              padding: 10,
              borderRadius: 5,
              marginBottom: 10
            }}>
            Feedback > onurozkan.dev@outlook.com{'\n'}
          </Text>
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 20,
              fontWeight: '300',
              color: '#00E676',
              backgroundColor: '#00172e',
              padding: 10,
              borderRadius: 5
            }}>
            Other Projects > https://onurozkan.work
          </Text>
        </View>
        <View style={{ height: '0%', width: '0%' }}>
          <Icon size={0} name="link" color="#880e4f" />
        </View>
      </View>
    )
  }
}
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticationReady: false,
      isAuthenticated: null,
      isConnection: null
    }

    NetInfo.isConnected.addEventListener('connectionChange', (res) => {
      this.setState({
      isConnection: res
      })
    })

    console.disableYellowBox = true

    let onAuthStateChanged = user => {
      setTimeout(() => {
        this.setState({
          isAuthenticated: !!user
        })
      }, 5000)
    }
    firebase.auth().onAuthStateChanged(onAuthStateChanged)
  }

  render() {
    if (this.state.isAuthenticated === true && this.state.isConnection === true) {
      return <RootTabs />
    } else if (
      this.state.isAuthenticated === false &&
      this.state.isConnection === true
    ) {
      return <MainTabs />
    } else {
      return <Loader />
    }
  }
}

const styling = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
