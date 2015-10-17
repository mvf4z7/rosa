import React from 'react';
import Radium from 'radium';
import request from 'superagent';

import mui, { RaisedButton, FlatButton } from 'material-ui';

let colors = mui.Styles.Colors;

class StartStopBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let ovenStates = {
            on: {
                label: 'Stop Oven',
                onClick: this._onClickStop
            },
            off: {
                label: 'Start Oven',
                onClick: this._onClickStart.bind(null, this.props.profile)
            },
            disabled: {
                label: 'Loading...',
                onClick: function(){}
            }
        };

        let currentState;
        if(this.props.disable) {
            currentState = ovenStates.disabled;
        } else {
            currentState = this.props.ovenOn ? 'on' : 'off';
            currentState = ovenStates[currentState];
        }

        return (
            <div
                ref='container'
                style={[styles.container, this.props.ovenOn ? styles.on : styles.off, this.props.disable && styles.disabled]}
                onClick={currentState.onClick}>
                <div ref='child' style={styles.child}>{currentState.label}</div>
            </div>
        );
    }

    _onClickStart = (profile) => {
        request
            .put('/api/ovensim')
            .send({ profile: profile })
            .end(function(err, res) {
                if(res.body.error) {
                    alert('Error: ' + res.body.error);
                }
            })
    }

    _onClickStop = () => {
        console.log('in onClickStop');
        request
            .del('/api/ovensim')
            .end(function(err, res) {
                console.log(res.body);
            });
    }
}

export default Radium(StartStopBtn);

let styles = {
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: '2rem',
        cursor: 'pointer',
        color: 'white',
        '@media screen and (min-width: 64em)': {
            ':hover': {
                opacity: '0.8'
            }
        }
    },
    child: {
        padding: '0.9rem 0',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        ':active': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }
    },
    on: {
        backgroundColor: colors.red500
    },
    off: {
        backgroundColor: colors.green500
    },
    disabled: {
        backgroundColor: colors.grey500
    }
}
