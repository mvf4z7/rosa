import alt from '../alt';
import CreateProfileActions from '../actions/CreateProfileActions';

class CreateProfileStore {
    constructor() {
        this.profile = {
            name: '',
            points: [[0,25],[30, 100], [100, 200], [0,25],[30, 100], [100, 200], [0,25],[30, 100], [100, 200]],
            lines: []
        };

        this.bindListeners({
            handleSetProfileName: CreateProfileActions.SET_PROFILE_NAME,
            handleAddPoint: CreateProfileActions.ADD_POINT
        });
    }

    handleSetProfileName(data) {
        this.profile.name = data.profileName;
    }

    handleAddPoint(data) {
        console.log('points before: ', this.profile.points);
        this.profile.points = this.profile.points.concat([[]]);
        console.log('points after: ', this.profile.points);
    }
}

module.exports = alt.createStore(CreateProfileStore, 'CreateProfileStore');
