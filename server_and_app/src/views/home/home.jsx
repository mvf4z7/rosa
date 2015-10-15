import React from 'react';
import request from 'superagent';

import NavigationActions from '../../actions/NavigationActions';
import TempProfileActions from '../../actions/TempProfileActions';
import LiveChartActions from '../../actions/LiveChartActions';

import LiveChartStore from '../../stores/LiveChartStore';
import TempProfilesStore from '../../stores/TempProfilesStore';

import mui, { Dialog, DropDownMenu, RaisedButton } from 'material-ui';
import LiveHighchart from '../../components/live-highchart/live-highchart';
import MaterialSpinner from '../../components/material-spinner/material-spinner';

import styles from './styles';
let colors = mui.Styles.Colors;

export default class Home extends React.Component {
    constructor() {
        super();

        let TempProfilesStoreState = TempProfilesStore.getState();
        this.state = {
            led: 'OFF',
            profiles: TempProfilesStoreState.profiles,
            selectedProfileIdx: TempProfilesStoreState.selectedProfileIdx,
            defaultProfile: TempProfilesStoreState.defaultProfile,
            liveData: LiveChartStore.getState().liveData
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

        this.context.socket.on('ledToggle', this._onLedToggle);
    }



    componentWillUnmount() {
        LiveChartStore.unlisten(this._onLiveChartStoreChange);
        TempProfilesStore.unlisten(this._onTempProfilesStoreChange);

        this.context.socket.removeListener('ledToggle', this._onLedToggle);
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
        let menuItems = isLoading ? [{text: 'LOADING...'}] : this.state.profiles.map( (profile, idx) => {
            let text = profile.name === this.state.defaultProfile ? profile.name + ' (default)' : profile.name;
            return { text: text, payload: idx };
        });

        return (
    	 	<div style={styles.homeWrapper}>
                <LiveHighchart ref='chart' loading={isLoading} profile={profile} liveData={this.state.liveData}/>

                <div style={styles.dropDownWrapper}>
                    <div style={styles.dropDownLabel}>PROFILE: </div>
                    <DropDownMenu
                        menuItems={menuItems}
                        disabled={isLoading}
                        onChange={this._onDropDownChange}
                        autoWidth={true}
                        />
                </div>

                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='START OVEN SIM'
                        primary={true}
                        disable={isLoading}
                        linkButton={true}
                        onClick={this._onClickStart.bind(null, profile)}
                        backgroundColor={colors.green500}
                        style={styles.button} />
                    <RaisedButton
                        label='STOP OVEN'
                        primary={true}
                        disable={isLoading}
                        linkButton={true}
                        onClick={this._onClickStop}
                        backgroundColor={colors.red500}
                        style={styles.button}/>
                </div>

                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='OPEN DIALOG BOX'
                        linkButton={true}
                        onClick={this._onButtonClicked.bind(this)}
                        style={styles.button}/>
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
        this.setState({ liveData: state.liveData });
        this.refs.chart.updateLiveData(state.liveData);
    }

    _onTempProfilesStoreChange = (state) => {
        this.setState(state);
    }

    _onDropDownChange = (e, selectedIdx, menuItem) => {
        TempProfileActions.setSelectedProfileIdx({ selectedProfileIdx: selectedIdx });
    }

    _onClickStart = (profile) => {
        request
            .put('/api/ovensim')
            .send({ profile: profile })
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: ' + res.body.error);
                }
            })
    }

    _onClickStop = () => {
        request
            .del('/api/ovensim')
            .end(function(err, res) {
                console.log(res.body);
            });
    }

    _onButtonClicked() {
        this.refs.dialog.show();
    }

    _closeModal() {
        this.refs.dialog.dismiss();
    }

    // _onLedToggle(ledState) {
    //     this.setState({ led: ledState });
    // }

    _onLedToggle = ledState => {
        this.setState({ led: ledState });
    }
}

Home.contextTypes = {
    socket: React.PropTypes.object
};
