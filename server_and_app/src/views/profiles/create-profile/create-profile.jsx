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
    }

    componentWillUnmount() {
        CreateProfileStore.unlisten(this._onCreateProfileStoreChange);
    }

    render() {
        return (
            <div style={styles.viewWrapper}>
                <CreateEditHighchart profileName={this.state.profile.name} />
                <div style={styles.container}>
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
                                    return ( <DataPointCard point={point} index={index+1} key={index}/> );
                                })
                            }
                        </div>
                        <div style={styles.empty}></div>
                        <div style={styles.controls}>
                            <span style={styles.addPoint} onClick={this._addPoint}>
                                <i className='material-icons' style={{fontSize: '36px'}}>add</i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _onCreateProfileStoreChange = (state) => {
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
}

let styles = {
    viewWrapper: {
        height: '100%',
        paddingTop: '4rem',
        overflow: 'hidden'
    },
    container: {
        overflow: 'hidden'
    },
    scroller: {
        overflow: 'auto',
        height: '48vh',
        '@media screen and (min-width: 48em)': {
            height: '38vh'
        }
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
        height: '3.5rem'
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        padding: '1rem 0'
    },
    addPoint: {
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        height: '2.5rem',
        width: '2.5rem',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer'
    }
}

export default Radium(CreateProfile);