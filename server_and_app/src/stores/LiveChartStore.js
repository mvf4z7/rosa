import alt from '../alt';
import LiveChartActions from '../actions/LiveChartActions';

class LiveChartStore {
	constructor() {
		this.liveData = [];

	    this.bindListeners({
			handleUpdateLiveData: LiveChartActions.UPDATE_LIVE_DATA,
			handleClearLiveData: LiveChartActions.CLEAR_LIVE_DATA
	    });
	}

	handleUpdateLiveData(data) {
		this.liveData = this.liveData.slice();
		this.liveData.push(data);
	}

	handleClearLiveData() {
		this.liveData = [];
	}
}

module.exports = alt.createStore(LiveChartStore, 'LiveChartStore');
