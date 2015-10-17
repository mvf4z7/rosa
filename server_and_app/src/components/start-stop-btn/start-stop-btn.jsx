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
            }
        };
        let currentState = this.props.ovenOn ? 'on' : 'off';
        currentState = ovenStates[currentState];

        return (
            <div
                style={[styles.container, this.props.ovenOn ? styles.on : styles.off]}
                onClick={currentState.onClick}>
                <span>{currentState.label}</span>
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '10%',
        textAlign: 'center',
        fontSize: '2rem',
        color: 'white',
        '@media screen and (min-width: 64em)': {
            ':hover': {
                opacity: '0.75'
            }
        }
    },
    on: {
        backgroundColor: colors.red500
    },
    off: {
        backgroundColor: colors.green500
    }
}
