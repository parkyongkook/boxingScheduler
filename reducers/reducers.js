import * as AppType from '../actions/ActionTypes'
import update from 'immutability-helper'; // 2.6.5

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
const storeChanger = (state, fireData)=>{
  console.log("fireData",fireData)
  return {
    ...state,
    ...fireData
  }
}

const startCheckedChanger = (state, dateString, isHaveDate) => {
  const markedDates = Object.assign({}, state.markedDates, {
    [dateString]: { selected: true }
  });
  if( isHaveDate === true ){
     return {
      ...state,
      markedDates : {
        ...state.markedDates,
        [dateString] : { 
        ...state.markedDates[dateString],  
          selected : true
        }
      }
    };
  }else{
    return {
      ...state,
      markedDates
    };
  }
}

const deleteDaySelected = (state, dateString) => {
  return {
    ...state,
    markedDates : {
      ...state.markedDates,
      [dateString] : { 
      ...state.markedDates[dateString],  
        selected : false
      }
    }
  };
}

const createfitnessData = (state, totalData, dateString) => {
   
}

const updateExerCiseList = (state , dateString, exerciseListData) => {
   return {
      ...state,
      daily_record : {
        ...state.daily_record,
        [dateString]: {
          ...state.daily_record[dateString],
          exercise_list : exerciseListData
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
  console.log(obj)
  return {
    ...state,
    obj
  }
}

export default function reducer(state = initialState , action ){
  switch (action.type){
		case AppType.SELECT_DAY:
			return startCheckedChanger(state, action.dateString, action.isHaveDate)
		case AppType.DELETE_SELECT_DAY:
      return deleteDaySelected(state, action.dateString)
    case AppType.CREATE_FITNESS_DATA:
      return createfitnessData(state, action.totalData, action.dateString)  
    case AppType.UPDATE_TO_FITNESS_DATA:
      return updateTofitData(state, action.totalData, action.dateString)  
    case AppType.UPDATE_EXERCISE_LIST:
      return updateExerCiseList(state, action.dateString, action.exerciseListData) 
    case AppType.REMOVE_DAILY_DATA:
      return removeDailyData(state, action.selectedDay)   
    case AppType.STORE_CHANGER:
      return storeChanger(state, action.fireData)   
		default :	
			return state;	
  }
}



