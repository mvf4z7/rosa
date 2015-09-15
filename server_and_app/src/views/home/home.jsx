import React from 'react';
import request from 'superagent';
import LocationStore from '../../stores/LocationStore';
import LocationActions from '../../actions/LocationActions';

import { Link } from 'react-router';
import { Dialog, RaisedButton } from 'material-ui';
import LiveHighchart from '../../components/live-highchart/live-highchart';

import styles from './styles';
require('./home.scss');

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = LocationStore.getState();

        this.standardActions = [
          { text: 'Cancel', onClick: this._onDialogCancel.bind(this) },
          { text: 'Submit', onClick: this._onDialogSubmit.bind(this), ref: 'submit' }
        ];
        this._startOvenSim = this._startOvenSim.bind(this);
        this._onStoreChange = this._onStoreChange.bind(this);
    }

    componentDidMount() {
        LocationStore.listen(this._onStoreChange);
    }

    componentWillUnmount() {
        LocationStore.unlisten(this._onStoreChange);
    }

    _onStoreChange(state) {
        this.setState(state);
    }

    _onDialogCancel() {
        this.refs.dialog.dismiss();
    }

    _onDialogSubmit() {
        console.log('i dont do anything!');
    }

    _clickedButton() {
        console.log('button was clicked');
    }

    render() {
        let locations = this.state.locations.map((location, index) => {
            return (
                <li key={index}>{location}</li>
            );
        });

        return (
    	 	<div style={styles.homeWrapper}>
                <ul>
                    {locations}
                </ul>

                <LiveHighchart />

                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='open dialog box'
                        linkButton={true}
                        onClick={ this._onButtonClicked.bind(this) }
                        style={styles.button}
                    />
                    <RaisedButton
                        label='start oven sim'
                        primary={true}
                        linkButton={true}
                        onTouchTap={this._startOvenSim}
                        style={styles.button} />
                </div>
                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='Add Location'
                        linkButton={true}
                        onClick={this._onAddLocation}
                        style={styles.button}
                    />
                </div>
                <div onClick={ this._onDialogCancel.bind(this) }>
                    <Dialog
                        ref='dialog'
                        title='Dialog with actions'
                        actions={this.standardActions}
                        actionFocus='submit'>
                        This is a dialog box
                    </Dialog>
                </div>
    		</div>
        );
    }

    _onButtonClicked() {
        this.refs.dialog.show();
    }

    _closeModal() {
        this.refs.dialog.dismiss();
    }

    _startOvenSim() {
        console.log('starting oven sim');
        request
            .get('/api')
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: ' + res.body.error);
                }
                console.log(res.body);
            })
    }

    _onAddLocation() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        LocationActions.addLocation(text);
    }
}
