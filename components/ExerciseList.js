import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, EvilIcons, MaterialIcons, Entypo } from "@expo/vector-icons" // 6.2.2
import { Actions } from 'react-native-router-flux'; // 4.0.0-beta.28


export default class ExerciseList extends React.Component {
  
  constructor(props){
    super(props)
  }
  
  render() {
    return (
      <View style={styles.fitnessList}>
        <Text style={styles.fitListItem}>
          {this.props.title}
        </Text>
        <View style={{flex:2,flexDirection:"row"}}>
          <Text style={{flex:1}}>
            {this.props.round}
          </Text>
          <TouchableOpacity style={styles.fitListRound} onPress={this.props.decreamentRounds(this.props.index)}>
            <Entypo color="#ccc" size={22} name="circle-with-minus" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fitListRound} onPress={this.props.increamentRounds(this.props.index)} >
            <Entypo color="#ccc" size={22} name="circle-with-plus" />
          </TouchableOpacity>
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
  fitListRound : {
    flex: 2,
    // color: "#555"
  },
  fitListItem : {
    flex: 9,
    color: "#555"
  }
});



