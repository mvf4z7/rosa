import alt from '../alt';
import CreateProfileActions from '../actions/CreateProfileActions';

class CreateProfileStore {
    constructor() {
        this.profile = {
            name: '',
            points: [[0, 23]],
            lines: []
        };

        this.bindListeners({
            handleSetProfileName: CreateProfileActions.SET_PROFILE_NAME,
            handleAddPoint: CreateProfileActions.ADD_POINT,
            handleDeletePoint: CreateProfileActions.DELETE_POINT,
            handleModifyPoint: CreateProfileActions.MODIFY_POINT,
            handleClearPoints: CreateProfileActions.CLEAR_POINTS,
            handleSaveProfile: CreateProfileActions.SAVE_PROFILE
        });
    }

    handleSetProfileName(data) {
        this.profile.name = data.profileName;
    }

    handleAddPoint() {
        this.profile.points = this.profile.points.concat([[]]);
    }

    handleDeletePoint(data) {
        this.profile.points.splice(data.index, 1);
        this.profile.points = this.profile.points.slice();
    }

    handleModifyPoint(data) {
        this.profile.points = this.profile.points.slice();
        this.profile.points[data.index] = [data.time, data.temp];
    }

    handleClearPoints(data) {
        this.profile.points = [[]];
    }

    handleSaveProfile() {
        this._clearProfile();
    }

    _clearProfile() {
        this.profile = {
                name: '',
                points: [[0, 23]],
                lines: []
        }
    }
}

module.exports = alt.createStore(CreateProfileStore, 'CreateProfileStore');
