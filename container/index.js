import React from 'react';
import { View, Text } from 'react-native';
import Start from '../components/Start';
import CalendarBasic from '../components/CalendarBasic';
import AddFitness from '../components/AddFitness';
import ExerciseList from '../components/ExerciseList';
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
import {Scene, Router} from 'react-native-router-flux'; // 4.0.0-beta.28

import { connect } from 'react-redux'; // 5.0.6
import * as actions from '../actions';
import "redux"; // 3.7.2

class FitnessClendar extends React.Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="Start" 
            component={Start} 
            hideNavBar={true} 
            initial={true}
          />
          <Scene key="CalendarBasic" 
            component={CalendarBasic} 
            hideNavBar={true}  
          />
          <Scene key="AddFitness" 
            component={AddFitness} hideNavBar={true} 
          />
        </Scene>
      </Router>
    ); 
  }
}

const mapStateToProps = (state) => {
   return {
   	    daily_record : state.daily_record,
   	    exercise_categories :state.exercise_categories,
   	    markedDates : state.markedDates
   }; 
};

const mapDispatchToProps = (dispatch) =>{
	return {
		deleteDaySelected : (dateString) => {dispatch(actions.daySelectCreator(dateString))},
		daySelectCreator : (dateString) => { dispatch(actions.daySelectCreator(dateString)) },
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FitnessClendar);
