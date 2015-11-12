import React from 'react';
import request from 'superagent';

import NavigationActions from '../../actions/NavigationActions';

import LiveHighchart from '../../components/live-highchart/live-highchart';
import { RaisedButton, TextField, SelectField, Dialog, FlatButton } from 'material-ui';

import styles from './styles';

require('./adduser.scss');

class Adduser extends React.Component {
    constructor() {
        super();

        this._handleTouchTap = this._handleTouchTap.bind(this);
        this._userChange = this._userChange.bind(this);
        this._privChange = this._privChange.bind(this);

        this.menuItems = [
            {payload: '0', text: 'Normal User'},
            {payload: '1', text: 'Admin User'}
        ];
        this.state = {
            user: '',
            privilege: 0
        };
    }

    render() {
        return(
            <div className='adduser-wrapper'>
                <div className='adduser-wrapper'>
                    <h3 style={styles.tagLine}>Give a User Access to ROSA</h3>
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
                            onTouchTap={this._handleTouchTap}
                            style={styles.button} />
                    </form>
                </div>
            </div>
        );
    }

    static willTransitionTo() {
        NavigationActions.setCurrentRoute({ route: '/adduser' });
    }

    _handleTouchTap(){
        request
            .post('/api/adduser', this.state)
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: ' + res.body.error);
                    NavigationActions.transitionTo({ route: '/adduser' });
                }
                else{
                    alert('Successfully added user to ROSA');
                    NavigationActions.transitionTo({ route: '/' });
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

export default Adduser;
