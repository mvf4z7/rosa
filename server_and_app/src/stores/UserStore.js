import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.users = [];
        this.selectedUserIdx = null;

        this.bindListeners({
            handleFetchUsers: UserActions.FETCH_USERS,
            handleSetUsers: UserActions.SET_USERS,
            handleSetSelectedUserIdx: UserActions.SET_SELECTED_USER_IDX
        });
      }

  handleFetchUsers() {
      this.users = [];
      this.selectedProfileIdx = null;
  }

  handleSetUsers(data) {
      this.users = data.users;
  }

  handleSetSelectedUserIdx(data) {
      this.selectedUserIdx = data.selectedUserIdx;
  }
}

module.exports = alt.createStore(UserStore, 'UserStore');
