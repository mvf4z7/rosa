import alt from '../alt';
import TempProfileActions from '../actions/TempProfileActions';

class TempProfileStore {

    constructor() {
        this.profiles = [];
        this.defaultProfile = null;

        this.bindListeners({
            handleFetchProfiles: TempProfileActions.FETCH_PROFILES,
            handleSetProfiles: TempProfileActions.SET_PROFILES,
            handleDeleteProfile: TempProfileActions.DELETE_PROFILE,
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

    handleDeleteProfile(data) {
        this.profiles = [];
        this.defaultProfile = null;
    }

    handleSetDefaultProfile(data) {
        this.defaultProfile = data.defaultProfile;
    }
}

module.exports = alt.createStore(TempProfileStore, 'TempProfileStore');
