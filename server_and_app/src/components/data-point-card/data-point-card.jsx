import React from 'react';
import Radium from 'radium';

import { TextField } from 'material-ui';

class DataPointCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(!this.props.point.length) {
            return;
        }

        this.refs.time.setValue(this.props.point[0]);
        this.refs.temp.setValue(this.props.point[1]);
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.index}>{this.props.index}</div>
                <TextField
                    ref='time'
                    floatingLabelText='Time ( s )'
                    onEnterKeyDown={this._updateValue}
                    style={styles.inputContainer} />
                <TextField
                    ref='temp'
                    floatingLabelText='Temp ( C )'
                    onEnterKeyDown={this._updateValue}
                    style={styles.inputContainer} />
            </div>
        );
    }

    _updateValue = () => {
        console.log('enter key down');
        this.refs.time.blur();
        this.refs.temp.blur();
    }
}



let styles = {
    container: {
        display: 'inline-block',
        position: 'relative',
        backgroundColor: '#FFFAFA',
        boxShadow: '0px 10px 6px -6px #777',
        padding: '10px',
        margin: '1rem 1rem',
        textAlign: 'center'
    },
    index: {
        textAlign: 'left',
        fontSize: '0.8rem',
        padding: '3px 12px'
    },
    inputContainer: {
        margin: '0 1em',
        width: '120px'
    }
};

export default Radium(DataPointCard);
