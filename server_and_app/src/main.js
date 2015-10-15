import React from 'react';
import Router from 'react-router';
import routes from './routes';
import NavigationActions from './actions/NavigationActions';

var fastclick = require('fastclick');
fastclick.attach(document.body);

let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

let router = Router.create({
    routes: routes
});

NavigationActions.setRouter({ router: router });

router.run(Handler => React.render(<Handler />, document.getElementById('content')));
