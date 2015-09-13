import alt from '../alt';
import LocationActions from '../actions/LocationActions';

class LocationStore {
  constructor() {
    this.locations = ['STL', 'MIA'];

    this.bindListeners({
      handleUpdateLocations: LocationActions.UPDATE_LOCATIONS,
      handleAddLocation: LocationActions.ADD_LOCATION
    });
  }

  handleUpdateLocations(locations) {
    this.locations = locations;
  }

  handleAddLocation(location) {
      this.locations.push(location);
  }
}

module.exports = alt.createStore(LocationStore, 'LocationStore');
