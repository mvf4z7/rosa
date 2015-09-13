import React from 'react';
import request from 'superagent';

import { Link } from 'react-router';
import { FlatButton, Dialog, RaisedButton } from 'material-ui';
import LiveChart from '../../components/live-chart/live-chart';

import styles from './styles';
require('./home.scss');

export default class Home extends React.Component {
    constructor() {
        super();
        this.standardActions = [
          { text: 'Cancel', onClick: this._onDialogCancel.bind(this) },
          { text: 'Submit', onClick: this._onDialogSubmit.bind(this), ref: 'submit' }
        ];
        this._startOvenSim = this._startOvenSim.bind(this);
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
        return (
    	 	<div className='home-wrapper'>
                <LiveChart />

                <div style={{textAlign:'center'}}>
                    <RaisedButton
                        label='open&#13;&#10;dialog box'
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
}
