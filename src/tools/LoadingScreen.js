import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
// @ts-ignore
import { DangerZone } from 'expo'

const { Lottie } = DangerZone

export default class LoadingScreen extends React.Component {
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
  render() {

    return (
      <View style={stylingClasses.container}>
         {this.state.animation && (
            <Lottie
            loop={true}
            speed={0.85}
              ref={animation => {
                this.animation = animation
              }}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#rgba(255,255,255,0.75)'
              }}
              source={this.state.animation}
            />
          )}
      </View>
    )
  }

  _loadAnimationAsync = async () => {
    // @ts-ignore
    let result = require('../../assets/mainLoad.json')
    this.setState({ animation: result }, this._playAnimation)
  }
}
const stylingClasses = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)'
  },
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
