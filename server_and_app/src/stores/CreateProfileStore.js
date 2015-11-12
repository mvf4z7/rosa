import alt from '../alt';
import CreateProfileActions from '../actions/CreateProfileActions';

class CreateProfileStore {
    constructor() {
        this.profile = {
            name: '',
            points: [[1,1],[2, 2], [3, 3], [4,4]],
            lines: []
        };

        this.bindListeners({
            handleSetProfileName: CreateProfileActions.SET_PROFILE_NAME,
            handleAddPoint: CreateProfileActions.ADD_POINT,
            handleDeletePoint: CreateProfileActions.DELETE_POINT,
            handleModifyPoint: CreateProfileActions.MODIFY_POINT
        });
    }

    handleSetProfileName(data) {
        this.profile.name = data.profileName;
    }

    handleAddPoint(data) {
        this.profile.points = this.profile.points.concat([[]]);
    }

    handleDeletePoint(data) {
        this.profile.points.splice(data.index, 1);
        this.profile.points = this.profile.points.slice();
    }

    handleModifyPoint(data) {
        console.log(data);
        this.profile.points = this.profile.points.slice();
        this.profile.points[data.index] = [data.time, data.temp];
        console.log(JSON.stringify(this.profile.points));
    }
}

module.exports = alt.createStore(CreateProfileStore, 'CreateProfileStore');
