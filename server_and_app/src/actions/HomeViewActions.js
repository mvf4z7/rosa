import alt from '../alt';

class HomeViewActions {
	setSelectedProfileName(data) {
		this.dispatch(data);
	}
}

module.exports = alt.createActions(HomeViewActions);
