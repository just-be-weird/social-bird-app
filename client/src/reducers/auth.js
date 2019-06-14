import {
    REGISTER_FAIL,
    REGISTER_SUCCESS
} from '../actions/types';


const intialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default (state = intialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case REGISTER_FAIL:
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            };

        case REGISTER_SUCCESS:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            };

        default:
            return state;
    }
}
