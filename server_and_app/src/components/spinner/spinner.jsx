import React from 'react';
import Radium from 'radium';

import styles from './styles';
// These styles have been transitioned to the styles.js file, but
// there seems to be animation issues with mobile Safari.
//require('./styles.scss');

class Spinner extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={styles.spinnerWrapper}>
                <div style={styles.spinner}></div>
            </div>
		);
	}
}

export default Radium(Spinner);
