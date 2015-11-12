import React from 'react';
import { Router, Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './views/app/app';
import Home from './views/home/home';
import Profiles from './views/profiles/profiles';
import CreateProfile from './views/profiles/create-profile/create-profile';
import Info from './views/info/info';

var routes = (
  <Route path='/' handler={App}>
    <DefaultRoute name='home' handler={Home}/>
    <Route name='create-profile' path='/create-profile' handler={CreateProfile}/>
    <Route name='profiles' path='/profiles' handler={Profiles}/>
    <Route name='info' path='/info' handler={Info}/>
  </Route>
);

export default routes;
