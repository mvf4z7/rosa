import React from 'react';
import Radium from 'radium';
import styles from './styles';

require('./styles.scss');

class Spinner extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={styles.spinnerWrapper}>
                <div className='spinner-loader'></div>
            </div>
		);
	}
}

export default Radium(Spinner);