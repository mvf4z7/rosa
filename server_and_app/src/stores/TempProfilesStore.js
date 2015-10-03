import alt from '../alt';
import TempProfileActions from '../actions/NavigationActions';

let router = null;
let menuItems = null;

class TempProfileStore {
  constructor() {
    this.profiles = [];
    this.defaultIdx = null;
    this.selectedIdx = null;

    this.bindListeners({
        handleFetchProfiles: NavigationActions.FETCH_PROFILES,
        handleSetProfiles: NavigationActions.SET_PROFILES,
        handleSetDefaultIdx: NavigationActions.SET_DEFAULT_IDX
    });
  }

  handleFetchProfiles() {
      this.profiles = [];
      this.defaultIdx = null;
  }

  handleSetProfiles(data) {
      this.profiles = data.profiles;
  }

  handleSetDefaultIdx(data) {
      this.defaultIdx = data.defaultIdx;
  }
}

module.exports = alt.createStore(TempProfileStore, 'TempProfileStore');
