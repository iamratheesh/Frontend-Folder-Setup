// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from '@/redux/slice/auth.slice';
import { UserSlice } from './slice/user.slice';


const rootReducer = combineReducers({
  auth: authReducer,
  user: UserSlice.reducer,

});

export default rootReducer;