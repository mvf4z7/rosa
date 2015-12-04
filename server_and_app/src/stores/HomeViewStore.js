import alt from '../alt';
import HomeViewActions from '../actions/HomeViewActions';

class HomeViewStore {
    constructor() {
        this.selectedProfileIdx = null;

        this.bindListeners({
            handleSetSelectedProfileIdx: HomeViewActions.SET_SELECTED_PROFILE_IDX
        });
    }

    handleSetSelectedProfileIdx(data) {
        this.selectedProfileIdx = data.selectedProfileIdx;
        console.log('set selectedProfileIdx: ', data.selectedProfileIdx);
    }
}

module.exports = alt.createStore(HomeViewStore, 'HomeViewStore');
