import React from 'react';
import Radium from 'radium';

import NavigationActions from '../../actions/NavigationActions';

import CreateEditHighchart from '../../components/create-edit-highchart/create-edit-highchart';
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
                        <CreateEditHighchart />
                    </Tab>
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
