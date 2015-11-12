import alt from '../alt';

class CreateProfileActions {
    setProfileName(data) {
        this.dispatch(data);
    }

    addPoint() {
        this.dispatch();
    }
}

module.exports = alt.createActions(CreateProfileActions);
