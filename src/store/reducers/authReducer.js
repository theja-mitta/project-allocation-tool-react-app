import { createSlice } from '@reduxjs/toolkit';
import { AuthService } from '../../services/api/auth';

const initialState = {
  authToken: null,
  userPermissions: null, // Add a field to store user permissions
  userRole: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken(state, action) {
      state.authToken = action.payload;
    },
    setUserPermissions(state, action) {
      state.userPermissions = action.payload; // Set user permissions in the state
    },
    setUserRole(state, action) {
      state.userRole = action.payload; // Set user permissions in the state
    },
    setUser(state, action) {
      state.user = action.payload
    },
    resetState(state) {
      state.authToken = null;
      state.userPermissions = null;
      state.userRole = null;
      state.user = null
    },
    // Add other actions if needed
  },
});

// Export actions directly from the authSlice object
export const { setAuthToken, setUserPermissions, setUserRole, setUser, resetState } = authSlice.actions;

// Thunk action to fetch user permissions after setting the auth token
export const setAuthTokenAndFetchUserPermissions = (authToken) => async (dispatch) => {
  try {
    dispatch(setAuthToken(authToken)); // Set the auth token in the state

    // Call the API to get user permissions
    const userPermissions = await AuthService.getUserPermissions(authToken);
    dispatch(setUserPermissions(userPermissions)); // Set the user permissions in the state
    const userRole = await AuthService.getUserRole(authToken);
    dispatch(setUserRole(userRole));
    const user = await AuthService.getUser(authToken);
    console.log('redux state user: ' + user);
    dispatch(setUser(user));
  } catch (error) {
    console.log(error);
    // Handle error if needed
  }
};

export const setStateToInitialState = () => async (dispatch) => {
  dispatch((resetState()));
};

export default authSlice.reducer;


