import React from 'react';
import { RouteHandler, Link } from 'react-router';

//import Header from '../../components/header/header';

import mui from 'material-ui';
let Colors = mui.Styles.Colors;
let ThemeManager = new mui.Styles.ThemeManager();

import { AppBar, LeftNav } from 'material-ui';

let styles = {
    AppBar: {
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: Colors.greenA700,
    }
};

let menuItems = [
    { route: 'info', text: 'info' }
]

require('./app.scss');

class App extends React.Component {
    constructor(props) {
        super(props);
        this._toggleNav.bind(this);
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        }
    }

    render() {
        return (
    		<div className="app-wrapper">
                <AppBar
                    title='ROSA'
                    style={styles.AppBar}
                    onLeftIconButtonTouchTap={this._toggleNav.bind(this)}/>
                <LeftNav ref='leftNav' docked={false} menuItems={menuItems} />
                <RouteHandler />
    		</div>
        );
    }

    _toggleNav() {
        this.refs.leftNav.toggle();
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;
