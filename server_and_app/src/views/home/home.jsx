import React from 'react';
import request from 'superagent';

import NavigationActions from '../../actions/NavigationActions';
import TempProfileActions from '../../actions/TempProfileActions';

import LiveChartStore from '../../stores/LiveChartStore';
import TempProfilesStore from '../../stores/TempProfilesStore';

import { Dialog, RaisedButton } from 'material-ui';
import LiveHighchart from '../../components/live-highchart/live-highchart';

import styles from './styles';

export default class Home extends React.Component {
    constructor() {
        super();

        let TempProfilesStoreState = TempProfilesStore.getState();
        this.state = {
            led: 'OFF',
            profiles: TempProfilesStoreState.profiles,
            selectedProfileIdx: TempProfilesStoreState.selectedProfileIdx,
            defaultProfile: TempProfilesStoreState.defaultProfile
        };

        this.standardActions = [
          { text: 'Cancel', onClick: this._onDialogCancel.bind(this) },
          { text: 'Submit', onClick: this._onDialogSubmit.bind(this), ref: 'submit' }
        ];

        this._startOvenSim = this._startOvenSim.bind(this);
        this._onLiveChartStoreChange = this._onLiveChartStoreChange.bind(this);
        this._onTempProfilesStoreChange = this._onTempProfilesStoreChange.bind(this);
    }

    static willTransitionTo() {
        NavigationActions.setCurrentRoute({ route: '/' });
    }

    componentDidMount() {
        LiveChartStore.listen(this._onLiveChartStoreChange);
        TempProfilesStore.listen(this._onTempProfilesStoreChange);

        TempProfileActions.fetchProfiles();

        this.context.socket.on('ledToggle', this._onLedToggle.bind(this));
    }

    _onLedToggle(ledState) {
        this.setState({ led: ledState });
    }

    componentWillUnmount() {
        LiveChartStore.unlisten(this._onLiveChartStoreChange);
        TempProfilesStore.unlisten(this._onTempProfilesStoreChange);
    }

    _onDialogCancel() {
        this.refs.dialog.dismiss();
    }

    _onDialogSubmit() {
        console.log('i dont do anything!');
    }

    render() {
        let ledStyle = {
            textAlign: 'center'
        }
        if(this.state.led == 'ON') {
            ledStyle.backgroundColor = '#0A5CBF';
        }

        let profile = this.state.profiles[this.state.selectedProfileIdx];

        return (
    	 	<div style={styles.homeWrapper}>
                <LiveHighchart ref='chart' profile={profile}/>

                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='open dialog box'
                        linkButton={true}
                        onClick={this._onButtonClicked.bind(this)}
                        style={styles.button}
                    />
                    <RaisedButton
                        label='start oven sim'
                        primary={true}
                        linkButton={true}
                        onTouchTap={this._startOvenSim}
                        style={styles.button} />
                </div>
                <h1 style={ledStyle}>
                    LED {this.state.led}
                </h1>

                <div onClick={this._onDialogCancel.bind(this)}>
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

    _onLiveChartStoreChange(state) {
        console.log('livechartstorechange: ', state);
        this.refs.chart.addPoint([state.newTime, state.newData]);
    }

    _onTempProfilesStoreChange(state) {
        console.log('before profile store change setstate');
        this.setState(state);
        console.log('after profile store change setstate');
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

Home.contextTypes = {
    socket: React.PropTypes.object
};
