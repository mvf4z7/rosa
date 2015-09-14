import alt from '../alt';
import NavigationActions from '../actions/NavigationActions';

let router = null;
let menuItems = null;

class NavigationStore {
  constructor() {
    this.selectedIndex = 0;

    this.bindListeners({
        handleSetRouter: NavigationActions.SET_ROUTER,
        handleSetMenuItems: NavigationActions.SET_MENU_ITEMS,
        handleTransitionTo: NavigationActions.TRANSITION_TO,
    });
  }

  handleSetRouter(data) {
      router = data.router;
      this.preventDefault(); //supress change event
  }

  handleSetMenuItems(data) {
      menuItems = data.menuItems;
  }

  handleTransitionTo(data) {
      this.selectedIndex = menuItems.indexOf(data.route);
      router.transitionTo(data.route);
  }
}

module.exports = alt.createStore(NavigationStore, 'NavigationStore');
