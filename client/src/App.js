import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import Alert from './components/layouts/Alert'
//Redux 
import { Provider } from 'react-redux';//This combines redux and react togather
import store from './store';

import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser())
	}, []);//its just like ecomponentDidMount if passed []

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Route exact path='/' component={Landing} />
					<section className="container">
						<Alert />
						<Switch>
							<PrivateRoute exact path='/dashboard' component={Dashboard} />
							<PrivateRoute exact path='/create-profile' component={CreateProfile} />
							<Route exact path='/login' component={Login} />
							<Route exact path='/register' component={Register} />
						</Switch>
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
}

export default App;
