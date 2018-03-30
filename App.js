import React from 'react';
import Start from './components/Start';
import AddFitness from './components/AddFitness';
import CalendarBasic from './components/Calendar';
import EditFittness from './components/EditFittness';
import UpdateFitnessList from './components/UpdateFitnessList';
import {createStore} from 'redux'; // 4.0.0-beta.2
import {Provider, connect} from 'react-redux'; // 5.0.7
import {Scene, Actions, Router} from 'react-native-router-flux'; // 4.0.0-beta.28

import "redux"; // 4.0.0-beta.2

const Scenes = Actions.create(
  <Scene key='root'>
    <Scene key='Start' 
      component={Start}
      hideNavBar={true}
      initial={true}
    />
    <Scene key='CalendarBasic' 
      component={CalendarBasic} 
      hideNavBar={true}

    />
    <Scene key='AddFitness' 
      component={AddFitness} 
      hideNavBar={true}
    />
    <Scene key='EditFittness' 
      component={EditFittness} 
      hideNavBar={true}
    />
    <Scene key='UpdateFitnessList' 
      component={UpdateFitnessList} 
      hideNavBar={true}
    />
  </Scene>
)
const ReduxRouter = connect((state) => ({ state: state.route }))(Router);
const reducers = require('./reducers').default;

export default class App extends React.Component {

  render() { 
    return (
      <Provider store={createStore(reducers, {})}>
        <ReduxRouter scenes={Scenes}/>
      </Provider> 
    ); 
  }
}