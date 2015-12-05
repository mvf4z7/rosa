import React from 'react';
import Radium from 'radium';

import TempProfileStore from '../../../stores/TempProfilesStore';

import NavigationActions from '../../../actions/NavigationActions';
import TempProfileActions from '../../../actions/TempProfileActions';

import CreateEditHighchart from '../../../components/create-edit-highchart/create-edit-highchart';
import DataPointCard from '../../../components/data-point-card/data-point-card';
import { DropDownMenu, FontIcon } from 'material-ui';

class EditProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profiles: [],
            selectedProfileName: null,
            tempProfile: null
        };
    }

    static willTransitionTo() {
        NavigationActions.setCurrentRoute({ route: '/edit-profile' });
    }

    componentDidMount() {
        TempProfileStore.listen(this._onTempProfilesStoreChange);

        TempProfileActions.fetchProfiles();
    }

    componentWillUnmount() {
        TempProfileStore.unlisten(this._onTempProfilesStoreChange);
    }

    render() {
        let isLoading = !this.state.profiles.length || this.state.selectedProfileName === null;
        let menuItems = isLoading ? [{text: 'LOADING...'}] : this.state.profiles.map( (profile, idx) => {
            return { text: profile.name, payload: profile.name };
        });
        let profile = isLoading ? { } : this._getProfile(this.state.selectedProfileName);
        let selectedIndex = isLoading ? 0 : this._profileNametoIndex(this.state.selectedProfileName);

        // Dropdown menu cannot have a selectedIndex of -1, even if it is disabled
        if(selectedIndex === -1) {
            selectedIndex = 0;
        }

        return (
            <div style={styles.viewWrapper}>
                <CreateEditHighchart profileName={profile.name} data={profile.points} loading={isLoading}/>
                <div style={styles.dropDownWrapper}>
                    <DropDownMenu
                        menuItems={menuItems}
                        disabled={isLoading}
                        selectedIndex={selectedIndex}
                        onChange={this._onDropDownChange}
                        autoWidth={true}/>
                </div>
                <div style={styles.scroller}>
                    <div style={styles.empty}></div>

                    <span style={[styles.controls, styles.controlsLeft]}>
                        <span
                            onClick={this._deleteProfile.bind(this, this.state.selectedProfileName)}
                            style={[styles.controlBtn, styles.clearAll]}>
                            <span>delete</span>
                        </span>
                    </span>
                </div>
            </div>
        );
    }

    _onTempProfilesStoreChange = (state) => {
        this.setState({ profiles: state.profiles });

        if(this.state.selectedProfileName === null && state.profiles.length) {
            this.setState({ selectedProfileName: state.profiles[0].name });
        }
    }

    _deleteProfile = (profileName) => {
        this.setState({ selectedProfileName: null });

        TempProfileActions.deleteProfile({ profileName: profileName });
    }

    _onDropDownChange = (e, selectedIdx, menuItem) => {
        this.setState({ selectedProfileName: menuItem.payload });
    }

    _getProfile = (profileName) => {
        console.log('getProfile: ', profileName);
        let idx = this.state.profiles.map( profile => {
            return profile.name;
        }).indexOf(profileName);

        if(idx === -1) {
            return null;
        } else {
            return this.state.profiles[idx];
        }
    }

    _profileNametoIndex = (profileName) => {
        console.log('profileNametoIndex: ', profileName);
        let profiles = this.state.profiles;
        if(profiles.length === 0 || !profileName) {
            return -1;
        }

        return profiles.map( profile => {
            return profile.name;
        }).indexOf(profileName);
    }
}

let styles = {
    viewWrapper: {
        height: '100%',
        paddingTop: '4rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        overflow: 'hidden'
    },
    dropDownWrapper: {
        textAlign: 'center'
    },
    scroller: {
        overflow: 'auto',
        flex: '1'
    },
    textFieldContainer: {
        textAlign: 'center',
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'space-around',
        overflowY: 'auto'
    },
    empty: {
        height: '4.5rem'
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'transparent',
        padding: '1rem 0',
        margin: '0 2rem'
    },
    controlsLeft: {
        left: 0
    },
    controlsRight: {
        right: 0,
    },
    controlBtn: {
        borderRadius: '50%',
        float: 'left',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        height: '3rem',
        width: '3rem',
        color: 'white',
        cursor: 'pointer',
        margin: '0 0.5rem',
        boxShadow: '0px 10px 6px -6px #777',
    },
    addPoint: {
        backgroundColor: 'green'
    },
    save: {
        backgroundColor: 'blue'
    },
    clearAll: {
        textAlign: 'center',
        backgroundColor: 'red',
        fontSize: '1.1rem',
        fontWeight: 'bold'
    }
}

export default Radium(EditProfile);
