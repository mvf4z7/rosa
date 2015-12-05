import alt from '../alt';
import HomeViewActions from '../actions/HomeViewActions';
import TempProfileActions from '../actions/TempProfileActions';

class HomeViewStore {
    constructor() {
        this.selectedProfileName = null;

        this.bindListeners({
            handleSetSelectedProfileName: HomeViewActions.SET_SELECTED_PROFILE_NAME,
            handleProfileDeleted: TempProfileActions.PROFILE_DELETED
        });
    }

    handleSetSelectedProfileName(data) {
        this.selectedProfileName = data.selectedProfileName;
        console.log('set selectedProfileName: ', data.selectedProfileName);
    }

    handleProfileDeleted(data) {
        if(this.selectedProfileName === data.profileName) {
            this.selectedProfileName = null;
        }


        if(data.index == this.selectedProfileIdx) {
            this.selectedProfileIdx = null;
        } else if(data.index < this.selectedProfileIdx) {
            this.selectedProfileIdx = this.selectedProfileIdx - 1;
        }
    }
}

module.exports = alt.createStore(HomeViewStore, 'HomeViewStore');
