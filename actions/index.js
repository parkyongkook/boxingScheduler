import * as AppType from './ActionTypes';

export function daySelectCreator(dateString, isHaveDate){
	return {
		type : AppType.SELECT_DAY,
		dateString : dateString,
		isHaveDate : isHaveDate
	}
}

export function deleteDaySelected(dateString){
	return {
		type : AppType.DELETE_SELECT_DAY,
		dateString : dateString
	}
}

export function updateTofitnessData(totalData,dateString){
	return {
		type : AppType.UPDATE_TO_FITNESS_DATA,
		totalData: totalData,
		dateString: dateString
	}
}

export function createfitnessData(totalData, dateString){
	return {
		type : AppType.CREATE_FITNESS_DATA,
		totalData: totalData,
		dateString: dateString
	}
}


export function updateExerciseList(dateString, exerciseListData){
	return {
		type : AppType.UPDATE_EXERCISE_LIST,
		exerciseListData: exerciseListData,
		dateString: dateString
	}
}

export function removeDailyData(selectedDay){
	return {
		type : AppType.REMOVE_DAILY_DATA,
		selectedDay: selectedDay
	}
}

export function storeChanger(fireData){
	return {
		type : AppType.STORE_CHANGER,
		fireData : fireData
	}
}








