import React from 'react';
import request from 'superagent';

import NavigationActions from '../../actions/NavigationActions';

import LiveHighchart from '../../components/live-highchart/live-highchart';
import { RaisedButton } from 'material-ui';

import styles from './styles';

require('./logout.scss');

class Logout extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className='logout-wrapper'>
                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='Click here to logout'
                        primary={true}
                        linkButton={true}
                        href='/logout'
                        style={styles.button} />
                </div>
            </div>
        );
    }

    static willTransitionTo() {
        NavigationActions.setCurrentRoute({ route: '/logout' });
    }
}

export default Logout;
