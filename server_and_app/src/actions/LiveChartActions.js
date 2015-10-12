import alt from '../alt';

class LiveChartActions {
	updateLiveData(data) {
		this.dispatch(data);
	}

	clearLiveData() {
		this.dispatch();
	}
}

module.exports = alt.createActions(LiveChartActions);
