import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Routes from "./components/routing/Routes";

//Redux
import { Provider } from "react-redux"; //This combines redux and react togather
import store from "./store";

import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []); //its just like ecomponentDidMount if passed []

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Switch>
                        <Route exact path='/' component={Landing} />
                        <Route component={Routes} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
