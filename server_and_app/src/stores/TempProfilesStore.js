import alt from '../alt';
import TempProfileActions from '../actions/TempProfileActions';

class TempProfileStore {

    constructor() {
        this.profiles = [];
        this.defaultProfile = null;

        this.bindListeners({
            handleFetchProfiles: TempProfileActions.FETCH_PROFILES,
            handleSetProfiles: TempProfileActions.SET_PROFILES,
            handleSetDefaultProfile: TempProfileActions.SET_DEFAULT_PROFILE
        });
    }

    handleFetchProfiles() {
        this.profiles = [];
        this.defaultProfile = null;
    }

    handleSetProfiles(data) {
        this.profiles = data.profiles;
    }

    handleSetDefaultProfile(data) {
        this.defaultProfile = data.defaultProfile;
    }
}

module.exports = alt.createStore(TempProfileStore, 'TempProfileStore');
