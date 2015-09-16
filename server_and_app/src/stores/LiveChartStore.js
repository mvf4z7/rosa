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
  		this.newData = null;

	    this.bindListeners({
	        handleAddNewData: LiveChartActions.ADD_NEW_DATA,
	    });
	}

	handleAddNewData(data) {
		this.newData = data.temp;	
	}
}

module.exports = alt.createStore(LiveChartStore, 'LiveChartStore');
