import { combineReducers } from 'redux';
import userSlice from './reducers/userSlice';
import musicSlice from './reducers/musicSlice';

const rootReducer = combineReducers({
  user: userSlice,
  music: musicSlice,
});

export default rootReducer;
