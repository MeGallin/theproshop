import axios from 'axios';
import {
  CONTACT_FORM_REQUEST,
  CONTACT_FORM_SUCCESS,
  CONTACT_FORM_FAILURE,
} from '../constants/formConstants';

export const contactFormMessage =
  (name, email, message) => async (dispatch) => {
    try {
      dispatch({
        type: CONTACT_FORM_REQUEST,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `/api/send`,
        { name: name, email: email, message: message },
        config,
      );
      dispatch({
        type: CONTACT_FORM_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CONTACT_FORM_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
