import React from 'react';
import { Router, Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './views/app/app';
import Home from './views/home/home';
import Profiles from './views/profiles/profiles';
import CreateProfile from './views/profiles/create-profile/create-profile';
import Info from './views/info/info';
import Adduser from './views/adduser/adduser';
import Logout from './views/logout/logout';

var routes = (
  <Route path='/' handler={ App }>
    <DefaultRoute name='home' handler={ Home }/>
    <Route name='create-profile' path='/create-profile' handler={CreateProfile}/>
    <Route name='profiles' path='/profiles' handler={ Profiles }/>
    <Route name='adduser' path='/adduser' handler={ Adduser }/>
    <Route name='info' path='/info' handler={ Info }/>
    <Route name='logout' path='/logout' handler={ Logout }/>
  </Route>
);

export default routes;
