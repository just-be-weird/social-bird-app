import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

//get current users profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get("/api/profile/me");

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
//create or update profile
export const createProfile = (
    formData,
    history, //redirect once form is submitted
    edit = false // to identify -> its editing or creating
) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post("/api/profile", formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
        dispatch(
            setAlert(edit ? "Profile is updated." : "Profile is created.", 'success')
        );

        if (!edit) {
            history.push("/dashboard"); //Redirecting in ACTIONS is not possible using Redirect component so we have to use history object
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger", 5000));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
