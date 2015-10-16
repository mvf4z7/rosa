import React from 'react';
import request from 'superagent';

import NavigationActions from '../../actions/NavigationActions';
import TempProfileActions from '../../actions/TempProfileActions';
import LiveChartActions from '../../actions/LiveChartActions';

import LiveChartStore from '../../stores/LiveChartStore';
import TempProfilesStore from '../../stores/TempProfilesStore';

import mui, { Dialog, DropDownMenu, RaisedButton } from 'material-ui';
import LiveHighchart from '../../components/live-highchart/live-highchart';
import StartStopBtn from '../../components/start-stop-btn/start-stop-btn';

import styles from './styles';
let colors = mui.Styles.Colors;

export default class Home extends React.Component {
    constructor() {
        super();



        let TempProfilesStoreState = TempProfilesStore.getState();
        this.state = {
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
                        autoWidth={true}/>
                </div>

                <StartStopBtn
                    ovenOn={this.props.ovenOn}
                    disable={isLoading}
                    profile={profile}/>

                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='OPEN DIALOG BOX'
                        linkButton={true}
                        onClick={this._onButtonClicked.bind(this)}
                        style={styles.button}/>
                </div>

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
