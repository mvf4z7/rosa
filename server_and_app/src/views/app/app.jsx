import React from 'react';
import { RouteHandler } from 'react-router';
import socket from '../../socket-client';
import mui from 'material-ui';

import NavigationStore from '../../stores/NavigationStore';
import NavigationActions from '../../actions/NavigationActions';

import { AppBar, LeftNav } from 'material-ui';
import NavDrawer from '../../components/nav-drawer/nav-drawer';

import styles from './styles';
import theme from './theme';

let ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setTheme(theme);

let menuItems = [
    { route: '/', text: 'home' },
    { route: '/info', text: 'info' }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = NavigationStore.getState();

        this._toggleNav = this._toggleNav.bind(this);
        this._onLeftNavChange = this._onLeftNavChange.bind(this);
        this._onStoreChange = this._onStoreChange.bind(this);
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
            socket: socket
        }
    }

    componentDidMount() {
        NavigationStore.listen(this._onStoreChange);
        NavigationActions.setRouter({ router: this.context.router });
        NavigationActions.setMenuItems({ menuItems: menuItems });
    }

    componentWillUnmount() {
        NavigationStore.unlisten(this._onStoreChange);
    }

    render() {
        return (
    		<div style={styles.appWrapper}>
                <AppBar
                    title='ROSA'
                    style={styles.AppBar}
                    className='no-select'
                    onLeftIconButtonTouchTap={this._toggleNav} />
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
        NavigationActions.transitionTo({
            route: menuItem.route,
        });
    }

    _onStoreChange(state) {
        this.setState(state);
    }
}

App.contextTypes = {
    router: React.PropTypes.func,
};

App.childContextTypes = {
    muiTheme: React.PropTypes.object,
    socket: React.PropTypes.object
};

export default App;
