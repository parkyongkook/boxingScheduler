import * as AppType from './ActionTypes';

export function daySelectCreator(markedData,uid){
	return {
		type : AppType.SELECT_DAY,
		markedData : markedData,
		uid : uid
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

export function storeChanger(fireData,uid){
	return {
		type : AppType.STORE_CHANGER,
		fireData : fireData,
		uid : uid
	}
}

export function confirmMemoData(selectedDay,memoData){
	return {
		type : AppType.CONFIRM_MEMODATA,
		selectedDay : selectedDay,
		memoData : memoData
	}
}






