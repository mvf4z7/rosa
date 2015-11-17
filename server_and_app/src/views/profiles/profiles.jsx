import React from 'react';
import Radium from 'radium';

import NavigationActions from '../../actions/NavigationActions';

import CreateProfile from './create-profile/create-profile';
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
                <Tabs contentContainerStyle={styles.tabContent} inkBarStyle={styles.inkBar}>
                    <Tab label='CREATE' style={styles.tab}>
                        <CreateProfile />
                    </Tab>
                    <Tab label='EDIT'>Profile Edit Page</Tab>
                </Tabs>
            </div>
        );
    }
}

export default Radium(Profiles);

let styles = {
    container: {
        height: '100%',
        position: 'relative',
        paddingTop: '4rem'
    },
    tabContent: {
        height: '100%',
        position: 'relative'
    },
    tab: {
        height: '100%',
    },
    inkBar: {
        height: '4px'
    }
};
