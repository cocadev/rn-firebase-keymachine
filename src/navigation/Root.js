import Main from '../components/Main'
import Profile from '../components/pages/Profile'
import Projects from '../components/pages/Projects'
import Offers from '../components/pages/Offers'
import Users from '../components/pages/Users'

import offersDetails from '../components/pages/offersDetails'
import editProfile from '../components/orders/editProfile'
import changePassword from '../components/orders/changePassword'
import profileSettings from '../components/pages/profileSettings'
import userProjectsList from '../components/pages/userProjectsList'
import userOffersList from '../components/pages/userOffersList'
import editUnit from '../components/orders/editUnit'
import addProjectStatus from '../components/orders/addProjectStatus'
import editProjectStatus from '../components/orders/editProjectStatus'

import projectStatus from '../components/pages/projectStatus'
import projectStatusDetails from '../components/pages/projectStatusDetails'
import projectDetails from '../components/pages/projectDetails'
import unitDashboard from '../components/pages/unitDashboard'
import newClass from '../components/orders/newClass'
import joinToUnit from '../components/orders/joinToUnit'
import addProject from '../components/orders/addProject'
import editProject from '../components/orders/editProject'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { fadeAnimationConfig, noAnimation } from '../tools/transitions'

const homeNav = createStackNavigator(
  {
    //Pages

    Main: {
      screen: Main
    },
    unitDashboard: {
      screen: unitDashboard
    },
    Projects: {
      screen: Projects
    },
    Offers: {
      screen: Offers
    },
    offersDetails: {
      screen: offersDetails
    },
    projectDetails: {
      screen: projectDetails
    },
    projectStatus: {
      screen: projectStatus
    },
    projectStatusDetails: {
      screen: projectStatusDetails
    },

    //Orders

    newClass: {
      screen: newClass
    },
    joinToUnit: {
      screen: joinToUnit
    },
    addProject: {
      screen: addProject
    },
    editProject: {
      screen: editProject
    },
    Users: {
      screen: Users
    },
    editUnit: {
      screen: editUnit
    },
    addProjectStatus : {
      screen: addProjectStatus
    },
    editProjectStatus: {
      screen: editProjectStatus
    }
  },
  {
    transitionConfig: fadeAnimationConfig
  }
)
const profileNav = createStackNavigator(
  {
    Profile: {
      screen: Profile
    },
    userProjectsList: {
      screen: userProjectsList
    },
    userOffersList: {
      screen: userOffersList
    },
    profileSettings: {
      screen: profileSettings
    },
    editProfile: {
      screen: editProfile
    },
    changePassword: {
      screen: changePassword
    }
  },
  {
    transitionConfig: fadeAnimationConfig
  }
)

const stickThem = createStackNavigator(
  {
    Homepage: {
      screen: homeNav
    },
    profilePage: {
      screen: profileNav
    }
  },
  {
    initialRouteName: 'Homepage',
    transitionConfig: () => noAnimation(),
    defaultNavigationOptions: {
      header: null
    }
  }
)

export default createAppContainer(stickThem)
