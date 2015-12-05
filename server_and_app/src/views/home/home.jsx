import React from 'react';
import request from 'superagent';

import NavigationActions from '../../actions/NavigationActions';
import HomeViewActions from '../../actions/HomeViewActions';
import TempProfileActions from '../../actions/TempProfileActions';
import LiveChartActions from '../../actions/LiveChartActions';

import LiveChartStore from '../../stores/LiveChartStore';
import TempProfilesStore from '../../stores/TempProfilesStore';
import HomeViewStore from '../../stores/HomeViewStore';

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
            selectedProfileName: HomeViewStore.getState().selectedProfileName,
            defaultProfileName: TempProfilesStoreState.defaultProfileName,
            liveData: LiveChartStore.getState().liveData
        };

        console.log('this.state.selectedProfileName: ', this.state.selectedProfileName);

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
        HomeViewStore.listen(this._onHomeViewStoreChange);

        TempProfileActions.fetchProfiles();
    }

    componentWillReceiveProps(nextProps) {
        // If the oven is switching from ON to OFF, then print
        // the live and profile data to the console.
        if(this.props.ovenOn && !nextProps.ovenOn) {
            this.refs.chart.printData();
        }
    }

    componentWillUnmount() {
        LiveChartStore.unlisten(this._onLiveChartStoreChange);
        TempProfilesStore.unlisten(this._onTempProfilesStoreChange);
        HomeViewStore.unlisten(this._onHomeViewStoreChange);
    }

    _onDialogCancel() {
        this.refs.dialog.dismiss();
    }

    _onDialogSubmit() {
        console.log('i dont do anything!');
    }

    render() {
        let isLoading = !this.state.profiles.length || this.state.selectedProfileName === null;
        let profile = isLoading ? null : this._getProfile(this.state.selectedProfileName);
        let menuItems = isLoading ? [{text: 'LOADING...'}] : this.state.profiles.map( (profile, idx) => {
            let text = profile.name === this.state.defaultProfileName ? profile.name + ' (default)' : profile.name;
            return { text: text, payload: profile.name };
        });
        let selectedIndex = this._profileNametoIndex(this.state.selectedProfileName);

        // Dropdown menu cannot have a selectedIndex of -1, even if it is disabled
        if(selectedIndex === -1) {
            selectedIndex = 0;
        }

        return (
    	 	<div style={styles.homeWrapper}>
                <LiveHighchart ref='chart' loading={isLoading} profile={profile} liveData={this.state.liveData}/>

                <div style={styles.dropDownWrapper}>
                    <div style={styles.dropDownLabel}>PROFILE: </div>
                    <DropDownMenu
                        menuItems={menuItems}
                        disabled={isLoading}
                        selectedIndex={selectedIndex}
                        onChange={this._onDropDownChange}
                        autoWidth={true}/>
                </div>

                <StartStopBtn
                    ovenOn={this.props.ovenOn}
                    disable={isLoading}
                    profile={profile}/>

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

        // If there isn't a currently selected profile and we have already fetched
        // profiles from the server then set the selected profile to the default profile.
        if(this.state.selectedProfileName === null && state.defaultProfileName && state.profiles) {
            console.log('setting selectedProfile to default: ', state);
            // var defaultProfileIdx = state.profiles.map( profile => {
            //     return profile.name
            // }).indexOf(state.defaultProfileName);

            // Was getting weird Alt.js bug if I didn't call this function without setTimeout.
            // Look into using Alt.js defer function to fix this.
            setTimeout(HomeViewActions.setSelectedProfileName, 0, { selectedProfileName: state.defaultProfileName });
        }
        this.setState(state);
    }

    _onHomeViewStoreChange = (state) => {
        console.log('homeViewstorechange: ', state);
        this.setState(state);
    }

    _onDropDownChange = (e, selectedIdx, menuItem) => {
        HomeViewActions.setSelectedProfileName({ selectedProfileName: menuItem.payload });
    }

    _getProfile = (profileName) => {
        return this.state.profiles[this._profileNametoIndex(profileName)];
    }

    _profileNametoIndex = (profileName) => {
        let profiles = this.state.profiles;
        if(profiles.length === 0 || !profileName) {
            return -1;
        }

        return profiles.map( profile => {
            return profile.name;
        }).indexOf(profileName);
    }

    _onButtonClicked() {
        this.refs.dialog.show();
    }

    _closeModal() {
        this.refs.dialog.dismiss();
    }
}
