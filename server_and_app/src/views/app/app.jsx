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
    },

    LeftNav: {
        color: Colors.greenA700
    }
};

let menuItems = [
    { route: '/', text: 'home' },
    { route: '/info', text: 'info' }
]

require('./app.scss');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedIndex: 0 };

        this._toggleNav = this._toggleNav.bind(this);
        this._onLeftNavChange = this._onLeftNavChange.bind(this);
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        }
    }

    render() {
        return (
    		<div id="app-wrapper">
                <AppBar
                    title='ROSA'
                    style={styles.AppBar}
                    onLeftIconButtonTouchTap={this._toggleNav}/>
                <LeftNav
                    ref='leftNav'
                    docked={false}
                    menuItems={menuItems}
                    selectedIndex={this.state.selectedIndex}
                    onChange={this._onLeftNavChange}
                    style={styles.LeftNav} />
                <RouteHandler />
    		</div>
        );
    }

    _toggleNav(e) {
        e.preventDefault();
        this.refs.leftNav.toggle();
    }

    _onLeftNavChange(e, selectedIndex, menuItem) {
        this.context.router.transitionTo(menuItem.route);
        this.setState({selectedIndex: selectedIndex})
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

App.contextTypes = {
    router: React.PropTypes.func
};

export default App;
