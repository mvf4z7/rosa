import alt from '../alt';
import TempProfileActions from '../actions/TempProfileActions';

class TempProfileStore {

    constructor() {
        this.profiles = [];
        this.defaultProfileName = null;

        this.bindListeners({
            handleFetchProfiles: TempProfileActions.FETCH_PROFILES,
            handleSetProfiles: TempProfileActions.SET_PROFILES,
            handleDeleteProfile: TempProfileActions.DELETE_PROFILE,
            handleSetDefaultProfileName: TempProfileActions.SET_DEFAULT_PROFILE_NAME
        });
    }

    handleFetchProfiles() {
        this.profiles = [];
        this.defaultProfileName = null;
    }

    handleSetProfiles(data) {
        this.profiles = data.profiles;
    }

    handleDeleteProfile(data) {
        this.profiles = [];
        this.defaultProfileName = null;
    }

    handleSetDefaultProfileName(data) {
        this.defaultProfileName = data.defaultProfileName;
    }
}

module.exports = alt.createStore(TempProfileStore, 'TempProfileStore');
