import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput } from 'react-native';
import { Ionicons, EvilIcons, MaterialIcons, Entypo} from "@expo/vector-icons" // 6.2.2
import ExerciseList from "./ExerciseList"
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
import * as actions from '../actions';
import {connect} from 'react-redux'; // 5.0.7
import update from 'immutability-helper'; // 2.6.5
import "redux"; // 4.0.0-beta.2
import { database } from '../firebase/Config'
import * as firebase from 'firebase'
 // 4.0.0-beta.2
class AddFitness extends React.Component {
  constructor(props){
    super(props)
    this.state={
      isDayData: false,
      isConfirmType: false,
      onMemoNavAvtivate: false,
      memoData: null,
      isAppType : false,
      totalData:{
        cancelKey : this.props.cancelKey,
        markedType: this.props.dotColor,
        dayInfo: this.props.mergeDayData,
        daily_record : this.props.daily_record,
        mergeDayData : this.props.mergeDayData,
        selectedDay : this.props.selectedDay,
        totalKcal: this.props.totalKcal,
        totalRound: this.props.totalRound
      },
    }
    this.increamentRounds = this.increamentRounds.bind(this)
    this.decreamentRounds = this.decreamentRounds.bind(this)
    this.onMemoNavAvtivate = this.onMemoNavAvtivate.bind(this)
    this.onPressCancelMemo = this.onPressCancelMemo.bind(this)
    this.onPressMemoConfirm = this.onPressMemoConfirm.bind(this)
    this.confirmAddFitness = this.confirmAddFitness.bind(this)
  }
  componentWillMount(){
    if(this.props.daily_record !== undefined ){
      if(this.props.daily_record.memoData !== undefined ){
        this.setState({
          memoData : this.props.daily_record.memoData
        })
      }
    }
    this.state.totalData.mergeDayData ? this.setState({isDayData:true}) : this.setState({isDayData:false})
    if( this.state.totalData.totalRound !== undefined ){
      this.setState({
        isConfirmType : true
      })
    }else{
      this.setState({
        isConfirmType : false
      })
    }
  }
  increamentRounds(index){
    return()=>{
      let totalKcal = this.state.totalData.totalKcal + this.state.totalData.mergeDayData[index].kcal_per_round 
      let totalRound = this.state.totalData.totalRound + 1
      this.setState({
        totalData: update(this.state.totalData, { 
          dayInfo : {
            [index]:{
          		rounds: {$set: this.state.totalData.dayInfo[index].rounds+1},
          	} 
          },
          daily_record : {
            exercise_list : {
              [index] : {
                rounds : {$set: this.state.totalData.daily_record.exercise_list[index].rounds+1}
              }
            },
            totalKcal: {$set: totalKcal},
            totalRound: {$set: totalRound}
          },
        	totalRound: {$set: totalRound},
        	totalKcal: {$set: totalKcal},
        }),
      })
    }
  }
  decreamentRounds(index){
    return()=>{
      let totalKcal = this.state.totalData.totalKcal - this.state.totalData.mergeDayData[index].kcal_per_round 
      let totalRound = this.state.totalData.totalRound - 1
      this.setState({
      	totalData: update(this.state.totalData, { 
      	  dayInfo : {
            [index]:{
          		rounds: {$set: this.state.totalData.dayInfo[index].rounds-1},
          	} 
          },
          daily_record : {
            exercise_list : {
              [index] : {
                rounds : {$set: this.state.totalData.daily_record.exercise_list[index].rounds-1}
              }
            },
            totalKcal: {$set: totalKcal},
            totalRound: {$set: totalRound}
          },
        	totalRound : {$set: totalRound},
        	totalKcal: {$set: totalKcal}
        }),
      })
    }
  }
  markedButtonClick(markedType){
    return ()=>{
      this.setState({
        totalData :update(this.state.totalData, { 
          markedType : {$set:markedType}
        })
      })
    }
  }

  onMemoNavAvtivate(text){
      this.setState({
        onMemoNavAvtivate : true,
        memoData:text
      })
  }

  onPressCancelMemo(){
    this.setState({
      onMemoNavAvtivate : false,
    })
  }

  onPressMemoConfirm(){
    this.setState({
      onMemoNavAvtivate : false,
    })
  }

  confirmAddFitness(){
    this.props.confirmAddFitness(this.state.totalData);
    if(this.state.memoData !== null){
      this.props.confirmMemoData(this.state.totalData.selectedDay, this.state.memoData);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle ='light-content' />
        <View style={styles.naviBar}>
          {
            this.state.onMemoNavAvtivate ?   
            <TouchableOpacity
            style={{flex:1, alignItems: 'flex-start',  justifyContent:"center",  marginLeft:5, }} 
            onPress={this.onPressCancelMemo}
            >
              <Text style={{color:"#fff", fontSize:18, marginLeft:10, marginTop:20,}}>취소</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity 
            style={{flex:1, alignItems: 'flex-start',  justifyContent:"center",  marginLeft:5, }} 
            onPress={this.props.onPressCancelAddFitness(this.state.totalData)}
            >
            <EvilIcons color="white" size={45} name="close-o" style={styles.naviTopIcon} />
            </TouchableOpacity>
          }     
          <View style={{flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center" }}>
             <TouchableOpacity>
               <MaterialIcons color="white" size={30} name="navigate-before" style={styles.naviTopIcon} />
             </TouchableOpacity>
             <Text style={{ color:"white" ,fontSize:16, marginTop:25 }}>
               {this.state.totalData.selectedDay}
             </Text>
             <TouchableOpacity>
                <MaterialIcons color="white" size={30} name="navigate-next" style={styles.naviTopIcon} />
             </TouchableOpacity>
          </View>
           
           {
            this.state.onMemoNavAvtivate ?   
            <TouchableOpacity
            style={{flex:1, alignItems: 'flex-end', justifyContent:"center" }} 
            onPress={this.onPressMemoConfirm}
            >
              <Text style={{color:"#fff", fontSize:18, marginRight:10, marginTop:20,}}>저장</Text>
            </TouchableOpacity>
            :
             this.state.isConfirmType ?            
              <TouchableOpacity 
              style={{
                flex:1, 
                alignItems: 'flex-end',  
                justifyContent:"center", 
              }}
              onPress={this.confirmAddFitness}
              >
                <EvilIcons color="white" size={45} name="check" style={styles.naviTopIcon} />
              </TouchableOpacity>
              :
              <TouchableOpacity 
              style={{
                flex:1, 
                alignItems: 'flex-end',  
                justifyContent:"center", 
              }}
              >
                <EvilIcons color="#ccc" size={45} name="check" style={styles.naviTopIcon} />
              </TouchableOpacity>
           }           
        </View>

        <View style={styles.calendar}>
          <ScrollView style={{ height: 250, width: "90%", }}>

            <View style={styles.fitnessList}>
              <Text style={styles.fitListItem}> Event </Text>
              <Text style={{ flex: 2, textAlign:"center", color: "#555" }}>Round</Text>
            </View>
            
            <View>
              {
               this.state.totalData.dayInfo ? this.state.totalData.dayInfo.map((mergeDayData, i) => {
                      return (<ExerciseList 
                                title={mergeDayData.title}
                                round={mergeDayData.rounds}
                                increamentRounds={this.increamentRounds}
                                decreamentRounds={this.decreamentRounds}
                                index={i}
                                key={i} 
                              />);
                      })
                 : null
              }
            </View>
           
           {
            this.state.isDayData ?
              <View> 
                <TextInput
                  multiline={true}
                  style={styles.memo}
                  placeholder={"간단한 메모를 작성해 보세요"}
                  onChangeText={this.onMemoNavAvtivate}
                  autoCorrect={this.state.onMemoNavAvtivate}
                > 
                  <Text>{this.state.memoData}</Text>
                </TextInput>
              </View>
           : null
           }
           
          </ScrollView>
          <View style={{ flex:1 }}>
           <TouchableOpacity onPress={
             this.props.editFitnessButtonPress(
               this.state.totalData.mergeDayData, 
               this.state.totalData.daily_record 
             )
           }>
              <Ionicons color="#46bd9d" size={45} name="ios-add-circle" style={styles.naviTopIcon} />
           </TouchableOpacity>
          </View>
          <Text style={{marginTop:50,color:"#aaa"}}>오늘한 운동의 만족도를 표시해 주세요</Text>
          <View View style={{ flex:1 , flexDirection:"row", width:100, marginTop:10, justifyContent:"space-around", }}>
            <View style={{flexDirection:"row", width:150, justifyContent: "space-around" }}>
              <TouchableOpacity 
                style={{width:20, 
                height:20,  
                backgroundColor:"green", 
                borderRadius: 10,}} 
                onPress={this.markedButtonClick("green")}
                >
                 {this.state.totalData.markedType === "green" ? <Entypo color="black" size={20} name="check" style={styles.checkButton} /> : null}
                 <Text style={{ width:30, fontSize:10, position: "absolute" , top: 20 , left: -3}}>
                  Good
                 </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{width:20, 
                height:20, 
                backgroundColor:"yellow", 
                borderRadius: 10,}} 
                onPress={this.markedButtonClick("yellow")}
                >
                 {this.state.totalData.markedType === "yellow" ? <Entypo color="black" size={20} name="check" style={styles.checkButton} /> : null}
                 <Text style={{ width:50, fontSize:10, position: "absolute" , top: 20, left: -8, }}>
                  Not bad
                 </Text>
              </TouchableOpacity>
           
              <TouchableOpacity style={{
                width:20, 
                height:20,  
                backgroundColor:"red", 
                borderRadius: 10,}} 
                onPress={this.markedButtonClick("red")}
                >  
                 {this.state.totalData.markedType === "red" ? <Entypo color="black" size={20} name="check" style={styles.checkButton} /> : null} 
                 <Text style={{ width:50, fontSize:10 , position: "absolute" , top: 20, left: 2, }}>
                  Bad
                 </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.naviBottom}>
          <View style={{alignItems : 'flex-start', paddingTop:40 }}>
            <Text style={{ marginLeft:20, color:'#999', fontSize:20 }}>
             <Text style={{fontWeight:"bold",}}>{this.state.totalData.totalRound}</Text> 라운드
            </Text>
            <Text style={{ marginLeft:20, color:'#999', fontSize:20 }}>
             <Text style={{fontWeight:"bold",}}>{this.state.totalData.totalKcal}</Text> 칼로리
            </Text>
          </View>
          <TouchableOpacity style={{ alignItems : 'flex-end' , justifyContent:"center",  marginTop:-35, marginRight:15 }}>
            <Ionicons color="white" size={30} name="ios-add-circle-outline" />
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
  container: {
    flex : 1,
    justifyContent: "center" ,
    backgroundColor: '#46bd9d'
  },
  naviBar : {
    flex : 2.5,
    backgroundColor: '#46bd9d',
    flexDirection: "row",
  },
  naviTopIcon:{
    marginTop:25,  
  },
  calendar : {
    flex : 15,
    alignItems:"center",
    backgroundColor: '#fff'
  },
  naviBottom : {
    flex : 4,
    backgroundColor: '#f6f6f6'
  },
  fitnessList: {
    height:50,
    flexDirection:"row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor:"#ccc",
  },
  fitListItem : {
    flex: 9,
    color: "#555"
  },
  memo : {
    width:"100%",
    height:150,
    marginTop:20,
    color: "#555",
    borderWidth:1,
    borderColor:"#ddd",
  },
  checkButton:{
    position: "absolute",
    bottom : 0
  }
});

const mapStateToProps = (state) => {
   return {
   	    state :state,
         markedDates : state.reducers.markedDates
   }; 
};

const mapDispatchToProps = (dispatch) =>{
  var user = firebase.auth().currentUser;
  var uid = user.uid
  const fireDataBase_daily_record = firebase.database().ref("users/"+uid+"/daily_record/");
	return {
	  updateTofitnessData : (totalData) => {dispatch(actions.updateTofitnessData(totalData))},
		deleteDaySelected : (dateString) => {dispatch(actions.deleteDaySelected(dateString))},
    daySelectCreator : (dateString, isHaveDate) => {dispatch(actions.daySelectCreator(dateString, isHaveDate))},
    confirmMemoData : (selectedDay,memoData) => {
      fireDataBase_daily_record.child(selectedDay).update({
        memoData : memoData
      })
      dispatch(actions.confirmMemoData(selectedDay,memoData))
    },
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFitness);


