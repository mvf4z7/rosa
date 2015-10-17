import alt from '../alt';
import OvenActions from '../actions/OvenActions';

class OvenStore {
	constructor() {
		this.ovenOn = null;

	    this.bindListeners({
			handleFetchOvenState: OvenActions.FETCH_OVEN_STATE,
			handleSetOvenOn: OvenActions.SET_OVEN_ON
	    });
	}

	handleFetchOvenState() {
		this.ovenOn = null;
	}

	handleSetOvenOn(data) {
		this.ovenOn = data.ovenOn;
	}
}

module.exports = alt.createStore(OvenStore, 'OvenStore');
