import React from 'react';
import request from 'superagent';

import UserActions from '../../actions/UserActions';
import NavigationActions from '../../actions/NavigationActions';

import UserStore from '../../stores/UserStore';

import LiveHighchart from '../../components/live-highchart/live-highchart';
import { RaisedButton, TextField, SelectField, Dialog, FlatButton } from 'material-ui';

import styles from './styles';

require('./users.scss');

class Users extends React.Component {
    constructor() {
        super();

        let UserStoreState = UserStore.getState();

        this._handleTouchTapAdd = this._handleTouchTapAdd.bind(this);
        this._handleTouchTapRemove = this._handleTouchTapRemove.bind(this);
        this._userChange = this._userChange.bind(this);
        this._privChange = this._privChange.bind(this);

        this.menuItems = [
            {payload: '0', text: 'Normal User'},
            {payload: '1', text: 'Admin User'}
        ];
        this.state = {
            users: UserStoreState.users,
            selectedProfileIdx: UserStoreState.selectedUserIdx,
            user: '',
            privilege: 0
        };
    }

    componentDidMount() {
        UserStore.listen(this._onUserStoreChange);
        UserActions.fetchUsers();
    }

    componentWillUnmount() {
        UserStore.unlisten(this._onUserStoreChange);
    }

    render() {
        let userMenu = this.state.users.map( (user, idx) => {
            return { text: user, payload: idx };
        });

        return(
            <div className='users-wrapper'>
                <h3 style={styles.sectionTitle}>Give a User Access to ROSA</h3>
                <form style={styles.buttonContainer} action='/api/adduser' method='post'>
                    <TextField
                        type='text'
                        hintText='Email address'
                        onChange={this._userChange} /><br />
                    <SelectField
                        menuItems={this.menuItems}
                        onChange={this._privChange} />
                    <RaisedButton
                        label='Add user'
                        primary={true}
                        linkButton={true}
                        onTouchTap={this._handleTouchTapAdd}
                        style={styles.button} />
                </form>
                <h3 style={styles.tagLine}>--- OR ---</h3>
                <h3 style={styles.sectionTitle}>Remove a User's Access to ROSA</h3>
                <form style={styles.buttonContainer} action='/api/removeuser' method='post'>
                    <SelectField
                        menuItems={userMenu}
                        onChange={this._onUserChange} />
                    <RaisedButton
                        label='Remove user'
                        primary={true}
                        linkButton={true}
                        onTouchTap={this._handleTouchTapRemove}
                        style={styles.button} />
                </form>
            </div>
        );
    }

    static willTransitionTo() {
        NavigationActions.setCurrentRoute({ route: '/users' });
    }

    _onUserStoreChange = (state) => {
        this.setState(state);
    };

    _onUserChange = (e, selectedIdx, menuItem) => {
        UserActions.setSelectedUserIdx({ selectedUserIdx: selectedIdx });
    };

    _handleTouchTapAdd(){
        request
            .post('/api/adduser', this.state)
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: ' + res.body.error);
                    //NavigationActions.transitionTo({ route: '/users' });
                }
                else{
                    alert('Successfully added user to ROSA');
                    UserActions.fetchUsers();
                    //NavigationActions.transitionTo({ route: '/users' });
                }
            });
    }

    _handleTouchTapRemove(){
        request
            .post('/api/removeuser', {user: this.state.users[this.state.selectedUserIdx]})
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: ' + res.body.error);
                    //NavigationActions.transitionTo({ route: '/users' });
                }
                else{
                    alert('Successfully removed user from ROSA');
                    UserActions.fetchUsers();
                    //NavigationActions.transitionTo({ route: '/users' });
                }
            });
    }

    _userChange(event){
        this.setState({user: event.target.value});
    }

    _privChange(event){
        this.setState({privilege: Number(event.target.value)});
    }
}

export default Users;
