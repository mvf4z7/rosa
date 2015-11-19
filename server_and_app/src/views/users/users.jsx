import React from 'react';
import request from 'superagent';

import UserActions from '../../actions/UserActions';
import NavigationActions from '../../actions/NavigationActions';

import UserStore from '../../stores/UserStore';

import LiveHighchart from '../../components/live-highchart/live-highchart';
import { RaisedButton, TextField, SelectField, Dialog, FlatButton, Snackbar } from 'material-ui';

import styles from './styles';

require('./users.scss');

class Users extends React.Component {
    constructor() {
        super();

        let UserStoreState = UserStore.getState();

        //this._handleTouchTapAdd = this._handleTouchTapAdd.bind(this);
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
            privilege: 0,
            autoHideDuration: 5 * 1000
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
                        ref='email'
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
                        onTouchTap={this._handleTouchTapAdd.bind(this)}
                        style={styles.button} />
                    <Snackbar
                        ref='addsnack'
                        bodyStyle={styles.snackbar}
                        message='Added user to ROSA'
                        autoHideDuration={this.state.autoHideDuration} />
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
                    <Snackbar
                        ref='removesnack'
                        bodyStyle={styles.snackbar}
                        message='Removed user from ROSA'
                        autoHideDuration={this.state.autoHideDuration} />
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
        let snackbar = this.refs.addsnack;
        let email = this.refs.email;
        request
            .post('/api/adduser', this.state)
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: Could not add user');
                }
                else{
                    UserActions.fetchUsers();
                    email.clearValue();
                    snackbar.show();
                }
            });
    }

    _handleTouchTapRemove(){
        let snackbar = this.refs.removesnack;
        request
            .post('/api/removeuser', {user: this.state.users[this.state.selectedUserIdx]})
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: Could not remove user');
                }
                else{
                    UserActions.fetchUsers();
                    snackbar.show();
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
