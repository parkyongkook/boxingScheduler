import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
import {connect} from 'react-redux'; // 5.0.7
// 5.0.7
import { database } from '../firebase/Config'
import * as firebase from 'firebase'
import * as actions from '../actions';
import "redux"; // 4.0.0-beta.2

const d = new Date();
const toDate = d.getFullYear()+"-" + "0" +(d.getMonth() + 1)+"-" + "0"+ d.getDate() ;
class Start extends React.Component {
  	constructor(props) {
      super(props);
      this.state={
        toDayData: this.props.daily_record[toDate],
        selectedDay: null,
        markedDates:{}
      }
      this.pageChangeCalendar = this.pageChangeCalendar.bind(this)
  }
  
  componentDidMount(){
    const fireDataBase = firebase.database().ref();
    fireDataBase.on("value",snap => {
      this.props.storeChanger(snap.val())
    })
  }

  pageChangeCalendar(){
    if( this.state.toDayData !== undefined ){
      Actions.CalendarBasic({
        totalRound: this.state.toDayData.totalRound,
        totalKcal: this.state.toDayData.totalKcal,
        daily_record :this.props.daily_record ,
        toDate : toDate
      })
      
    }else{
      Actions.CalendarBasic({
        totalRound: null,
        totalKcal: null,
        daily_record :this.props.daily_record,
        toDate : toDate
      })
    }
  }

  render() {
    return (
      <View style={styles.containers}>
        <View style={styles.upperBox}>
           <Text style={styles.titleTxt}>Boxing Scheduler</Text>
        </View>
        <View style={styles.lowBox}>
            <TouchableOpacity onPress={this.pageChangeCalendar}>
            <View style={styles.button}  >
              <Text style={styles.buttonText}>START</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
}

const action = (data) => {
    return {
        type: 'data',
        payload: data
    };
};

const styles = StyleSheet.create({
  containers: {
    flex: 4,
    backgroundColor: '#46bd9d',
  },
  titleTxt : {
    fontSize:30,
    color: 'white',
    fontWeight: '100'
  },
  button: {
    marginBottom: 30,
    width: 300,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#46bd9d',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#fff'
  },
  buttonText: {
    paddingTop: 15,
    color: 'white'
  },
  upperBox: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    marginTop: 130,
  },
  lowBox: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'flex-end',
    marginBottom: 120
  }
});

const mapStateToProps = (state) => {
   return {
   	    daily_record : state.reducers.daily_record,
   	    exercise_categories : state.reducers.exercise_categories,
   	    markedDates : state.reducers.markedDates
   }; 
};

const mapDispatchToProps = (dispatch) =>{
	return {
    storeChanger : (fireData) => {dispatch(actions.storeChanger(fireData))},
	  updateTofitnessData : (totalData) => {dispatch(actions.updateTofitnessData(totalData))},
		deleteDaySelected : (dateString) => {dispatch(actions.deleteDaySelected(dateString))},
		daySelectCreator : (dateString, isHaveDate) => {dispatch(actions.daySelectCreator(dateString, isHaveDate))},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);


