import alt from '../alt';
import OvenActions from '../actions/OvenActions';

class OvenStore {
	constructor() {
		this.ovenOn = false;

	    this.bindListeners({
			handleSetOvenOn: OvenActions.SET_OVEN_ON
	    });
	}

	handleSetOvenOn(data) {
		this.ovenOn = data.ovenOn;
	}
}

module.exports = alt.createStore(OvenStore, 'OvenStore');
