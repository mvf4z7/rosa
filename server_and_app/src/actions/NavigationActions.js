import alt from '../alt';

class NavigationActions {
    setRouter(data) {
        this.dispatch(data);
    }

    setMenuItems(data) {
        data.menuItems = data.menuItems.map(item => {
            return item.route;
        });

        this.dispatch(data);
    }

    transitionTo(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(NavigationActions);
