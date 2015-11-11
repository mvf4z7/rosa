import React from 'react';
import Radium from 'radium';

import CreateProfileStore from '../../../stores/CreateProfileStore';
import CreateProfileActions from '../../../actions/CreateProfileActions';

import CreateEditHighchart from '../../../components/create-edit-highchart/create-edit-highchart';
import DataPointCard from '../../../components/data-point-card/data-point-card';
import { TextField } from 'material-ui';

class CreateProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: CreateProfileStore.getState().profile
        };
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
                                return ( <DataPointCard point={point} index={index+1} key={index} /> );
                            })
                        }
                    </div>
                </div>
                <div style={styles.controls}>
                    Click me!
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
}

let styles = {
    viewWrapper: {

    },
    textFieldContainer: {
        textAlign: 'center'
    },
    scroller: {
        overflowY: 'auto'
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'space-around'
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        textAlign: 'center',
        backgroundColor: 'red',
        width: '100%'
    }
}

export default Radium(CreateProfile);
