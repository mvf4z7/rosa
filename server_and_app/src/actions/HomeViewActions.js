import alt from '../alt';

class HomeViewActions {
	setSelectedProfileIdx(data) {
		this.dispatch(data);
	}
}

module.exports = alt.createActions(HomeViewActions);
