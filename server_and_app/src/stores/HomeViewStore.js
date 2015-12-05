import alt from '../alt';
import HomeViewActions from '../actions/HomeViewActions';
import TempProfileActions from '../actions/TempProfileActions';

class HomeViewStore {
    constructor() {
        this.selectedProfileIdx = null;

        this.bindListeners({
            handleSetSelectedProfileIdx: HomeViewActions.SET_SELECTED_PROFILE_IDX,
            handleProfileDeleted: TempProfileActions.PROFILE_DELETED
        });
    }

    handleSetSelectedProfileIdx(data) {
        this.selectedProfileIdx = data.selectedProfileIdx;
        console.log('set selectedProfileIdx: ', data.selectedProfileIdx);
    }

    handleProfileDeleted(data) {
        if(data.index == this.selectedProfileIdx) {
            this.selectedProfileIdx = null;
        } else if(data.index < this.selectedProfileIdx) {
            this.selectedProfileIdx = this.selectedProfileIdx - 1;
        }
    }
}

module.exports = alt.createStore(HomeViewStore, 'HomeViewStore');
