import React from 'react';
import socket from '../../socket-client';
import mui from 'material-ui';

import NavigationStore from '../../stores/NavigationStore';
import OvenStore from '../../stores/OvenStore';

import NavigationActions from '../../actions/NavigationActions';
import OvenActions from '../../actions/OvenActions';

import { AppBar, LeftNav } from 'material-ui';
import { RouteHandler } from 'react-router';
import MobileLiveDataViewer from '../../components/mobile-live-data-viewer/mobile-live-data-viewer';

import styles from './styles';
import theme from './theme';

let ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setTheme(theme);

let menuItems = [
    { route: '/', text: 'home' },
    { route: '/create-profile', text: 'create profile' },
    { route: '/edit-profile', text: 'edit profile' },
    { route: '/users', text: 'manage users' },
    { route: '/info', text: 'info' },
    { route: '/logout', text: 'logout'}
];

class App extends React.Component {
    constructor(props) {
        super(props);

        let navigationStoreState = NavigationStore.getState();
        let ovenStoreState = OvenStore.getState();
        this.state = {
            selectedIndex: navigationStoreState.selectedIndex,
            currentRoute: navigationStoreState.currentRoute,
            ovenOn: ovenStoreState.ovenOn
        }

        this._toggleNav = this._toggleNav.bind(this);
        this._onLeftNavChange = this._onLeftNavChange.bind(this);
        this._onStoreChange = this._onStoreChange.bind(this);
    }

    static willTransitionTo() {
        NavigationActions.setMenuItems({ menuItems: menuItems });
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
            socket: socket
        }
    }

    componentDidMount() {
        OvenActions.fetchOvenState();

        NavigationStore.listen(this._onStoreChange);
        OvenStore.listen(this._onOvenStoreChange);
    }

    componentWillUnmount() {
        NavigationStore.unlisten(this._onStoreChange);
        OvenStore.unlisten(this._onOvenStoreChange);
    }

    render() {
        return (
    		<div style={styles.appWrapper}>
                <AppBar
                    title='ROSA'
                    iconElementRight={<MobileLiveDataViewer hide={!this.state.ovenOn}/>}
                    style={styles.AppBar}
                    onLeftIconButtonTouchTap={this._toggleNav} />
                <LeftNav
                    ref='leftNav'
                    docked={false}
                    menuItems={menuItems}
                    selectedIndex={this.state.selectedIndex}
                    onChange={this._onLeftNavChange}
                    style={styles.LeftNav} />
                <RouteHandler ovenOn={this.state.ovenOn}/>
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

    _onOvenStoreChange = (state) => {
        this.setState(state);
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object,
    socket: React.PropTypes.object
};

export default App;
