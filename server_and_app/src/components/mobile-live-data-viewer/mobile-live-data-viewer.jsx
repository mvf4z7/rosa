import React from 'react';
import Radium from 'radium';

class MobileLiveDataViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = { target: '', actual: '' };
    }

    componentDidMount() {
        this.context.socket.on('tempData', this._socketOnTempData);
    }

    componentWillUnmount() {
        this.context.socket.removeListener('tmepData', this._socketOnTempData);
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={[styles.item, styles.target]}>{this.state.target}</div>
                <div style={[styles.item, styles.actual]}>{this.state.actual}</div>
            </div>
        );
    }

    _socketOnTempData = (data) => {
        this.setState({ target: data.temp+3, actual: data.temp });
    }
}

MobileLiveDataViewer.contextTypes = {
    socket: React.PropTypes.object
}

export default Radium(MobileLiveDataViewer);

var styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '50px',
        alignSelf: 'center',
        marginRight: '0.5rem',
        '@media (min-width: 601px)': {
            display: 'none'
        }
    },
    item: {
        backgroundColor: '#31333A',
        fontSize: '1.25rem',
        margin: '0 1rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '7px',
    },
    target: {
        color: '#0B88D5'
    },
    actual: {
        color: '#00ff00'
    }
}