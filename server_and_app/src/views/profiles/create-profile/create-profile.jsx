import React from 'react';
import Radium from 'radium';

import CreateProfileStore from '../../../stores/CreateProfileStore';

import NavigationActions from '../../../actions/NavigationActions';
import CreateProfileActions from '../../../actions/CreateProfileActions';

import CreateEditHighchart from '../../../components/create-edit-highchart/create-edit-highchart';
import DataPointCard from '../../../components/data-point-card/data-point-card';
import { FontIcon, TextField } from 'material-ui';

class CreateProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: CreateProfileStore.getState().profile
        };
    }

    static willTransitionTo() {
        NavigationActions.setCurrentRoute({ route: '/create-profile' });
    }

    componentDidMount() {
        CreateProfileStore.listen(this._onCreateProfileStoreChange);

        this.refs.textField.setValue(this.state.profile.name);
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.state.profile.name != nextState.profile.name) {
            this.refs.textField.setValue(nextState.profile.name);
        }
    }

    componentWillUnmount() {
        CreateProfileStore.unlisten(this._onCreateProfileStoreChange);
    }

    render() {
        let sanitizedPoints = this._removeInvalidPoints(this.state.profile.points);

        return (
            <div style={styles.viewWrapper}>
                <CreateEditHighchart profileName={this.state.profile.name} data={sanitizedPoints}/>
                <div style={styles.scroller}>
                    <div style={styles.textFieldContainer}>
                        <TextField
                            ref='textField'
                            floatingLabelText="Profile Name"
                            onEnterKeyDown={this._updateProfileName}
                            onBlur={this._updateProfileName} />
                    </div>
                    <div style={styles.cardContainer}>
                        {
                            this.state.profile.points.map(function(point, index) {
                                return ( <DataPointCard point={point} index={index} key={Math.random()}/> );
                            })
                        }
                    </div>
                    <div style={styles.empty}></div>

                    <span style={[styles.controls, styles.controlsLeft]}>
                        <span onClick={this._saveProfile} style={[styles.controlBtn, styles.save]}>
                            <i className='material-icons' style={{fontSize: '30px'}}>save</i>
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

    _onCreateProfileStoreChange = (state) => {
        console.log(state);
        this.setState(state);
    }

    _updateProfileName = () => {
        let textField = this.refs.textField;
        textField.blur();
        CreateProfileActions.setProfileName({ profileName: textField.getValue() });
    }

    _addPoint = () => {
        CreateProfileActions.addPoint();
    }

    _clearPoints = () => {
        console.log('_clearPoints called');
        CreateProfileActions.clearPoints();
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

export default Radium(CreateProfile);
