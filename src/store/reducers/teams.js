import {
    FETCH_TEAMS_SCANS_TYPE,
} from '../action-creators';

export const fetchTeamsReducer = (state = [],
    {
        type,
        payload = null,
}) => {
    switch (type) {
        case FETCH_TEAMS_SCANS_TYPE:
            return payload;
        default:
            return state;
    }
}
