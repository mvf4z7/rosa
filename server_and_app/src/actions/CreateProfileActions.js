import alt from '../alt';

class CreateProfileActions {
    setProfileName(data) {
        this.dispatch(data);
    }

    addPoint() {
        this.dispatch();
    }

    deletePoint(data) {
        this.dispatch(data);
    }

    modifyPoint(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(CreateProfileActions);
