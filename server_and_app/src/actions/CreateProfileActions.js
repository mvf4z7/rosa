import alt from '../alt';

class CreateProfileActions {
    setProfileName(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(CreateProfileActions);
