import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

/**
 * As we want to dispatch multiple action/actionTypes, so use dispatch provided by redux-thunk 
 * @param {string} msg succes/error
 * @param {string} alertType success/error
 */
export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4();//random long string
    //now we wana call that reducer-setalert by 
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })
}