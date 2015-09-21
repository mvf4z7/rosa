import React from 'react';
import request from 'superagent';

import NavigationActions from '../../actions/NavigationActions';

import LiveHighchart from '../../components/live-highchart/live-highchart';
import { RaisedButton } from 'material-ui';

import styles from './styles';

require('./info.scss');

class Info extends React.Component {
    constructor() {
        super();

        this._startOvenSim = this._startOvenSim.bind(this);
    }

    static willTransitionTo() {
        NavigationActions.setCurrentRoute({ route: '/info' });
    }

    render() {
        return (
    	 	<div className='info-wrapper'>
                <h1 style={styles.header}>ROSA</h1>
                <p style={styles.tagLine}>
                    A
                    <span style={styles.accent}> R</span>eflow
                    <span style={styles.accent}> O</span>ven for
                    <span style={styles.accent}> S</span>MD
                    <span style={styles.accent}> A</span>pplication
                </p>
                <div className='pure-g' style={styles.boxContainer}>
                    <div className='pure-u-1 pure-u-md-1-2' style={styles.box}>
                        <h3 style={styles.boxTitle}>What is Rosa?</h3>
                        <p style={styles.boxBody}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam diam ligula,
                            dapibus eu odio et, pellentesque imperdiet nunc. Etiam sed turpis eu lacus
                            feugiat consectetur vel non dui. Vestibulum quam libero, condimentum in turpis
                            at, varius pulvinar ipsum. Sed tellus nibh, bibendum vitae accumsan vel,
                        </p>
                    </div>
                    <div className='pure-u-1 pure-u-md-1-2' style={styles.box}>
                        <h3 style={styles.boxTitle}>Who created ROSA?</h3>
                        <p style={styles.boxBody}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam diam ligula,
                            dapibus eu odio et, pellentesque imperdiet nunc. Etiam sed turpis eu lacus
                            feugiat consectetur vel non dui. Vestibulum quam libero, condimentum in turpis
                            at, varius pulvinar ipsum. Sed tellus nibh, bibendum vitae accumsan vel,
                        </p>
                    </div>
                    <div className='pure-u-1 pure-u-md-1-2' style={styles.box}>
                        <h3 style={styles.boxTitle}>Technologies used</h3>
                        <p style={styles.boxBody}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam diam ligula,
                            dapibus eu odio et, pellentesque imperdiet nunc. Etiam sed turpis eu lacus
                            feugiat consectetur vel non dui. Vestibulum quam libero, condimentum in turpis
                            at, varius pulvinar ipsum. Sed tellus nibh, bibendum vitae accumsan vel,
                        </p>
                    </div>
                    <div className='pure-u-1 pure-u-md-1-2' style={styles.box}>
                        <h3 style={styles.boxTitle}>Find us on Github</h3>
                        <p style={styles.boxBody}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam diam ligula,
                            dapibus eu odio et, pellentesque imperdiet nunc. Etiam sed turpis eu lacus
                            feugiat consectetur vel non dui. Vestibulum quam libero, condimentum in turpis
                            at, varius pulvinar ipsum. Sed tellus nibh, bibendum vitae accumsan vel,
                        </p>
                    </div>
                </div>
                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='start oven sim'
                        primary={true}
                        linkButton={true}
                        onTouchTap={this._startOvenSim}
                        style={styles.button} />
                </div>
    		</div>
        );
    }

    _startOvenSim() {
        console.log('starting oven sim');
        request
            .get('/api')
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: ' + res.body.error);
                }
                console.log(res.body);
            })
    }
}

export default Info;
