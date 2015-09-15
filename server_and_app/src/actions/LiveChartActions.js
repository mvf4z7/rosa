import alt from '../alt';

class LiveChartActions {
	addNewData(data) {
		this.dispatch(data);
	}
}

module.exports = alt.createActions(LiveChartActions);
