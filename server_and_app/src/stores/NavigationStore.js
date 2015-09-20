import alt from '../alt';
import NavigationActions from '../actions/NavigationActions';

let router = null;
let menuItems = null;

class NavigationStore {
  constructor() {
    this.selectedIndex = 0;
    this.currentRoute = null;

    this.bindListeners({
        handleSetRouter: NavigationActions.SET_ROUTER,
        handleSetMenuItems: NavigationActions.SET_MENU_ITEMS,
        handleSetCurrentRoute: NavigationActions.SET_CURRENT_ROUTE,
        handleTransitionTo: NavigationActions.TRANSITION_TO
    });
  }

  handleSetRouter(data) {
      router = data.router;
      this.preventDefault(); //supress change event
  }

  handleSetMenuItems(data) {
      menuItems = data.menuItems;
  }

  handleSetCurrentRoute(data) {
      this.currentRoute = data.route;
      this.selectedIndex = menuItems.indexOf(data.route);
  }

  handleTransitionTo(data) {
      this.currentRoute = data.route;
      this.selectedIndex = menuItems.indexOf(data.route);
      router.transitionTo(data.route);
  }
}

module.exports = alt.createStore(NavigationStore, 'NavigationStore');
