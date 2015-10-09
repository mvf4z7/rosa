/*
sock.on(data, fire action with data)

actionfunc(pass new data to store);

storeHandler(set variable newData)


in home view
	- subscribe to livechart store
	- pass newValue to liveChart component via props
*/

import alt from '../alt';
import LiveChartActions from '../actions/LiveChartActions';

class LiveChartStore {
	constructor() {
		this.liveData = [];
  // 		this.newData = null;
		// this.newTime = null;

	    this.bindListeners({
	        handleAddNewData: LiveChartActions.ADD_NEW_DATA,
			handleUpdateLiveData: LiveChartActions.UPDATE_LIVE_DATA,
			handleClearLiveData: LiveChartActions.CLEAR_LIVE_DATA
	    });
	}

	handleUpdateLiveData(data) {
		this.liveData.push([data.time, data.temp]);
		console.log('updateLiveData: ', data);
		console.log('liveData array: ', this.liveData);
	}

	handleClearLiveData() {
		console.log('clearing live data');
		this.liveData = [];
	}

	handleAddNewData(data) {
		this.newData = data.temp;
		this.newTime = data.time;
	}
}

module.exports = alt.createStore(LiveChartStore, 'LiveChartStore');
