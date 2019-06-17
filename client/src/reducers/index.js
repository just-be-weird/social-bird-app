//This is our root reducer
import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import post from './post';
import profile from './profile';

//These will evantually evalutae to state object from where we can expose different values to components across application
export default combineReducers({
    alert,
    auth,
    post,
    profile
});