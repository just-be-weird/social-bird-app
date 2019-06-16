import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
const PrivateRoute = ({
    //here first part is being passed or recived and whatever is available on that is destructured
    component: Component,
    auth: { isAuthenticated, loading },
    ...rest// rest is used to spread remaining props
}) => {
    return (
        /* 
        So to recap, if you need to pass a prop to a component being rendered by React Router,
        instead of using Routes component prop, use its render prop passing it an inline function
        then pass along the arguments to the element you’re creating.
        Ref:  https://tylermcginnis.com/react-router-pass-props-to-components/
        */
        <Route
            {...rest}
            render={
                props => !isAuthenticated && !loading ?
                    (<Redirect to='/login' />) :
                    (<Component {...props} />)
            }
        />)
}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps)(PrivateRoute);
