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
            <div>
                <CreateEditHighchart profileName={this.state.profile.name}/>
                <div style={styles.textFieldContainer}>
                    <TextField
                        ref='textField'
                        floatingLabelText="Enter Profile Name"
                        onEnterKeyDown={this._updateProfileName}
                        onBlur={this._updateProfileName} />
                </div>
                <DataPointCard />
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
    textFieldContainer: {
        textAlign: 'center'
    }
}

export default Radium(CreateProfile);
