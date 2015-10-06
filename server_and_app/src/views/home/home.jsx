import React from 'react';
import request from 'superagent';

import NavigationActions from '../../actions/NavigationActions';
import TempProfileActions from '../../actions/TempProfileActions';

import LiveChartStore from '../../stores/LiveChartStore';
import TempProfilesStore from '../../stores/TempProfilesStore';

import { Dialog, DropDownMenu, RaisedButton } from 'material-ui';
import LiveHighchart from '../../components/live-highchart/live-highchart';
import MaterialSpinner from '../../components/material-spinner/material-spinner';

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

        this.context.socket.removeAllListeners('ledToggle');
    }

    _onDialogCancel() {
        this.refs.dialog.dismiss();
    }

    _onDialogSubmit() {
        console.log('i dont do anything!');
    }

    render() {
        let ledStyle = {
            textAlign: 'center',
            marginTop: '3rem'
        }
        if(this.state.led == 'ON') {
            ledStyle.backgroundColor = '#0A5CBF';
        }

        let isLoading = !this.state.profiles.length || this.state.selectedProfileIdx === null;
        let profile = isLoading ? null : this.state.profiles[this.state.selectedProfileIdx];
        let menuItems = isLoading ? [{text: 'lojhjkhjkhf'}] : this.state.profiles.map( (profile, idx) => {
            let text = profile.name === this.state.defaultProfile ? profile.name + ' (default)' : profile.name;
            return { text: text, payload: idx };
        });

        return (
    	 	<div style={styles.homeWrapper}>
                <LiveHighchart ref='chart' loading={isLoading} profile={profile}/>

                <div style={styles.dropDownWrapper}>
                    <div style={styles.dropDownLabel}>SELECT A PROFILE: </div>
                    <DropDownMenu
                        menuItems={menuItems}
                        disabled={isLoading}
                        onChange={this._onDropDownChange}
                        autoWidth={true}
                        />
                </div>

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

    _onLiveChartStoreChange = (state) => {
        this.refs.chart.addPoint([state.newTime, state.newData]);
    }

    _onTempProfilesStoreChange = (state) => {
        this.setState(state);
    }

    _startOvenSim = () => {
        request
            .get('/api/ovensim')
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: ' + res.body.error);
                }
            })
    }

    _onDropDownChange = (e, selectedIdx, menuItem) => {
        TempProfileActions.setSelectedProfileIdx({ selectedProfileIdx: selectedIdx });
    }

    _onButtonClicked() {
        this.refs.dialog.show();
    }

    _closeModal() {
        this.refs.dialog.dismiss();
    }
}

Home.contextTypes = {
    socket: React.PropTypes.object
};
