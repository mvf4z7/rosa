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
            selectedProfileIdx: null,
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

    componentWillUpdate(nextProps, nextState) {
        // if(this.state.profile.name != nextState.profile.name) {
        //     this.refs.textField.setValue(nextState.profile.name);
        // }
    }

    componentWillUnmount() {
        TempProfileStore.unlisten(this._onTempProfilesStoreChange);
    }

    render() {
        let isLoading = !this.state.profiles.length || this.state.selectedProfileIdx === null;
        let menuItems = isLoading ? [{text: 'LOADING...'}] : this.state.profiles.map( (profile, idx) => {
            return { text: profile.name, payload: idx };
        });
        //let sanitizedPoints = isLoading ? [] : this._removeInvalidPoints(this.state.tempProfile);
        let profile = isLoading ? { } : this.state.profiles[this.state.selectedProfileIdx];

        return (
            <div style={styles.viewWrapper}>
                <CreateEditHighchart profileName={profile.name} data={profile.points} loading={isLoading}/>
                <div style={styles.dropDownWrapper}>
                    <DropDownMenu
                        menuItems={menuItems}
                        disabled={isLoading}
                        selectedIndex={this.state.selectedProfileIdx}
                        onChange={this._onDropDownChange}
                        autoWidth={true}/>
                </div>
                <div style={styles.scroller}>
                    <div style={styles.empty}></div>

                    <span style={[styles.controls, styles.controlsLeft]}>
                        <span onClick={this._saveProfile} style={[styles.controlBtn, styles.save]}>
                            <i className='material-icons' style={{fontSize: '30px'}}>save</i>
                        </span>
                        <span
                            onClick={this._deleteProfile.bind(this, this.state.selectedProfileIdx)}
                            style={[styles.controlBtn, styles.clearAll]}>
                            <span>delete</span>
                        </span>
                        <span onClick={this._clearPoints} style={[styles.controlBtn, styles.clearAll]}>
                            <span>clear</span>
                        </span>
                    </span>

                    <span style={[styles.controls, styles.controlsRight]}>
                        <span onClick={this._addPoint} style={[styles.controlBtn, styles.addPoint]}>
                            <i className='material-icons' style={{fontSize: '36px'}}>add</i>
                        </span>
                    </span>
                </div>
            </div>
        );
    }

    _onTempProfilesStoreChange = (state) => {
        this.setState({ profiles: state.profiles });

        if(this.state.selectedProfileIdx === null && state.profiles.length) {
            this.setState({ selectedProfileIdx: 0 });
        }
    }

    _deleteProfile = (index) => {
        this.setState({ selectedProfileIdx: null });

        TempProfileActions.deleteProfile({
            index: index,
            profile: this.state.profiles[index]
        });
    }

    _saveProfile = () => {
        if(!this.state.profile.name) {
            alert('A profile cannot be saved without a name');
            return;
        }

        let invalidPoints = this.state.profile.points.filter(function(point) {
            return (point.length !== 2);
        });
        if(invalidPoints.length) {
            let message = 'There are empty or incomplete points in your profile! ' +
                          'Please remove these points or fill in the blanks.';
            alert(message);
            return;
        }

        CreateProfileActions.saveProfile({ profile: this.state.profile });
    }

    _onDropDownChange = (e, selectedIdx, menuItem) => {
        this.setState({ selectedProfileIdx: selectedIdx });
    }

    _removeInvalidPoints = (points) => {
        let processed = [];
        points.forEach(point => {
            if(point.length === 2) {
                processed.push(point);
            }
        });

        return processed;
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
