import LoginScreen from '../auth/LoginScreen'
import SignupScreen from '../auth/SignupScreen'
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen'
import { bottomAnimationConfig } from '../tools/transitions'

import { createStackNavigator, createAppContainer } from 'react-navigation'

const MainTabs = createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Signup: {
      screen: SignupScreen
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen
    }
  },
  {
    transitionConfig: bottomAnimationConfig,
    defaultNavigationOptions: {
      header: null
    }
  }
)

export default createAppContainer(MainTabs)
