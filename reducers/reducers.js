import * as AppType from '../actions/ActionTypes'
import update from 'immutability-helper'; // 2.6.5
import { database } from '../firebase/Config'
import * as firebase from 'firebase'

const fireDataBase_daily_record = firebase.database().ref().child("/daily_record");
//const fireDataBase_markedDates = firebase.database().ref("user/"+uid).child("/markedDates");

const initialState = {
  daily_record: {
  },
  exercise_categories: [
    {
      id: 1,
      title: '줄넘기',
      kcal_per_round: 28,
      checked : false
    },
    {
      id: 2,
      title: '샌드백',
      kcal_per_round: 38,
      checked : false
    },
    {
      id: 3,
      title: '쉐도우복싱',
      kcal_per_round: 38,
      checked : false
    },
    {
      id: 4,
      title: '스파링',
      kcal_per_round: 38,
      checked : false
    },
    {
      id: 5,
      title: '메소드복싱',
      kcal_per_round: 38,
      checked : false
    },
  ],
  memoData:{
  },
  markedDates:{
  },
}
const storeChanger = (state, fireData, uid)=>{
  return {
    ...state,
    ...fireData
  }
}

const daySelectCreator = (state, markedData, uid) => {

  firebase.database().ref("users/"+uid+"/markedDates/").set({
    ...markedData
  })

  return {
    ...state,
    markedDates : {
      ...markedData
    }
  };

}

const updateExerCiseList = (state , dateString, exerciseListData) => {
   return {
      ...state,
      daily_record : {
        ...state.daily_record,
        [dateString]: {
          ...state.daily_record[dateString],
          exercise_list : exerciseListData[dateString].exercise_list,
          totalKcal : exerciseListData[dateString].totalKcal,
          totalRound : exerciseListData[dateString].totalRound,
          memoData : "간단한 메모를 작성해 보세요"
        }
      }
   };
}

const updateTofitData = (state, totalData, dateString) => {
   return {
      ...state,
      daily_record : {
        ...state.daily_record,
        [dateString]: totalData.daily_record
      },
      markedDates : {
        ...state.markedDates,
        [dateString] : {
          marked: true, 
          dotColor: totalData.markedType, 
          activeOpacity: 0,
          selected: false,
        }
      }
   };
}

const removeDailyData = (state, selectedDay) =>{
  let obj = state;
  delete obj.daily_record[selectedDay]
  delete obj.markedDates[selectedDay]
  return {
    ...state,
    obj
  }
}

const confirmMemoData = (state, selectedDay, memoData) =>{
  return {
    ...state,
    daily_record : {
      ...state.daily_record,
      [selectedDay]: {
        ...state.daily_record[selectedDay],
        memoData : memoData
      }
    },
  }
} 

export default function reducer(state = initialState , action ){
  switch (action.type){
		case AppType.SELECT_DAY:
			return daySelectCreator(state, action.markedData,action.uid)
    case AppType.CREATE_FITNESS_DATA:
    //   return createfitnessData(state, action.totalData, action.dateString)  
    // case AppType.UPDATE_TO_FITNESS_DATA:
      return updateTofitData(state, action.totalData, action.dateString)  
    case AppType.UPDATE_EXERCISE_LIST:
      return updateExerCiseList(state, action.dateString, action.exerciseListData) 
    case AppType.REMOVE_DAILY_DATA:
      return removeDailyData(state, action.selectedDay)   
    case AppType.STORE_CHANGER:
      return storeChanger(state, action.fireData, action.uid)   
    case AppType.CONFIRM_MEMODATA:
      return confirmMemoData(state, action.selectedDay, action.memoData)   
		default :	
			return state;	
  }
}

