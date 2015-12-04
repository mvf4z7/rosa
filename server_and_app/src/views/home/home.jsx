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
            selectedProfileIdx: HomeViewStore.getState().selectedProfileIdx,
            defaultProfile: TempProfilesStoreState.defaultProfile,
            liveData: LiveChartStore.getState().liveData
        };

        console.log('this.state.selectedProfileIdx: ', this.state.selectedProfileIdx);

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
                        selectedIndex={this.state.selectedProfileIdx}
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
        if(this.state.selectedProfileIdx === null && state.defaultProfile && state.profiles) {
            console.log('setting selectedProfile to default: ', state);
            var defaultProfileIdx = state.profiles.map( profile => {
                return profile.name
            }).indexOf(state.defaultProfile);

            // Was getting weird Alt.js bug if I didn't call this function without setTimeout
            setTimeout(HomeViewActions.setSelectedProfileIdx, 0, { selectedProfileIdx: defaultProfileIdx });
        }
        this.setState(state);
    }

    _onHomeViewStoreChange = (state) => {
        console.log('homeViewstorechange: ', state);
        this.setState(state);
    }

    _onDropDownChange = (e, selectedIdx, menuItem) => {
        HomeViewActions.setSelectedProfileIdx({ selectedProfileIdx: selectedIdx });
    }

    _onButtonClicked() {
        this.refs.dialog.show();
    }

    _closeModal() {
        this.refs.dialog.dismiss();
    }
}
