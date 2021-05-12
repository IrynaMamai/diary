import React from 'react'
//import {Provider as PaperProvider } from 'react-native-paper'
import {Provider} from "react-redux"
import {applyMiddleware, createStore, combineReducers} from "redux"
import AppNavigator from './src/navigation/Index'

import themeReducer from "./src/reducer/themeReducer"
import thunk from 'redux-thunk'

const store = createStore(combineReducers({themeReducer}), applyMiddleware(thunk));

export default function App(){
  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  )
}