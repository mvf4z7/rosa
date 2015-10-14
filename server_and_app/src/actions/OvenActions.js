import alt from '../alt';

class OvenActions {
    setOvenOn(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(OvenActions);
