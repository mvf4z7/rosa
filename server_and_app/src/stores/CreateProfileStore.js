import alt from '../alt';
import CreateProfileActions from '../actions/CreateProfileActions';

class CreateProfileStore {
    constructor() {
        this.profile = {
            name: '',
            points: [],
            lines: []
        };

        this.bindListeners({
            handleSetProfileName: CreateProfileActions.SET_PROFILE_NAME
        });
    }

    handleSetProfileName(data) {
        this.profile.name = data.profileName;
    }
}

module.exports = alt.createStore(CreateProfileStore, 'CreateProfileStore');
