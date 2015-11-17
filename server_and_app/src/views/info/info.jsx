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
                    <span style={styles.accent}> R</span>eflow
                    <span style={styles.accent}> O</span>ven for
                    <span style={styles.accent}> S</span>MD
                    <span style={styles.accent}> A</span>pplication
                </p>
                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='Check Out our GitHub'
                        primary={true}
                        linkButton={true}
                        href='https://github.com/mvf4z7/rosa'
                        style={styles.button} />
                </div>
                <div className='pure-g' style={styles.boxContainer}>
                    <div className='pure-u-1 pure-u-md-1-2' style={styles.box}>
                        <h3 style={styles.boxTitle}>What is Rosa?</h3>
                        <p style={styles.boxBody}>
                            ROSA is an open source system for converting an ordinary
                            consumer-grade toaster oven into a reflow oven for
                            attaching surface-mount electronic devices to printed
                            circuit boards. ROSA is intended for use by students and
                            electronics hobbyists as an alternative to expensive
                            commercial reflow ovens. The ROSA system includes
                            oven-control software, a client web-application, and
                            instructions for purchasing and installing hardware.
                        </p>
                    </div>
                    <div className='pure-u-1 pure-u-md-1-2' style={styles.box}>
                        <h3 style={styles.boxTitle}>Who created ROSA?</h3>
                        <p style={styles.boxBody}>
                            ROSA was started as a senior design project for by
                            four senior computer engineering students at the
                            Missouri University of Science and Technology.
                        </p>
                        <ul style={styles.list}>
                            <li>Joel Bierbaum - Electronics and Oven Control Software</li>
                            <li>Jon Eftink - Electronics and Oven Control Software</li>
                            <li>Mike Fanger - Web Application</li>
                            <li>Tyler Ryan - Web Server</li>
                        </ul>
                    </div>
                    <div className='pure-u-1 pure-u-md-1-2' style={styles.box}>
                        <h3 style={styles.boxTitle}>Technologies used</h3>
                        <p style={styles.boxBody}>
                            ROSA makes use of a BeagleBone Black (BBB) embedded computer
                            and a couple basic electronic components for oven control
                            purposes. The BBB computer also runs a Node.js webserver to
                            host the client application and transmit real-time temperature data.
                            The single page web application was created using React.js, a
                            javascript library for building user interfaces. Historical
                            temperature data and custom temperature profiles are persisted on
                            a SQLite database running on the BBB.
                        </p>
                    </div>
                    <div className='pure-u-1 pure-u-md-1-2' style={styles.box}>
                        <h3 style={styles.boxTitle}>Find us on Github</h3>
                        <p style={styles.boxBody}>
                            ROSA is very much a work in progress at the moment. New code and
                            features will continue to be pushed to our GitHub repo
                            throughout the Fall 2015 semester. If the project takes off we
                            may continue to perform development work on ROSA. Feel free to
                            fork us on
                            <a href='https://github.com/mvf4z7/rosa' style={styles.link}> GitHub</a>.
                        </p>
                    </div>
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
