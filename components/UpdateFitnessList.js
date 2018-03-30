import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo, FontAwesome, SimpleLineIcons} from "@expo/vector-icons" // 6.2.2
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
//import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28
export default class UpdateFitnessList extends React.Component {
  constructor(props){
    super(props)
    this.state={
      checkedData: this.props.selcetExersiseList,
      exerciseData : this.props.exerciseData,
      exerciseList : this.props.exerciseList
    }
  }

  render() {
    return (
      <View style={styles.fitnessList}>
        <TouchableOpacity style={styles.fitnessListInline} onPress={this.props.checkedHandler(this.props.index)}>
          <View style={styles.fitListEvent}> 
            {
            this.props.exerciseData[this.props.index].checked ? 
              <TouchableOpacity>
                <Entypo color="#46bd9d" size={22} name="check" style={{marginTop:-5}} />
              </TouchableOpacity>
             :  null
            }
            <Text>{this.props.title}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 4 , flexDirection:"row"}}>
          <Text style={{ flex:4, fontSize: 14, marginTop:3, color:"#333", alignItems:'flex-end' }}>
            {this.props.kcal}Kcal
          </Text>
          {
           this.props.isModifyTool ?
           <View style={{ flex: 4 , flexDirection:"row"}}>
             <TouchableOpacity style={styles.fitListRound} 
             onPress={this.props.removeExerciseData(this.props.index)}
             >
              <FontAwesome color="#46bd9d" size={22} name="trash-o" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.fitListRound} >
              <SimpleLineIcons color="#46bd9d" size={18} name="wrench" style={{marginTop:2}} />
             </TouchableOpacity>
           </View> : null 
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fitnessList: {
    height:50,
    flexDirection:"row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor:"#ccc",
  },
  fitnessListInline: {
    height:50,
    flexDirection:"row",
    alignItems: "center",
    width: "70%",
  },
  fitListRound : {
    flex: 2,
    color: "#555"
  },
  fitListEvent:{
    flex: 9,
    flexDirection:"row",
  },
});