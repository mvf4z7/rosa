import alt from '../alt';
import request from 'superagent';
import { move } from '../utilities';

class UserActions {
    fetchUsers() {
        this.dispatch();

        request
            .get('/api/allusers')
            .end((err, res) => {
                let users = res.body.users;

                this.actions.setUsers({ users: users });
                this.actions.setSelectedUserIdx({ selectedUserIdx: 0 });
            });
    }

    setUsers(data) {
        this.dispatch(data);
    }

    setSelectedUserIdx(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(UserActions);
