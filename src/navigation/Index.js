import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import ViewNotes from '../screens/ViewNotes'
import AddNotes from '../screens/AddNotes'
import Settings from '../screens/Settings'
import OpenNote from '../screens/OpenNote'
import Login from '../screens/Login'


const StackNavigator = createStackNavigator(
    {
        Login: {
            screen: Login
        },
        ViewNotes: {
            screen: ViewNotes
        },
        AddNotes:{
            screen: AddNotes
        },
        Settings:{
            screen: Settings
        },
        OpenNote:{
            screen: OpenNote
        }
    },

    {        
        initialRouteName: 'Login',
        headerMode : 'none',
        mode: 'modal'
    }
)

export default createAppContainer(StackNavigator)


