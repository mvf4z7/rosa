import React from 'react';
import { RouteHandler } from 'react-router';
import mui from 'material-ui';

import { AppBar } from 'material-ui';
import NavDrawer from '../../components/nav-drawer/nav-drawer';

import styles from './styles';
import theme from './theme';

let ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setTheme(theme);

let menuItems = [
    { route: '/', text: 'home' },
    { route: '/info', text: 'info' }
]

class App extends React.Component {
    constructor(props) {
        super(props);
        this._toggleNav = this._toggleNav.bind(this);
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
                    className='no-select'
                    onLeftIconButtonTouchTap={this._toggleNav} />
                <NavDrawer ref='navDrawer' menuItems={menuItems}/>
                <RouteHandler />
    		</div>
        );
    }

    _toggleNav(e) {
        e.preventDefault();
        this.refs.navDrawer.toggle();
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;
