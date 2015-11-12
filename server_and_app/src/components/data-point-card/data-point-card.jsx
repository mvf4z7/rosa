import React from 'react';
import Radium from 'radium';

import CreateProfileActions from '../../actions/CreateProfileActions';

import { TextField } from 'material-ui';

class DataPointCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.point.length != 2) {
            return;
        }

        this.refs.time.setValue(this.props.point[0]);
        this.refs.temp.setValue(this.props.point[1]);
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.index}>{this.props.index+1}</div>
                    <i
                        className='material-icons'
                        onClick={this._onClose}
                        style={styles.closeBtn}>
                            close
                    </i>
                </div>
                <TextField
                    ref='time'
                    floatingLabelText='Time ( s )'
                    onEnterKeyDown={this._updateValue}
                    onBlur={this._updateValue}
                    style={styles.inputContainer} />
                <TextField
                    ref='temp'
                    floatingLabelText='Temp ( C )'
                    onEnterKeyDown={this._updateValue}
                    onBlur={this._updateValue}
                    style={styles.inputContainer} />
            </div>
        );
    }

    _updateValue = () => {
        let data = {
            index: this.props.index,
            time: this.refs.time.getValue(),
            temp: this.refs.temp.getValue()
        }
        CreateProfileActions.modifyPoint(data);
    }

    _onClose = () => {
        CreateProfileActions.deletePoint({ index: this.props.index });
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
    header: {
        width: '100%',
        overflow: 'hidden'
    },
    index: {
        width: '50%',
        float: 'left',
        textAlign: 'left',
        fontSize: '0.8rem',
        padding: '3px 12px'
    },
    closeBtn: {
        float: 'right',
        fontSize: '24px',
        padding: '0 0.5rem',
        cursor: 'pointer'
    },
    inputContainer: {
        margin: '0 1em',
        width: '120px'
    }
};

export default Radium(DataPointCard);
