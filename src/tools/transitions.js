import { Animated, Easing } from 'react-native'

function noAnimation() {
  return {
    transitionSpec: {
      duration: 0,
      easing: Easing.out(Easing.poly(0)),
      timing: Animated.timing,
      useNativeDriver: false
    },
    screenInterpolator: ({ position, scene }) => {
      const { index } = scene

      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1]
      })

      return { opacity }
    }
  }
}

const customTransition = (index, position) => {
  const sceneRange = [index - 1, index]
  const outputOpacity = [0, 1]
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputOpacity
  })

  return {
    opacity: transition
  }
}

const customTransition2 = (index, position, height) => {
  const sceneRange = [index - 1, index]
  const outputHeight = [height, 0]
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputHeight
  })
  return {
    transform: [{ translateY: transition }]
  }
}

const fadeAnimationConfig = () => {
  return {
    screenInterpolator: sceneProps => {
      const position = sceneProps.position
      const scene = sceneProps.scene
      const index = scene.index
      return customTransition(index, position)
    }
  }
}

const bottomAnimationConfig = () => {
  return {
    screenInterpolator: sceneProps => {
      const position = sceneProps.position
      const scene = sceneProps.scene
      const index = scene.index
      const height = sceneProps.layout.initHeight
      return customTransition2(index, position, height)
    }
  }
}

export { bottomAnimationConfig, fadeAnimationConfig, noAnimation }
