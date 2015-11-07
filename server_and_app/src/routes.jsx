import React from 'react';
import { Router, Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './views/app/app';
import Home from './views/home/home';
import Profiles from './views/profiles/profiles';
import Info from './views/info/info';
import Logout from './views/logout/logout';

var routes = (
  <Route path='/' handler={ App }>
    <DefaultRoute name='home' handler={ Home }/>
    <Route name='info' path='/info' handler={ Info }/>
    <Route name='profiles' path='/profiles' handler={ Profiles }/>
    <Route name='logout' path='/logout' handler={ Logout }/>
  </Route>
);

export default routes;
