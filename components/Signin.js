import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
import {connect} from 'react-redux';
import * as actions from '../actions';
import "redux"; // 4.0.0-beta.2
import * as firebase from 'firebase'
import { database } from '../firebase/Config'

class Signin extends React.Component {
  	constructor(props) {
      super(props);
      this.state={
        toDate: null,
        selectedDay: null,
        markedDates:{},
        userEmail: null,
        userPassword: null,
        directLogin : true
      }
      this.signIn = this.signIn.bind(this);
      this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
      this.onChangeUserPasswords = this.onChangeUserPasswords.bind(this);
  }

componentWillMount(){
  if(this.props.directLogin){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  }else{
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      //현재로그인한 사용자 가져오기
      firebase.auth().onAuthStateChanged(function(user) {
        //사용자 정보가 있는경우.
        if (user) {
          email = user.email;
          uid = user.uid;
          //로그인 된 사용자로 캘린더 페이지 접속
          const fireDataBase = firebase.database().ref('users/' + uid);
          fireDataBase.on("value",snap => {
            setTimeout(() => {
              that.props.storeChanger(snap.val())
              if( that.props.daily_record[that.state.toDate] !== undefined ){
                Actions.CalendarBasic({
                  totalRound: that.props.daily_record[that.state.toDate].totalRound,
                  totalKcal: that.props.daily_record[that.state.toDate].totalKcal,
                  daily_record : that.props.daily_record ,
                  markedData : that.props.markedDates ,
                  toDate : that.state.toDate,
                  uid : uid
                }) 
              }else{
                Actions.CalendarBasic({
                  totalRound: null,
                  totalKcal: null,
                  markedData : that.props.markedDates ,
                  daily_record :that.props.daily_record,
                  toDate : that.state.toDate,
                  uid : uid
                })
              }
            }, 0);
          })
        //사용자 정보가 없는경우 로그인 페이지로 이동.
        } else {
          Actions.Signin()
        }
      });
    })
    
  }
  const that = this;
  //세션이 유지된 경우 실행

  //날자 데이터 구하기
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
      for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }
  this.setState({
    toDate : getTimeStamp()
  })
}

pageChangeCalendar(uid){
    const fireDataBase = firebase.database().ref('users/' + uid);
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

  signIn(){
    const that = this;
    firebase.auth().signInWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
      .then(()=>{
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            var email = user.email;
            var uid = user.uid;
            if(firebase.database().ref('users/' + uid)){
              that.pageChangeCalendar(uid)
            }else{
              firebase.database().ref('users/' + uid).set({
                email : email
              })
            }
          }
        });
      })
      .catch((error)=>{
        console.log(error.message)
        if( error.message === "The password is invalid or the user does not have a password."){
          alert("비밀번호가 다릅니다.")
        }else if( error.message === "The email address is badly formatted."){
          alert("틀린 이메일 형식입니다.")
        }else if(error.message === "There is no user record corresponding to this identifier. The user may have been deleted."){
          alert("등록되지 않은 이메일 입니다.")
        }
      })
  }

  onChangeUserEmail(text){
    this.setState({
        userEmail: text
    })
  }
  onChangeUserPasswords(text){
    this.setState({
      userPassword : text
    })
    console.log(text)
  }

  render() {
    return (
      <View style={styles.containers}>
        <View style={styles.upperBox}>
          <Image style={{ height:120, resizeMode: Image.resizeMode.contain,}} source={require('../assets/boxing.png')} />
          <Text style={styles.titleTxt}>Boxing Scheduler</Text>
        </View>
        <View style={styles.lowBox}>
        <View> 
            <TextInput
                selectionColor={"#fff"}
                multiline={true}
                style={styles.Signin}
                placeholder={"User id"}
                placeholderTextColor={"white"}
                secureTextEntry={true}
                onChangeText={this.onChangeUserEmail}
            > 
            </TextInput>
        </View>
        <View> 
            <TextInput
                multiline={true}
                style={styles.SigninLast}
                placeholder={"Password"}
                placeholderTextColor={"white"}
                secureTextEntry={true}
                onChangeText={this.onChangeUserPasswords}
            /> 
        </View>
        <View> 
          <TouchableOpacity onPress={
            ()=>{
              Actions.reset("Signup");
            }
          }>
            <View>
              <Text style={{marginBottom:30,color:"#fff", }}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        </View>
          <TouchableOpacity onPress={this.signIn}>
          <View style={styles.button}  >
            <Text style={styles.buttonText}>SIGN IN</Text>
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
  Signin: {
    width: 300,
    height: 30,
    marginBottom:40,
    opacity:0.7,
    color:"#fff", 
    textAlign:"center",
    borderBottomColor:"#fff",
    borderBottomWidth:1,
    backgroundColor: '#46bd9d',
  },
  SigninLast: {
    width: 300,
    height: 30,
    marginBottom:10,
    opacity:0.7,
    color:"#fff", 
    textAlign:"center",
    borderBottomColor:"#fff",
    borderBottomWidth:1,
    backgroundColor: '#46bd9d',
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(Signin);


