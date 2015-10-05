import alt from '../alt';
import TempProfileActions from '../actions/TempProfileActions';

let router = null;
let menuItems = null;

class TempProfileStore {
    constructor() {
        this.profiles = [];
        this.selectedProfileIdx = null;
        this.defaultProfile = null;

        this.bindListeners({
            handleFetchProfiles: TempProfileActions.FETCH_PROFILES,
            handleSetProfiles: TempProfileActions.SET_PROFILES,
            handleSetSelectedProfileIdx: TempProfileActions.SET_SELECTED_PROFILE_IDX,
            handleSetDefaultProfile: TempProfileActions.SET_DEFAULT_PROFILE
        });
      }

  handleFetchProfiles() {
      this.profiles = [];
      this.selectedProfileIdx = null;
      this.defaultProfile = null;
  }

  handleSetProfiles(data) {
      this.profiles = data.profiles;
  }

  handleSetSelectedProfileIdx(data) {
      this.selectedProfileIdx = data.selectedProfileIdx;
  }

  handleSetDefaultProfile(data) {
      this.defaultProfile = data.defaultProfile;
  }
}

module.exports = alt.createStore(TempProfileStore, 'TempProfileStore');
