import { combineReducers } from 'redux';

import {
    fetchTeamsReducer,
} from './teams';

/**
 * The root reducer of the app
 */
export default combineReducers({
    teams: fetchTeamsReducer,
});
