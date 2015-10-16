import React from 'react';
import Radium from 'radium';
import request from 'superagent';

import mui, { RaisedButton } from 'material-ui';

let colors = mui.Styles.Colors;

class StartStopBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let ovenStates = {
            on: {
                label: 'Stop Oven',
                backgroundColor: colors.red500,
                onClick: this._onClickStop
            },
            off: {
                label: 'Start Oven',
                backgroundColor: colors.green500,
                onClick: this._onClickStart.bind(null, this.props.profile)
            }
        };

        let currentState = this.props.ovenOn ? 'on' : 'off';
        let btnProps = ovenStates[currentState];

        console.log(btnProps.onClick);
        console.log('stopstartbutton props: ', this.props);

        return (
            <RaisedButton
                primary={true}
                disable={this.props.disable}
                linkButton={true}
                label={btnProps.label}
                backgroundColor={btnProps.backgroundColor}
                onClick={btnProps.onClick}
                style={styles.base}
            />
        );
    }


    click() {
        console.log('i was clicked');
    }

    _onClickStart = (profile) => {

        console.log('in onclick start');
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
    base: {
        width: '100%',
        textAlign: 'center',
    }
}
