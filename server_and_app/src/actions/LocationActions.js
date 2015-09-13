import alt from '../alt';

class LocationActions {
    updateLocations(locations) {
        this.dispatch(locations);
    }

    addLocation(location) {
        this.dispatch(location);
    }
}

module.exports = alt.createActions(LocationActions);
