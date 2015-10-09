import alt from '../alt';

class LiveChartActions {
	addNewData(data) {
		this.dispatch(data);
	}

	updateLiveData(data) {
		this.dispatch(data);
	}

	clearLiveData() {
		this.dispatch();
	}
}

module.exports = alt.createActions(LiveChartActions);
