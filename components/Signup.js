import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
import {connect} from 'react-redux';
import * as actions from '../actions';
import "redux"; // 4.0.0-beta.2
import * as firebase from 'firebase'
import { database } from '../firebase/Config'

class Signup extends React.Component {
  	constructor(props) {
      super(props);
      this.state={
        toDate: null,
        selectedDay: null,
        markedDates:{},
        userEmail: null,
        userPassword: null,
        comfirmPassword : null
      }
      this.signUp = this.signUp.bind(this)
      this.onChangeUserEmail = this.onChangeUserEmail.bind(this)
      this.onChangeUserPasswords = this.onChangeUserPasswords.bind(this)
      this.onChangeconfirmPassword = this.onChangeconfirmPassword.bind(this)
  }

componentWillMount(){
  const that = this;
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

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          Actions.reset("Signin",{ 
            directLogin: true
          });
        }
      });
    })
}

signUp(){
    if( this.state.userPassword !== this.state.comfirmPassword ){
      alert("비밀번호가 일치하지 않습니다.")
    }else if(this.state.userEmail === null || this.state.userPassword === null){
      alert("입력창이 비어있습니다.")
    }else{
      firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
      .then( ()=>{
        alert("회원가입이 성공하였습니다.")
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          firebase.auth().onAuthStateChanged(function(user) {
            if(user!==null){
              var email = user.email;
              var uid = user.uid;
              firebase.database().ref('users/' + uid).set({
                "email": email,
                "daily_record" : {
                  "2018-01-01" : {
                    "exercise_list" : {
                      "0" : {
                        "exercise_id" : 1,
                        "kcal" : 28,
                        "rounds": 7
                      }
                    },
                    "totalKcal": 430,
                    "totalRound": 14
                  } 
                },
                "exercise_categories" : [ {
                  "checked" : "false",
                  "id" : 1,
                  "kcal_per_round" : 28,
                  "title" : "스트레칭 "
                }, {
                  "checked" : "false",
                  "id" : 2,
                  "kcal_per_round" : 28,
                  "title" : "줄넘기 "
                }, {
                  "checked" : "false",
                  "id" : 3,
                  "kcal_per_round" : 38,
                  "title" : "샌드백 "
                }, {
                  "checked" : "false",
                  "id" : 4,
                  "kcal_per_round" : 38,
                  "title" : "쉐도우복싱 "
                }, {
                  "checked" : "false",
                  "id" : 5,
                  "kcal_per_round" : 38,
                  "title" : "미트 트레이닝 "
                }, {
                  "checked" : "false",
                  "id" : 6,
                  "kcal_per_round" : 38,
                  "title" : "웨이트 트레이닝"
                }, {
                  "checked" : "false",
                  "id" : 7,
                  "kcal_per_round" : 38,
                  "title" : "크로스핏 트레이닝"
                }, {
                  "checked" : "false",
                  "id" : 8,
                  "kcal_per_round" : 38,
                  "title" : "스파링 "
                }, {
                  "checked" : "false",
                  "id" : 9,
                  "kcal_per_round" : 38,
                  "title" : "메소드복싱 "
                } ],
                "markedDates":{
                  "2018-01-01":{
                    "activeOpacity":0,
                    "dotColor":"yellow",
                    "marked":"true",
                    "selected":"false"
                  }
                }
              });
            }
          });
          Actions.reset("Signin",{ 
            directLogin: true
          });
      })
      .catch((error)=>{
        console.log(error.message)
        if( error.message === "The email address is badly formatted."){
          alert("틀린 이메일 형식입니다.")
        }else if( error.message === "The email address is already in use by another account."){
          alert("이미 등록 된 이메일 입니다.")
        }else if(error.message === "Password should be at least 6 characters"){
          alert("비밀번호는 6자 이상입니다.")
        }
      })
    }
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
}

onChangeconfirmPassword(text){
  this.setState({
    comfirmPassword : text
  })
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
                placeholder={"Email"}
                placeholderTextColor={"white"}
                onChangeText={this.onChangeUserEmail}
                onSubmitEditing = {this.signUp}
            > 
            </TextInput>
        </View>
        <View> 
            <TextInput
                style={styles.SigninLast}
                placeholder={"Password"}
                placeholderTextColor={"white"}
                secureTextEntry={true}
                onChangeText={this.onChangeUserPasswords}
                onSubmitEditing = {this.signUp}
            > 
            </TextInput>
        </View>
        <View> 
          
            <TextInput
                style={styles.SigninLast}
                placeholder={"Confirm Password"}
                secureTextEntry={true}
                placeholderTextColor={"white"}
                onChangeText={this.onChangeconfirmPassword}
                onSubmitEditing = {this.signUp}
            > 
            </TextInput>
        </View>
        <View> 
          <TouchableOpacity onPress={
            ()=>{
              Actions.reset("Signin",{ 
                directLogin: true
              });
            }
          }>
            <View>
              <Text style={{marginBottom:30,color:"#fff", }}>로그인</Text>
            </View>
          </TouchableOpacity>
        </View>
          <TouchableOpacity onPress={this.signUp}>
            <View style={styles.button}  >
              <Text style={styles.buttonText}>회원가입</Text>
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
    marginBottom:30,
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
    marginTop: 70,
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);


