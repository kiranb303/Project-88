import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import * as firebase from 'firebase';
import { firebaseConfig } from './Config';
import Login from './Screens/Login';
import Loading from './Screens/Loading';
import Dashboard from './Screens/Dashboard';

if(!firebase.apps.length){
 firebase.initializeApp(firebaseConfig)
}else{
  firebase.app();
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: Loading,
  LoginScreen: Login,
  DashboardScreen: Dashboard
});

const AppNavigator = createAppContainer(AppSwitchNavigator)

export default function App() {
    return (
      <AppNavigator />
    );
}