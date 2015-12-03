import React from 'react';
import { Router, Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './views/app/app';
import Home from './views/home/home';
import Profiles from './views/profiles/profiles';
import CreateProfile from './views/profiles/create-profile/create-profile';
import EditProfile from './views/profiles/edit-profile/edit-profile';
import Info from './views/info/info';
import Users from './views/users/users';
import Logout from './views/logout/logout';

var routes = (
  <Route path='/' handler={ App }>
    <DefaultRoute name='home' handler={ Home }/>
    <Route name='create-profile' path='/create-profile' handler={CreateProfile}/>
    <Route name='edit-profile' path='/edit-profile' handler={EditProfile}/>
    <Route name='users' path='/users' handler={ Users }/>
    <Route name='info' path='/info' handler={ Info }/>
    <Route name='logout' path='/logout' handler={ Logout }/>
  </Route>
);

export default routes;
