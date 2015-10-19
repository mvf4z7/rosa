import React from 'react';
import Radium from 'radium';

import NavigationActions from '../../actions/NavigationActions';

import { Tabs, Tab} from 'material-ui';

class Profiles extends React.Component {
    constructor(props) {
        super(props);
    }

    static willTransitionTo() {
        NavigationActions.setCurrentRoute({ route: '/profiles' });
    }

    render() {
        return(
            <div style={styles.container}>
                <Tabs inkBarStyle={styles.inkBar}>
                    <Tab label='CREATE'></Tab>
                    <Tab label='EDIT'></Tab>
                </Tabs>
            </div>
        );
    }
}

export default Radium(Profiles);

let styles = {
    container: {
        height: '100%',
        paddingTop: '4rem'
    },
    inkBar: {
        height: '4px'
    }
};
