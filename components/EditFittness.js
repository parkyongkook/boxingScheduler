import React from 'react';
import UpdateFitnessList from './UpdateFitnessList';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Entypo, FontAwesome } from "@expo/vector-icons" // 6.2.2
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
import update from 'immutability-helper'; // 2.6.5
import "redux"; // 4.0.0-beta.2
 // 4.0.0-beta.2
//nonSelectExersiseList
export default class EditFittness extends React.Component {
   constructor(props){
    super(props)
    this.state = {
      isModifyTool : false,
      daily_record :this.props.daily_record, //이게 문제다 원천값을
      nonSelectExersiseList : this.props.nonSelectExersiseList,
      selcetExersiseList : this.props.selcetExersiseList,
      exerciseList : this.props.exerciseList,
    }
    this.checkedHandler = this.checkedHandler.bind(this);

  }
  //현재 날자가 없는경우 날자를 생성.
  componentWillMount(){
      if(this.props.isTodayData){
          const daily_record = this.state.daily_record
          const daily_recordChanged = {
          	...daily_record,
            [this.props.selectedDay] : {
              exercise_list : [],
              totalKcal : 0,
              totalRound : 0
            }
          }
          this.setState({
            daily_record : daily_recordChanged
          })
     }
  }
  
  checkedHandler(index){
    let idx = 0;
    return ()=>{
       if(this.state.nonSelectExersiseList[index].checked){//현재 요소에 체크값이 트루면
        for(var i = 0 ; i < this.state.exerciseList.length ; i++ ){
          if( this.state.exerciseList[i].exercise_id !== this.state.nonSelectExersiseList[index].id ){
              idx += 1
          }else{
            break
          }
        } 
        this.setState({
          nonSelectExersiseList: update(this.state.nonSelectExersiseList, { 
              [index]:{
            		checked: {$set: false},
            	} 
          }),
          exerciseList: update(this.state.exerciseList, { 
            $splice: [[idx, 1]]
          }),
          daily_record : update(this.state.daily_record, {
              [this.props.selectedDay] : {
                  exercise_list : {$splice: [[idx, 1]]}
              }
          }),
        })
       }else{//현재 요소에 체크값이 펄스면
         if( this.state.selcetExersiseList !== null ){
            this.setState({
              nonSelectExersiseList: update(this.state.nonSelectExersiseList, { 
                  [index]:{
                		checked: {$set: true},
                	} 
              }),      
              exerciseList: update(this.state.exerciseList, {
                   $push:[{
                    exercise_id: index+1,
                    rounds: 1,
                    kcal:this.state.nonSelectExersiseList[index].kcal_per_round,
                  }]
              }),
              daily_record : update(this.state.daily_record, {
                  [this.props.selectedDay] : {
                      exercise_list : {
                        $push:[{
                        exercise_id: index+1,
                        rounds: 1,
                        kcal:this.state.nonSelectExersiseList[index].kcal_per_round
                      }]
                    }
                  }
              }),
            })
         }else{
           this.setState({
              nonSelectExersiseList: update(this.state.nonSelectExersiseList, { 
                  [index]:{
                		checked: {$set: true},
                	} 
              }),      
              exerciseList: update(this.state.exerciseList, {
                   $push:[{
                    exercise_id: index+1,
                    rounds: 1,
                    kcal:this.state.nonSelectExersiseList[index].kcal_per_round,
                  }]
              }),
              daily_record : update(this.state.daily_record, {
                  [this.props.selectedDay] : {
                      exercise_list : {
                        $push:[{
                        exercise_id: index+1,
                        rounds: 1,
                        kcal:this.state.nonSelectExersiseList[index].kcal_per_round
                      }]
                    },
                    totalKcal:{$set:this.state.daily_record[this.props.selectedDay].totalKcal + this.state.nonSelectExersiseList[index].kcal_per_round},
                    totalRound:{$set:this.state.daily_record[this.props.selectedDay].totalRound+1},
                  }
              }),
            })
            
         }
      }
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle ='light-content' />
        <View style={styles.naviBar}>
           <TouchableOpacity style={{flex:1, alignItems: 'flex-start',  justifyContent:"center",  marginLeft:15, }} onPress={this.props.cancelEditFitButton()}>
              <FontAwesome color="white" size={40} name="chevron-circle-left" style={styles.naviTopIcon} />
           </TouchableOpacity>
           <View style={{flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center" }}>
             <Text style={{ color:"white" ,fontSize:16, marginTop:25 }}>
               운동을 선택하세요
             </Text>
           </View>
           <TouchableOpacity style={{flex:1, alignItems: 'flex-end',  justifyContent:"center", marginRight:15, }} onPress={this.props.confirmEditFitness(this.state.daily_record)} >
              <FontAwesome color="white" size={40} name="check-circle" style={styles.naviTopIcon} />
           </TouchableOpacity>
        </View>       
        <View style={styles.calendar}>
          <ScrollView style={{ height: 250, width: "90%", }}>
            <View style={styles.fitnessList}>
              <Text style={styles.fitListItem}> Event </Text>
              <Text style={{ flex: 3, textAlign:"center", color: "#555" }}>1R Per Cal </Text>
            </View>
            {this.state.nonSelectExersiseList ? this.state.nonSelectExersiseList.map((mapData, i) => {
              return (<UpdateFitnessList 
                        isModifyTool={this.state.isModifyTool}
                        removeExerciseData={this.props.removeExerciseData}
                        selcetExersiseList={this.state.selcetExersiseList}
                        exerciseData={this.state.nonSelectExersiseList}
                        exerciseList={this.state.exerciseList}
                        checkedHandler={this.checkedHandler}
                        title={mapData.title}
                        kcal={mapData.kcal_per_round}
                        index={i}
                        key={i}
                      />);
              })
             : null}
          </ScrollView>
        </View>
        <View style={styles.naviBottom}>
          <View style={{flexDirection:"row", width:"40%", position:"absolute", left:"34%", top:"15%", }}>
            <TouchableOpacity style={{alignItems:"center", width:45, height:45, marginTop:4, backgroundColor:"#46bd9d", borderRadius:25,}} 
              onPress={
                ()=>{this.setState({isModifyTool:true})}
              }
            >
              <FontAwesome color="#fff" size={30} name="gear" style={{marginTop:7,}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomIcon}>
              <Entypo color="#46bd9d" size={50} name="circle-with-plus" />
            </TouchableOpacity>
          </View> 
        </View>
      </View>
    );
  }
}

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
    backgroundColor: '#fff'
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
  bottomIcon :{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  }
});
