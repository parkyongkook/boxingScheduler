import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
import {connect} from 'react-redux';
import * as actions from '../actions';
import "redux"; // 4.0.0-beta.2
import * as firebase from 'firebase'
import { database } from '../firebase/Config'

class Start extends React.Component {
  	constructor(props) {
      super(props);
      this.state={
        toDate: null,
        selectedDay: null,
        markedDates:{}
      }
      this.pageChangeCalendar = this.pageChangeCalendar.bind(this)
  }

componentWillMount(){
  function getTimeStamp() {
    var d = new Date();
    var s =
      leadingZeros(d.getFullYear(), 4) + '-' +
      leadingZeros(d.getMonth() + 1, 2) + '-' +
      leadingZeros(d.getDate(), 2) + ' ';  
    return s;
  }
  function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }
  this.setState({
    toDate : getTimeStamp()
  })
}

  pageChangeCalendar(){
    const fireDataBase = firebase.database().ref();
    fireDataBase.on("value",snap => {
      setTimeout(() => {
        this.props.storeChanger(snap.val())
        if( this.props.daily_record[this.state.toDate] !== undefined ){
          Actions.CalendarBasic({
            totalRound: this.props.daily_record[this.state.toDate].totalRound,
            totalKcal: this.props.daily_record[this.state.toDate].totalKcal,
            daily_record : this.props.daily_record ,
            markedData : this.props.markedDates ,
            toDate : this.state.toDate
          }) 
        }else{
          Actions.CalendarBasic({
            totalRound: null,
            totalKcal: null,
            markedData : this.props.markedDates ,
            daily_record :this.props.daily_record,
            toDate : this.state.toDate
          })
        }
      }, 0);
    })
  }

  render() {
    return (
      <View style={styles.containers}>
        <View style={styles.upperBox}>
          <Image style={{height:120, resizeMode: Image.resizeMode.contain,}} source={require('../assets/boxing.png')} />
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
    fontWeight: '100',
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


