import React from 'react';
import { LeftNav } from 'material-ui';
import styles from './styles';

console.log('styles: ', styles);

class NavDrawer extends React.Component {
    constructor(props) {
        super(props);

        // Default selected menu item to 'home'
        this.state = { selectedIndex: 0 };

        this.toggle = this.toggle.bind(this);
        this._onLeftNavChange = this._onLeftNavChange.bind(this);
    }

    _onLeftNavChange(e, selectedIndex, menuItem) {
        this.context.router.transitionTo(menuItem.route);
        this.setState({ selectedIndex: selectedIndex });
    }

    toggle() {
        this.refs.leftNav.toggle();
    }

    render() {
        return (
            <LeftNav
                ref='leftNav'
                docked={false}
                menuItems={this.props.menuItems}
                selectedIndex={this.state.selectedIndex}
                onChange={this._onLeftNavChange}
                style={styles.LeftNav} />
        );
    }
}

NavDrawer.contextTypes = {
    router: React.PropTypes.func
};

export default NavDrawer;
