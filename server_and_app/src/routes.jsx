import React from 'react';
import { Router, Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './views/app/app';
import Home from './views/home/home';
import Info from './views/info/info';

var routes = (
  <Route name='app' path='/' handler={ App }>
    <Route name='home' path='/' handler={ Home }/>
    <Route name='info' path='/info' handler={ Info }/>
    <DefaultRoute handler={ Home }/>
  </Route>
);

export default routes;
