import React from 'react';
import { Text, View, StyleSheet,TouchableOpacity} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars'; // 1.17.0
import { Ionicons, EvilIcons, MaterialIcons } from "@expo/vector-icons" // 6.2.2
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
import {connect} from 'react-redux'; // 5.0.7
import update from 'immutability-helper'; // 2.6.5
import * as actions from '../actions';
import "redux"; // 4.0.0-beta.2
import { database } from '../firebase/Config'
import * as firebase from 'firebase'

LocaleConfig.locales['en'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['월요일','화요일','수요일','목요일','금요일','토요일','일요일'],
  dayNamesShort: ['월.','화.','수.','목.','금.','토.','일.']
};

LocaleConfig.defaultLocale = 'en';

class CalendarBasic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firedata:null,
      isAppType : true,
      selectedDay: this.props.toDate, //시작버튼 누를시 초기값으로 오늘날자 날자 선택시 선택한 날자
      toDayData: this.props.daily_record[this.props.toDate],
      isSubject: false,
      isRemoveData: false,
      totalRound: this.props.totalRound,
      totalKcal: this.props.totalKcal,
      daily_record: this.props.daily_record,
      mergeDayData: null,
      exercise_categories : this.props.exercise_categories,
    };

    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.subjectSettingOnpress = this.subjectSettingOnpress.bind(this);
    this.onPressAddFitness = this.onPressAddFitness.bind(this);
    this.confirmAddFitness = this.confirmAddFitness.bind(this);
    this.editFitnessButtonPress = this.editFitnessButtonPress.bind(this);
    this.cancelEditFitButton = this.cancelEditFitButton.bind(this);
    this.confirmEditFitness = this.confirmEditFitness.bind(this);
    this.onPressCancelAddFitness= this.onPressCancelAddFitness.bind(this);
    this.removeExerciseData = this.removeExerciseData.bind(this);
  };

  subjectSettingOnpress(){
    this.setState({
      isSubject: true
    })
  };
  
  onPressConfirm(){
    this.setState({
      isSubject: false
    })
  };

  onDayPressBasic = day => {
    const dateString = day.dateString
    //목표설정 버튼을 활성화 하면
    if(this.state.isSubject){
      // 클릭한 날자의 selected (파란색 마킹)이 true면
      if(this.props.markedDates[dateString]){ //내가 선택한 날자에 데이터 값이 있으면
        this.props.markedDates[dateString].selected ?  
        this.props.deleteDaySelected(dateString) : 
        this.props.daySelectCreator(dateString,true)
      }else{ //선택한 날자의 셀렉티드가 펄스면
        this.props.daySelectCreator(dateString) // 마킹을 셀렉트 해주는 디스패처 함수를 실행
      }
    }else{ 
        // 목표 설정 버튼을 활성화 하지 않으면
        this.setState({//화면상의 보이는 상단 날짜를 바꿔주기
          selectedDay: dateString,
        })
        if( this.state.daily_record[dateString] !== undefined ){ //일치하는 날자가 있는경우
          if(this.state.daily_record[dateString].exercise_list.length){ //일치하는 날자가 있고 데이터도 있으면
            this.setState({
              totalRound: this.state.daily_record[dateString].totalRound,
              totalKcal: this.state.daily_record[dateString].totalKcal,
            })
          }else{//일치하는 날자가 가 있으나 데이타가 없는경우
            this.setState({
              totalRound: null,
              totalKcal: null,
            })
          }
        }else{//일치하는 날자가 없는 경우
          this.setState({
            totalRound: null,
            totalKcal: null,
          })
       }
    }
  };
  
  onPressAddFitness(selectedDay){ 
    //에디트 피트니스 대한걸 새로 만들어야 할지 결정
     return () => {
      if( this.state.daily_record[selectedDay] !== undefined ){
        const mergeDayData =[];
        const toDay = this.state.daily_record[selectedDay].exercise_list
        let toDayCopy = Object.assign({},toDay)
        let toDayCopyObj = JSON.parse(JSON.stringify(toDayCopy));
        const title = this.props.exercise_categories.filter(
         function (exercise_categories) { 
           for( var i =0 ; i < toDay.length ; i++){
             if( exercise_categories.id == toDay[i].exercise_id ){
               return true
             }
           }
         }); 
        for(var i = 0 ; i < toDay.length ; i ++ ){
          mergeDayData.push(Object.assign(toDayCopyObj[i], title[i]))
        }
        
        this.setState({
         selectedDay: selectedDay,
         mergeDayData : mergeDayData,
         exercise_categories : title
        })
        Actions.AddFitness({
          cancelKey : this.props.daily_record[selectedDay].exercise_list.length,
          dotColor : this.props.markedDates[selectedDay].dotColor,
          selectedDay: selectedDay, 
          totalRound : this.state.totalRound,
          totalKcal : this.state.totalKcal,
          daily_record : this.state.daily_record[selectedDay], 
          mergeDayData : mergeDayData, 
          exercise_categories : title, 
          onPressAddFitness : this.onPressAddFitness,
          confirmAddFitness : this.confirmAddFitness,
          editFitnessButtonPress : this.editFitnessButtonPress,
          onPressCancelAddFitness : this.onPressCancelAddFitness
        })
      }else{
        Actions.AddFitness({
          selectedDay : selectedDay, 
          dayInfo : false ,  
          onPressAddFitness : this.onPressAddFitness ,
          confirmAddFitness : this.confirmAddFitness,
          editFitnessButtonPress : this.editFitnessButtonPress,
          onPressCancelAddFitness : this.onPressCancelAddFitness
        })
      }
    } 
  };

  confirmAddFitness = (totalData) => {
    const that = this;
    return ()=> {
       this.setState({
         daily_record :update(this.state.daily_record, { 
           [totalData.selectedDay] : {
            totalKcal:{$set:totalData.totalKcal},
            totalRound:{$set:totalData.totalRound}
           }
         })
       })
       if( totalData.totalRound !== undefined){
         that.props.updateTofitnessData(totalData, totalData.selectedDay )
       }
       Actions.CalendarBasic({
         toDate : this.props.toDate,
         totalRound: totalData.totalRound,
         totalKcal : totalData.totalKcal ,
       })
    }
  };
  
  onPressCancelAddFitness(totalData){
    const that = this;
    return () => {
        //데이타가 있는 경우
       if( this.state.daily_record[this.state.selectedDay] !== undefined ){
        if( totalData.cancelKey !== totalData.daily_record.exercise_list.length ){
           const totalDat = update(totalData, { 
        	   daily_record : {
               totalKcal:{$set:totalData.totalKcal},
               totalRound:{$set:totalData.totalRound}
        	   } 
           });
           if( totalData.totalRound !== undefined){
             that.props.updateTofitnessData(totalDat, totalDat.selectedDay )
           }
        }   
       Actions.CalendarBasic({ 
        toDate : this.props.toDate,
       })
      }else{
        Actions.CalendarBasic({
          toDate: this.props.toDate,
        })
      }
    }
  };
  
  cancelEditFitButton(){
    return()=>{
        Actions.AddFitness({
          cancelKey : this.props.daily_record[this.state.selectedDay] ? 
          this.props.daily_record[this.state.selectedDay].exercise_list.length : 0, 
          selectedDay: this.state.selectedDay, 
          daily_record : this.state.daily_record[this.state.selectedDay], 
          mergeDayData : this.state.mergeDayData,
          exercise_categories : this.state.exercise_categories,
          totalRound : this.state.totalRound,
          totalKcal : this.state.totalKcal,
          onPressAddFitness : this.onPressAddFitness,
          confirmAddFitness : this.confirmAddFitness,
          editFitnessButtonPress : this.editFitnessButtonPress,
          cancelEditFitButton : this.cancelEditFitButton,
          onPressCancelAddFitness : this.onPressCancelAddFitness
        })
    }
  };
  
  editFitnessButtonPress(selcetExersiseList , dailyRecord){
    return()=>{
        if(dailyRecord !== undefined){
            for(var i=0 ; i < this.props.exercise_categories.length; i++){
              this.props.exercise_categories[i].checked = false 
            }
            this.props.exercise_categories.filter(
              function (exercise_categories) { 
                for( var i =0 ; i < selcetExersiseList.length ; i++){
                  if( exercise_categories.id == selcetExersiseList[i].id ){
                    return exercise_categories.checked = true
                }
              }
            });
            Actions.EditFittness({
              cancelKey : this.props.daily_record[this.state.selectedDay].exercise_list.length,
              selectedDay: this.state.selectedDay, 
              daily_record : this.state.daily_record, 
              exerciseList : dailyRecord.exercise_list,
              selcetExersiseList : selcetExersiseList,
              nonSelectExersiseList : this.props.exercise_categories,
              totalRound : this.state.totalRound,
              totalKcal : this.state.totalKcal,
              onPressAddFitness : this.onPressAddFitness,
              confirmAddFitness : this.confirmAddFitness,
              editFitnessButtonPress : this.editFitnessButtonPress,
              cancelEditFitButton : this.cancelEditFitButton,
              confirmEditFitness : this.confirmEditFitness,
              removeExerciseData : this.removeExerciseData,
            })
      }else{
        //체크되어있는 데이터값을 초기화
        for(var j=0 ; j < this.props.exercise_categories.length; j++){
          this.props.exercise_categories[j].checked = false 
        }
        const isTodayData = true;
        Actions.EditFittness({
          isTodayData : isTodayData, //신규 날자 데이터 생성
          selectedDay : this.state.selectedDay, 
          daily_record : this.state.daily_record, 
          exerciseList : [],
          selcetExersiseList : null,
          nonSelectExersiseList : this.props.exercise_categories,
          editFitnessButtonPress : this.editFitnessButtonPress,
          cancelEditFitButton : this.cancelEditFitButton,
          confirmEditFitness : this.confirmEditFitness,
          removeExerciseData : this.removeExerciseData,
        })
      }
    }
  };
  
  confirmEditFitness(exerciseListData){ 
    return()=>{
      
      this.setState({
        daily_record : exerciseListData
      });
      
     
      this.props.exercise_categories.filter(
        function (exercise_categories) { 
          for( var i =0 ; i < exerciseListData.length ; i++){
            if( exercise_categories.id == exerciseListData[i].id ){
              return exercise_categories.checked = true
          }
        }
      });

      const mergeDayData =[];
      const toDay = exerciseListData[this.state.selectedDay].exercise_list 
      let toDayCopy = Object.assign({},toDay)
      let toDayCopyObj = JSON.parse(JSON.stringify(toDayCopy));
      let kcal = 0;
      let round = 0;
         
      const title = this.props.exercise_categories.filter(
       function (exercise_categories) { 
         for( var i =0 ; i < toDay.length ; i++){
           if( exercise_categories.id == toDay[i].exercise_id ){
             return true
           }
         }
       }); 

      for(var i = 0 ; i < toDay.length ; i ++ ){
        mergeDayData.push(Object.assign(toDayCopyObj[i], title[i]))
        kcal += (toDay[i].rounds * toDay[i].kcal);
        round += (toDay[i].rounds);
      }
      
      this.setState({
         mergeDayData : update(this.state.mergeDayData,{$set: mergeDayData}), 
      });
      
      if(exerciseListData){
        this.props.updateExerciseList(this.state.selectedDay, exerciseListData)
        
        const daily_record_length = Object.keys(this.props.daily_record).length;
        const exerciseListData_length = Object.keys(exerciseListData).length;
        
        Actions.AddFitness({
          cancelKey : daily_record_length !== exerciseListData_length ? null  : this.props.daily_record[this.state.selectedDay].exercise_list.length,
          selectedDay: this.state.selectedDay, 
          daily_record : exerciseListData[this.state.selectedDay], 
          mergeDayData : mergeDayData,
          totalRound : round,
          totalKcal : kcal,
          onPressAddFitness : this.onPressAddFitness,
          confirmAddFitness : this.confirmAddFitness,
          editFitnessButtonPress : this.editFitnessButtonPress,
          cancelEditFitButton : this.cancelEditFitButton,
          dotColor : daily_record_length !== exerciseListData_length ? "green"  : this.props.markedDates[this.state.selectedDay].dotColor,
          onPressCancelAddFitness : this.onPressCancelAddFitness
        });

      }else{
        console.log("데이타없음");
      }
    };
  };
  
  removeExerciseData(index){
    return ()=> {
      console.log("현재데이터값",this.props.state);
      console.log("인자로 전달 받은 인덱스값",index);
    }
  };

  removeDailyData(){
    return ()=> {
      this.props.removeDailyData(this.state.selectedDay);
    } 
  };

  render() {
    const customCalendar = (        
        <View style={styles.naviBar1}>
           <TouchableOpacity onPress={this.subjectSettingOnpress}>
              <Text style={{marginTop:38, marginLeft:20, color:'white',}}>목표설정</Text>
           </TouchableOpacity>
           <TouchableOpacity style={{ marginLeft: 48 }}>
              <MaterialIcons color="white" size={30} name="navigate-before" style={{marginTop:30}} />
           </TouchableOpacity>
           <Text style={{ color:"white" ,fontSize:16, marginTop:35,}}>{this.state.selectedDay}</Text>     
           <TouchableOpacity style={{ }}>
              <MaterialIcons color="white" size={30} name="navigate-next" style={{marginTop:30}} />
           </TouchableOpacity>
        </View>
        );
    const removeDataCalendar = (        
        <View style={styles.naviBar2}>
          <TouchableOpacity 
            style={{flex:1, alignItems: 'flex-start',  justifyContent:"center",  marginLeft:8}} 
            onPress={()=>{
              this.setState({
                isRemoveData:false
              })  
            }}
          >
            <EvilIcons color="white" size={45} name="close-o" style={styles.naviTopIcon} />
          </TouchableOpacity>
          
          <View style={{flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center" }}>
           <Text style={{ color:"#fff", fontWeight:"800"}}>삭제하시겠습니까?</Text>
          </View>
          
          <TouchableOpacity 
            style={{
              flex:1, 
              alignItems: 'flex-end',  
              justifyContent:"center", 
            }}
            onPress={this.removeDailyData()}
          >
            <EvilIcons color="white" size={45} name="check" style={styles.naviTopIcon} />
          </TouchableOpacity>
          
        </View>
          );        
    const defaultClandar = (        
        <View style={styles.naviBar2}>
           <TouchableOpacity style={{alignItems: 'flex-start', marginLeft:-15,}}  onPress={this.onPressConfirm} >
              <EvilIcons color="white" size={45} name="close-o" style={{marginTop:25}} />
           </TouchableOpacity>
           <Text style={{ color:"white" ,fontSize:16, marginTop:32,}}>목표설정 날자를 선택하세요</Text>
           <TouchableOpacity style={{alignItems: 'flex-end', marginRight:-15 }}  onPress={this.onPressConfirm} >
              <EvilIcons color="white" size={45} name="check" style={{marginTop:25}} />
           </TouchableOpacity>
        </View>
        );
    const removeButton =  (
      <View>
        <TouchableOpacity 
          style={{ alignItems : 'flex-end' , marginTop:30, marginRight:15}}
          onPress={
            ()=>{
              this.setState({isRemoveData: true })
            }
          }
        >
          <EvilIcons color="white" size={40} name="minus" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{alignItems : 'flex-end', marginTop:5, marginRight:15}}
          onPress={this.onPressAddFitness(this.state.selectedDay)}
        >
          <EvilIcons color="white" size={40} name="plus" />
        </TouchableOpacity> 
      </View>
      );
    const addButton = (
      <TouchableOpacity 
          style={{alignItems : 'flex-end', marginTop:50, marginRight:15}}
          onPress={this.onPressAddFitness(this.state.selectedDay)}
      >
          <EvilIcons color="white" size={40} name="plus" />
      </TouchableOpacity>  
    );

    return (
      <View style={styles.container}>
        { this.state.isSubject ? defaultClandar : 
          this.state.isRemoveData ? removeDataCalendar : customCalendar }
        <View style={styles.calendar}>
          <Calendar
            markedDates={
              this.props.markedDates
            }
            onDayPress={this.onDayPressBasic}
            style={{ paddingTop: 50, flex: 1 }}
            monthFormat={'yyyy MM'}
          />
        </View> 

        <View style={styles.naviBottom}>
          { 
            this.state.totalRound !== null ? 
            <View style={{flex:7, alignItems : 'flex-start', paddingTop:40 }}>
              <Text style={{ marginLeft:20, color:'#ccc', fontSize:20 }}>
               <Text style={{fontWeight:"bold",}}>{this.state.totalRound}</Text> 라운드
              </Text>
              <Text style={{ marginLeft:20, color:'#ccc', fontSize:20 }}>
               <Text style={{fontWeight:"bold",}}>{this.state.totalKcal}</Text> 칼로리
              </Text>
            </View>
           :<View style={{flex:7, alignItems : 'flex-start', paddingTop:50 }}>          
              <Text style={{ marginLeft:20, color:'#ccc', fontSize:20 }}>
               운동정보가 없습니다.
              </Text>
            </View>
          }
          <View style={{alignItems : 'flex-end',  }} >

            { this.props.daily_record[this.state.selectedDay] ?            
              removeButton : addButton       
            }
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent: "center" ,
    backgroundColor: '#46bd9d'
  },
  naviBar1 : {
    flex : 2.5,
    backgroundColor: '#46bd9d',
    flexDirection: "row",
    paddingTop:0,
  },
  naviBar2 : {
    flex : 2.5,
    backgroundColor: 'red',
    flexDirection: "row",
    paddingTop: 0,
  },
  naviBar2 : {
    flex : 2.5,
    justifyContent: "space-around" ,
    backgroundColor: '#46bd9d',
    flexDirection: "row",
    paddingTop: 0,
  },
  calendar : {
    flex : 15,
    paddingTop: 50,
    backgroundColor: '#fff'
  },
  naviBottom : {
    flex : 4,
    flexDirection: "row",
    backgroundColor: '#117e85'
  }
});

const mapStateToProps = (state) => {
   return {
        state : state,
   	    daily_record : state.reducers.daily_record,
   	    exercise_categories : state.reducers.exercise_categories,
   	    markedDates : state.reducers.markedDates
   }; 
};

const mapDispatchToProps = (dispatch) =>{
	return {
    storeChanger : (fireData) => {dispatch(actions.storeChanger(fireData))},
    removeDailyData : (selectedDay) => {dispatch(actions.removeDailyData(selectedDay))},

    updateTofitnessData : (totalData,dateString) => {

      console.log(firebase)
      const fireDataBase_daily_record = firebase.database().ref().child("/daily_record");
      const fireDataBase_markedDates = firebase.database().ref().child("/markedDates");

      fireDataBase_daily_record.child(dateString).set({
        ...totalData.daily_record
      })

      fireDataBase_markedDates.child(dateString).set({
          marked: true, 
          dotColor: totalData.markedType, 
          activeOpacity: 0,
          selected: false
      })
  
      dispatch(actions.updateTofitnessData(totalData,dateString))
    },
    
		deleteDaySelected : (dateString) => {dispatch(actions.deleteDaySelected(dateString))},
		daySelectCreator : (dateString, isHaveDate) => {dispatch(actions.daySelectCreator(dateString, isHaveDate))},
		updateExerciseList : (dateString, exerciseListData) => {dispatch(actions.updateExerciseList(dateString, exerciseListData))},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarBasic);
