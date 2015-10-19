import React from 'react';
import Radium from 'radium';

import NavigationActions from '../../actions/NavigationActions';

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
                <h1 style={styles.child}>MANAGE PROFILES VIEW</h1>
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
    child: {
        margin: 0,
        padding: 0
    }
};
