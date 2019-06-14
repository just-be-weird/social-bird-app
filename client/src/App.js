import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert'
//Redux 
import { Provider } from 'react-redux';//This combines redux and react togather
import store from './store';

import './App.css';


const App = () => (
	<Provider store={store}>
		<Router>
			<Fragment>
				<Navbar />
				<Route exact path='/' component={Landing} />
				<section className="container">
					<Alert />
					<Switch>
						<Route exact path='/login' component={Login} />
						<Route exact path='/register' component={Register} />
					</Switch>
				</section>
			</Fragment>
		</Router>
	</Provider>
);

export default App;