import {
    fetchTeamsScans,
} from '../../services';

export const FETCH_TEAMS_SCANS_TYPE = 'FETCH_TEAMS_SCANS';
export const FETCH_TEAMS_SCANS = (periods, division) => {
    return async (dispatch) => {

        const teamsData = await fetchTeamsScans(periods, division);

        dispatch( {
            type: FETCH_TEAMS_SCANS_TYPE,
            payload: teamsData
        });
    }
};
