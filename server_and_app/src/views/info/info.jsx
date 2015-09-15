import React from 'react';
import request from 'superagent';

import LiveHighChart from '../../components/live-highchart/live-highchart';
import { RaisedButton } from 'material-ui';

import styles from './styles';

require('./info.scss');

class Info extends React.Component {
    constructor() {
        super();

        this._startOvenSim = this._startOvenSim.bind(this);
        console.log(styles);
    }

    render() {
        return (
    	 	<div className='info-wrapper'>
    			<h1>Insert Info Page Content Here</h1>
                <LiveHighChart />
                <div style={styles.buttonContainer}>
                    <RaisedButton
                        label='start oven sim'
                        primary={true}
                        linkButton={true}
                        onTouchTap={this._startOvenSim}
                        style={styles.button} />
                </div>
                <br /><br/><br/><br/>
                <h1>hello</h1>
                <h1>hello</h1>
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
