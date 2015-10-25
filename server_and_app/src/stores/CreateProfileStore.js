import alt from '../alt';
import CreateProfileActions from '../actions/CreateProfileActions';

class CreateProfileStore {
    constructor() {
        this.profileName = '';

        this.bindListeners({
            handleSetProfileName: CreateProfileActions.SET_PROFILE_NAME
        });
    }

    handleSetProfileName(data) {
        this.profileName = data.profileName;
    }
}

module.exports = alt.createStore(CreateProfileStore, 'CreateProfileStore');
